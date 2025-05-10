import AppLayout from '@/components/Layout/AppLayout';
import { useState } from 'react';
import { Moon, Sun, DollarSign, User, Bell, Shield, Download, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  // Estado para as configurações
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [currency, setCurrency] = useState('BRL');
  const [notifications, setNotifications] = useState(true);
  
  // Função para alternar o modo escuro/claro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferências Gerais</h2>
            
            <div className="space-y-6">
              {/* Modo Escuro / Claro */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {darkMode ? 
                    <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : 
                    <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  }
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tema</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {darkMode ? 'Modo escuro ativado' : 'Modo claro ativado'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Moeda */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Moeda</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Selecione a moeda para exibir seus valores
                    </p>
                  </div>
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BRL">Real (R$)</option>
                  <option value="USD">Dólar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              
              {/* Notificações */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificações</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Receba alertas sobre vencimentos e limites
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Conta</h2>
            
            <div className="space-y-6">
              {/* Perfil */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Perfil</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Gerencie suas informações pessoais
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Editar
                </button>
              </div>
              
              {/* Segurança */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Segurança</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Altere sua senha e configure a autenticação
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Configurar
                </button>
              </div>
              
              {/* Exportar Dados */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Exportar Dados</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Baixe seus dados em CSV ou PDF
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Exportar
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ajuda e Suporte</h2>
            
            <div className="space-y-6">
              {/* Centro de Ajuda */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Centro de Ajuda</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Encontre respostas para suas dúvidas
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Visitar
                </button>
              </div>
              
              {/* Versão do App */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <span className="text-xs font-bold">v</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Versão do Aplicativo</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Minhas Finanças v1.0.0
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Atualizado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}