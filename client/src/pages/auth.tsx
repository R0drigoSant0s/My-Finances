import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp, isAuthenticated } from '@/lib/supabase';
import loginImage from '@/assets/login-image.jpg';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Trim whitespace from email and password
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (isLogin) {
        // Login with Supabase
        const { error } = await signIn(trimmedEmail, trimmedPassword);
        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('Email ou senha incorretos');
          }
          throw error;
        }
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        navigate('/');
      } else {
        // Registration validation
        if (password !== confirmPassword) {
          toast({
            title: "Erro de validação",
            description: "As senhas não coincidem",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast({
            title: "Erro de validação",
            description: "A senha deve ter pelo menos 6 caracteres",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Register with Supabase
        const { error } = await signUp(trimmedEmail, trimmedPassword, username.trim());
        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('Este email já está cadastrado');
          }
          throw error;
        }
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada. Você já pode fazer login.",
        });
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-950 dark:to-blue-950">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-950 dark:to-blue-950 flex flex-col items-center justify-center p-4 safe-area-padding">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="overflow-hidden rounded-full w-24 h-24 shadow-lg border-2 border-blue-500 dark:border-blue-600">
              <img 
                src={loginImage} 
                alt="Logo Minhas Finanças" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Minhas Finanças</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isLogin ? 'Faça login para acessar sua conta' : 'Crie sua conta para começar'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
              <button
                className={`pb-2 px-4 text-sm font-medium ${
                  isLogin
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Login
              </button>
              <button
                className={`pb-2 px-4 text-sm font-medium ${
                  !isLogin
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Cadastro
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome de usuário
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Seu nome de usuário"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Sua senha"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Confirme sua senha"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password strength indicators */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs">
                        {password.length >= 6 ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                        )}
                        <span className={password.length >= 6 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          Mínimo de 6 caracteres
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs">
                        {password === confirmPassword && password ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                        )}
                        <span className={password === confirmPassword && password ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          Senhas coincidem
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${
                  isLoading
                    ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Entrando...' : 'Cadastrando...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Entrar' : 'Cadastrar'}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
              
              {/* Login rápido para testes - Remover em produção */}
              <button
                type="button"
                onClick={(e) => {
                  setEmail('teste@exemplo.com');
                  setPassword('teste123');
                  handleSubmit(e as any);
                }}
                className="mt-4 text-xs text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                Login rápido para testes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}