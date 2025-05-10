import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { signOut, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUsername(user?.user_metadata?.username || user?.email?.split('@')[0] || 'Usuário');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{username}</span>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{username}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings or open settings modal
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Configurações
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}