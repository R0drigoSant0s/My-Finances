import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Home, ArrowUpDown, PieChart, User } from 'lucide-react';

interface BottomNavigationProps {
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
}

export default function BottomNavigation({ 
  setIsNewTransactionModalOpen 
}: BottomNavigationProps) {
  const [location, navigate] = useLocation();
  
  // Função para vibração tátil ao clicar em botões (se suportado)
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5); // Vibração muito curta (5ms)
    }
  };
  
  // Função para navegar com feedback tátil
  const handleNavigation = (path: string) => {
    triggerHapticFeedback();
    navigate(path);
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Verificar se há mudança no URL para atualizar a navegação
  useEffect(() => {
    const navItems = document.querySelectorAll('.nav-indicator');
    navItems.forEach(item => {
      const itemPath = item.getAttribute('data-path');
      if (itemPath && (location === itemPath || (itemPath === '/' && location === '/home'))) {
        item.classList.add('nav-indicator-active');
      } else {
        item.classList.remove('nav-indicator-active');
      }
    });
  }, [location]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-30 safe-area-bottom transition-all duration-300">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => handleNavigation('/')} 
          className={`flex flex-col items-center justify-center w-full h-full touch-area-expanded ${
            isActive('/') || isActive('/home') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          aria-label="Página Inicial"
        >
          <div className="relative">
            <Home size={22} className="transition-transform duration-200 transform hover:scale-110" />
            <div 
              className="nav-indicator absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 transition-all duration-300 scale-0 opacity-0"
              data-path="/"
            ></div>
          </div>
          <span className="text-xs mt-1">Home</span>
          {(isActive('/') || isActive('/home')) && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-md bg-blue-600 transition-all duration-300"></div>
          )}
        </button>
        
        <button 
          onClick={() => handleNavigation('/transactions')} 
          className={`flex flex-col items-center justify-center w-full h-full touch-area-expanded ${
            isActive('/transactions') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          aria-label="Lista de Transações"
        >
          <div className="relative">
            <ArrowUpDown size={22} className="transition-transform duration-200 transform hover:scale-110" />
            <div 
              className="nav-indicator absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 transition-all duration-300 scale-0 opacity-0"
              data-path="/transactions"
            ></div>
          </div>
          <span className="text-xs mt-1">Transações</span>
          {isActive('/transactions') && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-md bg-blue-600 transition-all duration-300"></div>
          )}
        </button>
        
        <button 
          onClick={() => handleNavigation('/goals')} 
          className={`flex flex-col items-center justify-center w-full h-full touch-area-expanded ${
            isActive('/goals') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          aria-label="Metas Financeiras"
        >
          <div className="relative">
            <PieChart size={22} className="transition-transform duration-200 transform hover:scale-110" />
            <div 
              className="nav-indicator absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 transition-all duration-300 scale-0 opacity-0"
              data-path="/goals"
            ></div>
          </div>
          <span className="text-xs mt-1">Metas</span>
          {isActive('/goals') && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-md bg-blue-600 transition-all duration-300"></div>
          )}
        </button>
        
        <button 
          onClick={() => handleNavigation('/settings')} 
          className={`flex flex-col items-center justify-center w-full h-full touch-area-expanded ${
            isActive('/settings') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          aria-label="Configurações e Perfil"
        >
          <div className="relative">
            <User size={22} className="transition-transform duration-200 transform hover:scale-110" />
            <div 
              className="nav-indicator absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 transition-all duration-300 scale-0 opacity-0"
              data-path="/settings"
            ></div>
          </div>
          <span className="text-xs mt-1">Perfil</span>
          {isActive('/settings') && (
            <div className="absolute bottom-0 w-8 h-1 rounded-t-md bg-blue-600 transition-all duration-300"></div>
          )}
        </button>
      </div>
    </div>
  );
}