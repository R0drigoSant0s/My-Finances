import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { isAuthenticated } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        
        if (!authenticated) {
          navigate('/auth');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/auth');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}