import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, LineChart, MoreVertical, Edit, Trash, Search } from 'lucide-react';
import { Transaction } from './types';

interface MobileTransactionListProps {
  transactions: Transaction[];
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (id: number) => void;
  formatCurrency: (value: number) => string;
  getBudgetName: (budgetId: number | undefined) => string;
}

export default function MobileTransactionList({
  transactions,
  handleEditTransaction,
  handleDeleteTransaction,
  formatCurrency,
  getBudgetName
}: MobileTransactionListProps) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const getIcon = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="h-6 w-6 text-emerald-500" />;
      case 'expense':
        return <ArrowDownCircle className="h-6 w-6 text-red-500" />;
      case 'investment':
        return <LineChart className="h-6 w-6 text-indigo-500" />;
    }
  };
  
  const getDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };
  
  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };
  
  // Filtra as transações se houver um termo de busca
  const filteredTransactions = searchTerm
    ? transactions.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        getBudgetName(t.budgetId)?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transactions;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-t-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Transações Recentes</h2>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Search size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      {showSearch && (
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transações"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center">
            {searchTerm 
              ? <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada para "{searchTerm}"</p>
              : <p className="text-gray-500 dark:text-gray-400">Nenhuma transação registrada ainda</p>
            }
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div key={transaction.id} className="relative">
              <div 
                className="p-4 flex items-center"
                onClick={() => handleEditTransaction(transaction)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 
                    transaction.type === 'expense' ? 'bg-red-100 dark:bg-red-900/30' : 
                    'bg-indigo-100 dark:bg-indigo-900/30'}
                `}>
                  {getIcon(transaction.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h3>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                          {getDateDisplay(transaction.date)}
                        </span>
                        {transaction.budgetId && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {getBudgetName(transaction.budgetId)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                        transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 
                        'text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                      
                      <button 
                        className="ml-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(transaction.id);
                        }}
                      >
                        <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Menu de ações */}
              {activeMenu === transaction.id && (
                <div className="absolute right-2 top-12 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTransaction(transaction);
                        setActiveMenu(null);
                      }}
                    >
                      <Edit size={16} className="mr-2 text-blue-500" />
                      Editar
                    </button>
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTransaction(transaction.id);
                        setActiveMenu(null);
                      }}
                    >
                      <Trash size={16} className="mr-2 text-red-500" />
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}