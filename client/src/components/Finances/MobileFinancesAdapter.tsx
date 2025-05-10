import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import FinancialDashboard from './FinancialDashboard';
import FinancialCardCarousel from './FinancialCardCarousel';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import FloatingActionButton from '@/components/Layout/FloatingActionButton';
import MobileHeader from '@/components/UI/MobileHeader';
import '@/styles/MobileFinances.css';
import { Transaction, Budget } from './types';

interface MobileFinancesAdapterProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  transactions: Transaction[];
  budgets: Budget[];
  formatCurrency: (value: number) => string;
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
  setIsNewBudgetModalOpen: (isOpen: boolean) => void;
  handleEditTransaction: (transaction: Transaction) => void;
  getBudgetName: (budgetId: number | undefined) => string;
}

export default function MobileFinancesAdapter(props: MobileFinancesAdapterProps) {
  const {
    balance,
    totalIncome,
    totalExpenses,
    totalInvestments,
    transactions,
    budgets,
    formatCurrency,
    setIsNewTransactionModalOpen,
    setIsNewBudgetModalOpen,
    handleEditTransaction,
    getBudgetName
  } = props;

  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Se não for mobile, renderiza o dashboard normal
  if (!isMobile) {
    return (
      <FinancialDashboard
        balance={balance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        transactions={transactions}
        budgets={budgets}
        formatCurrency={formatCurrency}
        setIsNewTransactionModalOpen={setIsNewTransactionModalOpen}
        setIsNewBudgetModalOpen={setIsNewBudgetModalOpen}
        handleEditTransaction={handleEditTransaction}
        getBudgetName={getBudgetName}
      />
    );
  }
  
  // Renderização para dispositivos móveis
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <MobileHeader 
        title="Dashboard" 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      
      {/* Carrossel de Cards financeiros */}
      <FinancialCardCarousel 
        balance={balance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalInvestments={totalInvestments}
        formatCurrency={formatCurrency}
      />
      
      {/* Lista de Transações */}
      <div className="px-4 flex-1">
        <div className="bg-white dark:bg-gray-900 rounded-t-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">Transações Recentes</h2>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800 transaction-list-mobile">
            {transactions.length === 0 ? (
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
              transactions.slice(0, 5).map(transaction => {
                // Determina o ícone com base no tipo
                const getIcon = () => {
                  switch(transaction.type) {
                    case 'income': 
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 10L12 3L19 10" stroke="#5db57a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>;
                    case 'expense': 
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 14L12 21L5 14" stroke="#DD525A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>;
                    case 'investment': 
                      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3V21H21" stroke="#72DEF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 12L10 8L14 12L20 6" stroke="#72DEF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>;
                  }
                };
                
                // Determina a cor com base no tipo
                const getColor = () => {
                  switch(transaction.type) {
                    case 'income': return 'text-green-600';
                    case 'expense': return 'text-red-600';
                    case 'investment': return 'text-indigo-600';
                  }
                };
                
                // Determina a cor de fundo com base no tipo
                const getBgColor = () => {
                  switch(transaction.type) {
                    case 'income': return 'bg-green-100 dark:bg-green-900/30';
                    case 'expense': return 'bg-red-100 dark:bg-red-900/30';
                    case 'investment': return 'bg-indigo-100 dark:bg-indigo-900/30';
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
      <FloatingActionButton 
        openTransactionModal={() => setIsNewTransactionModalOpen(true)}
        openBudgetModal={() => setIsNewBudgetModalOpen(true)}
      />
      
      {/* Navegação Inferior */}
      <BottomNavigation 
        setIsNewTransactionModalOpen={setIsNewTransactionModalOpen}
      />
      
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
                <a href="/" className="block p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  Dashboard
                </a>
                <a href="/transactions" className="block p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Transações
                </a>
                <a href="/goals" className="block p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Metas
                </a>
                <a href="/settings" className="block p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
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