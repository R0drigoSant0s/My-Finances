import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Menu, Home, CreditCard, BarChart2, LineChart, Settings, LogOut, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { signOut } from '@/lib/supabase';
import logoImg from '@/assets/logo.jpg';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  // Fecha o menu ao navegar em dispositivos móveis
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);
  
  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { path: '/home', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/transactions', label: 'Transações', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/goals', label: 'Metas', icon: <LineChart className="w-5 h-5" /> },
    { path: '/credit-cards', label: 'Cartões de Crédito', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];
  
  // Determina se o sidebar deve ser fixo (desktop) ou flutuante (mobile)
  const sidebarClass = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
    : 'fixed inset-y-0 left-0 w-64 border-r border-gray-200 dark:border-gray-700';
    
  // Overlay que aparece apenas em mobile quando o menu está aberto
  const overlay = isMobile && isSidebarOpen && (
    <div 
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => setIsSidebarOpen(false)}
    />
  );

  // Renderiza o menu
  const renderMenu = () => (
    <nav className="p-3 pt-2">
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-menu-item">
            <Link href={item.path}>
              <div className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location === item.path 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
                <span className={`mr-3 ${
                  location === item.path 
                    ? 'text-blue-700 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left"
        >
          <div className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </div>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {overlay}
      
      {isMobile ? (
        // Layout Mobile com sidebar flutuante
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
          {/* Header para mobile */}
          <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-4 flex items-end pb-3 shadow-sm safe-area-header">
            <div className="flex items-center header-content w-full justify-between">
              <div className="flex items-center">
                <img src={logoImg} alt="Logo" className="h-8 w-8 mr-3 rounded-full" />
                <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">Minhas Finanças</h1>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/30"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </header>
          
          {/* Sidebar flutuante para mobile */}
          <div className={`${sidebarClass} bg-white dark:bg-gray-900 h-full overflow-y-auto safe-area-padding`}>
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-3 border-b border-gray-200 dark:border-gray-800 flex items-end pb-3 safe-area-sidebar-header">
              <div className="flex items-center w-full justify-between header-content">
                <div className="flex items-center">
                  <img src={logoImg} alt="Logo" className="h-8 w-8 mr-3 rounded-full" />
                  <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">Minhas Finanças</h1>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-1">
              {renderMenu()}
            </div>
          </div>
          
          {/* Conteúdo principal */}
          <main className="flex-1 overflow-auto p-4 md:p-6 safe-area-bottom">
            {children}
          </main>
        </div>
      ) : (
        // Layout Desktop com sidebar fixa
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
          {/* Sidebar fixa para desktop */}
          <aside className="w-[260px] bg-white dark:bg-gray-900 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700 safe-area-padding">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-3 border-b border-gray-200 dark:border-gray-800 flex items-end pb-3 safe-area-sidebar-header">
              <div className="flex items-center header-content">
                <img src={logoImg} alt="Logo" className="h-8 w-8 mr-3 rounded-full" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Minhas Finanças</h1>
              </div>
            </div>
            {renderMenu()}
          </aside>
          
          {/* Conteúdo principal */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      )}
    </>
  );
}