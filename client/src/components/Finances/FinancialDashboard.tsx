import React, { useState, useEffect } from 'react';
import { Search, Bell, ArrowUp, ArrowDown, LineChart, Filter, Plus, Info, Menu } from 'lucide-react';
import { Transaction, Budget } from './types';
import '@/styles/FinancialDashboard.css';
import '@/styles/MobileFinances.css';

interface FinancialDashboardProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: Transaction[];
  budgets: Budget[];
  formatCurrency: (value: number) => string;
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
  setIsNewBudgetModalOpen: (isOpen: boolean) => void;
  handleEditTransaction: (transaction: Transaction) => void;
  getBudgetName: (budgetId: number | undefined) => string;
}

export default function FinancialDashboard({
  balance,
  totalIncome,
  totalExpenses,
  transactions,
  budgets,
  formatCurrency,
  setIsNewTransactionModalOpen,
  setIsNewBudgetModalOpen,
  handleEditTransaction,
  getBudgetName
}: FinancialDashboardProps) {
  // Pega as 5 transações mais recentes
  const recentTransactions = transactions.slice(0, 5);
  
  // Estado para verificar se é mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Referência para o carrossel
  const carouselRef = React.useRef<HTMLDivElement>(null);
  
  // Detecção de dispositivo mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Versão mobile otimizada
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 pb-20">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-4 shadow-sm safe-area-header">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-2 text-lg font-bold text-gray-800 dark:text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Carrossel de Cards */}
        <div className="px-4 pt-4">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
          >
            {/* Card de Saldo */}
            <div className="snap-center min-w-[85%] flex-shrink-0 px-2 first:pl-0">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-2xl mr-2">
                      <LineChart className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Saldo Atual</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">3.2%</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(balance)}</p>
              </div>
            </div>
            
            {/* Card de Receitas */}
            <div className="snap-center min-w-[85%] flex-shrink-0 px-2">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-2xl mr-2">
                      <ArrowUp className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Receitas</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">0.8%</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
            
            {/* Card de Despesas */}
            <div className="snap-center min-w-[85%] flex-shrink-0 px-2 last:pr-4">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-2xl mr-2">
                      <ArrowDown className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Despesas</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-xs text-red-500">2.1%</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
          
          {/* Indicadores de posição */}
          <div className="flex justify-center mt-2 mb-4">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 mx-1 rounded-full ${
                  activeIndex === idx ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Lista de Transações */}
        <div className="px-4 flex-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">Transações Recentes</h2>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Search size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800 transaction-list-mobile">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Nenhuma transação registrada</p>
                  <button 
                    className="mt-2 text-blue-600"
                    onClick={() => setIsNewTransactionModalOpen(true)}
                  >
                    Adicionar transação
                  </button>
                </div>
              ) : (
                recentTransactions.map(transaction => {
                  // Determina o ícone com base no tipo
                  const getIcon = () => {
                    switch(transaction.type) {
                      case 'income': 
                        return <ArrowUp className="h-5 w-5 text-green-500" />;
                      case 'expense': 
                        return <ArrowDown className="h-5 w-5 text-red-500" />;
                      case 'investment': 
                        return <LineChart className="h-5 w-5 text-indigo-500" />;
                      default:
                        return null;
                    }
                  };
                  
                  // Determina a cor com base no tipo
                  const getColor = () => {
                    switch(transaction.type) {
                      case 'income': return 'text-green-600';
                      case 'expense': return 'text-red-600';
                      case 'investment': return 'text-indigo-600';
                      default: return '';
                    }
                  };
                  
                  // Determina a cor de fundo com base no tipo
                  const getBgColor = () => {
                    switch(transaction.type) {
                      case 'income': return 'bg-green-100 dark:bg-green-900/30';
                      case 'expense': return 'bg-red-100 dark:bg-red-900/30';
                      case 'investment': return 'bg-indigo-100 dark:bg-indigo-900/30';
                      default: return '';
                    }
                  };
                  
                  return (
                    <div 
                      key={transaction.id} 
                      className="p-4 flex items-center transaction-item"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getBgColor()}`}>
                        {getIcon()}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {transaction.description}
                              {transaction.budgetId && (
                                <span className="text-xs ml-2 text-gray-500">
                                  ({getBudgetName(transaction.budgetId)})
                                </span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          
                          <span className={`font-semibold ${getColor()}`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Botão de Ação Flutuante */}
        <button
          onClick={() => setIsNewTransactionModalOpen(true)}
          className="fixed right-6 bottom-24 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-blue-600"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
        
        {/* Navegação Inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-30 safe-area-bottom">
          <div className="flex justify-around items-center h-16">
            <button 
              className="flex flex-col items-center justify-center w-full h-full text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
              onClick={() => window.location.href = '/transactions'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-xs mt-1">Transações</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
              onClick={() => window.location.href = '/goals'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <span className="text-xs mt-1">Metas</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
              onClick={() => window.location.href = '/settings'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>
        
        {/* Menu Lateral (se aberto) */}
        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold">Minhas Finanças</h2>
              </div>
              <div className="p-4">
                <nav className="space-y-2">
                  <a href="/" className="block p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    Dashboard
                  </a>
                  <a href="/transactions" className="block p-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Transações
                  </a>
                  <a href="/goals" className="block p-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Metas
                  </a>
                  <a href="/settings" className="block p-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Configurações
                  </a>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Versão desktop
  return (
    <div className="financial-dashboard">
      <div className="dashboard-content">
        {/* Barra de busca e perfil */}
        <div className="search-container">
          <div className="search-input">
            <Search size={24} color="#9ca3af" />
            <input type="text" placeholder="Buscar" />
          </div>
          
          <div className="profile-section">
            <div className="notification-btn">
              <Bell size={24} />
            </div>
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=3" alt="Avatar" />
            </div>
          </div>
        </div>
        
        {/* Título e botões */}
        <div className="title-buttons">
          <h1 className="dashboard-title">Dashboard</h1>
          
          <div className="action-buttons">
            <div className="filter-button">
              <Filter size={24} />
              <span className="filter-text">Filtrar</span>
            </div>
            
            <div 
              className="add-button"
              onClick={() => setIsNewTransactionModalOpen(true)}
            >
              <Plus size={24} color="#fff" />
              <span className="add-text">Nova Transação</span>
            </div>
          </div>
        </div>
        
        {/* Cards financeiros */}
        <div className="finance-boxes">
          {/* Card de Saldo */}
          <div className="statistic-box">
            <div className="box-header">
              <div className="icon-container balance-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 13.5V7C12.5 6.72 12.28 6.5 12 6.5C11.72 6.5 11.5 6.72 11.5 7V13.5C11.5 13.78 11.72 14 12 14C12.28 14 12.5 13.78 12.5 13.5ZM15.5 11.5V7C15.5 6.72 15.28 6.5 15 6.5C14.72 6.5 14.5 6.72 14.5 7V11.5C14.5 11.78 14.72 12 15 12C15.28 12 15.5 11.78 15.5 11.5ZM9.5 15.5V7C9.5 6.72 9.28 6.5 9 6.5C8.72 6.5 8.5 6.72 8.5 7V15.5C8.5 15.78 8.72 16 9 16C9.28 16 9.5 15.78 9.5 15.5Z" fill="#252C32"/>
                </svg>
              </div>
              
              <div className="percentage">
                <ArrowUp size={20} className="text-emerald-500" />
                <span className="percentage-value positive">3.2%</span>
              </div>
            </div>
            
            <span className="box-title">Saldo Atual</span>
            <span className="box-value">{formatCurrency(balance)}</span>
          </div>
          
          {/* Card de Receitas */}
          <div className="statistic-box">
            <div className="box-header">
              <div className="icon-container income-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V14M12 6L9 9M12 6L15 9M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="percentage">
                <ArrowUp size={20} className="text-emerald-500" />
                <span className="percentage-value positive">0.2%</span>
              </div>
            </div>
            
            <span className="box-title">Receitas do Mês</span>
            <span className="box-value">{formatCurrency(totalIncome)}</span>
          </div>
          
          {/* Card de Despesas */}
          <div className="statistic-box">
            <div className="box-header">
              <div className="icon-container expense-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18V10M12 18L9 15M12 18L15 15M20 8V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="percentage">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14L12 7L5 14" stroke="#DD525A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="percentage-value negative">3.2%</span>
              </div>
            </div>
            
            <span className="box-title">Despesas do Mês</span>
            <span className="box-value">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
        
        {/* Seção de Transações */}
        <div className="transactions-box">
          <div className="transactions-header">
            <h2 className="transactions-title">Transações</h2>
            <Info size={24} color="#84919a" />
          </div>
          
          <div className="transaction-list">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Nenhuma transação registrada</p>
                <button 
                  className="mt-2 text-blue-600"
                  onClick={() => setIsNewTransactionModalOpen(true)}
                >
                  Adicionar transação
                </button>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="transaction-item"
                  onClick={() => handleEditTransaction(transaction)}
                >
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === 'income' && (
                      <ArrowUp size={16} color="#5db57a" />
                    )}
                    {transaction.type === 'expense' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 14L12 21L5 14" stroke="#DD525A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {transaction.type === 'investment' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3V21H21" stroke="#72DEF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 12L10 8L14 12L20 6" stroke="#72DEF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="transaction-details">
                    <span className="transaction-description">
                      {transaction.description}
                      {transaction.budgetId && (
                        <span className="text-xs ml-2 text-gray-500">
                          ({getBudgetName(transaction.budgetId)})
                        </span>
                      )}
                    </span>
                    <span className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Botão para adicionar orçamento */}
        <div className="mt-8 mb-4 text-center">
          <button 
            className="text-blue-600 border border-blue-600 px-4 py-2 rounded-2xl shadow-md hover:bg-blue-50"
            onClick={() => setIsNewBudgetModalOpen(true)}
          >
            <Plus size={16} className="inline mr-2" />
            Adicionar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
}