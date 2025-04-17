import React, { RefObject } from 'react';
import { Transaction } from './types';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LineChart, 
  ChevronDown, 
  Plus, 
  Edit2, 
  Trash2 
} from 'lucide-react';

interface TransactionsSectionProps {
  transactions: Transaction[];
  sortedTransactions: Transaction[];
  setIsTransactionsModalOpen: (isOpen: boolean) => void;
  setIsActionMenuOpen: (isOpen: boolean) => void;
  isActionMenuOpen: boolean;
  setType: (type: 'income' | 'expense' | 'investment') => void;
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
  setIsNewBudgetModalOpen: (isOpen: boolean) => void;
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (id: number) => void;
  getBudgetName: (budgetId: number | undefined) => string;
  formatCurrency: (value: number) => string;
  formatDisplayDate: (day: number) => string;
  actionMenuRef: RefObject<HTMLDivElement>;
}

export default function TransactionsSection({
  transactions,
  sortedTransactions,
  setIsTransactionsModalOpen,
  setIsActionMenuOpen,
  isActionMenuOpen,
  setType,
  setIsNewTransactionModalOpen,
  setIsNewBudgetModalOpen,
  handleEditTransaction,
  handleDeleteTransaction,
  getBudgetName,
  formatCurrency,
  formatDisplayDate,
  actionMenuRef
}: TransactionsSectionProps) {
  
  const getTransactionIcon = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="text-emerald-500 h-5 w-5" />;
      case 'expense':
        return <ArrowDownCircle className="text-red-500 h-5 w-5" />;
      case 'investment':
        return <LineChart className="text-indigo-500 h-5 w-5" />;
    }
  };
  
  const getIconBgClass = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case 'expense':
        return "bg-red-50 dark:bg-red-900/20";
      case 'investment':
        return "bg-indigo-50 dark:bg-indigo-900/20";
    }
  };
  
  const getAmountColor = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return "text-emerald-600 dark:text-emerald-400";
      case 'expense':
        return "text-red-600 dark:text-red-400";
      case 'investment':
        return "text-indigo-600 dark:text-indigo-400";
    }
  };
  
  const getAmountPrefix = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return "+ ";
      case 'expense':
        return "- ";
      case 'investment':
        return "";
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Transações Recentes</h2>
        <div>
          <button 
            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
            onClick={() => setIsTransactionsModalOpen(true)}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3">
              <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhuma transação encontrada</p>
            <button 
              className="text-sm font-medium text-blue-600 dark:text-blue-400"
              onClick={() => setIsNewTransactionModalOpen(true)}
            >
              Adicionar transação
            </button>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {sortedTransactions.slice(0, 5).map(transaction => {
              const transactionDate = new Date(transaction.date);
              return (
                <div key={transaction.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${getIconBgClass(transaction.type)} flex items-center justify-center flex-shrink-0`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</h4>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDisplayDate(transactionDate.getDate())}</span>
                          {transaction.budgetId && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{getBudgetName(transaction.budgetId)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${getAmountColor(transaction.type)}`}>
                        {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                      </div>
                      <div className="flex space-x-1 justify-end mt-1">
                        <button 
                          className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 rounded-full transition-colors"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full transition-colors"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {sortedTransactions.length > 5 && (
              <div className="px-5 py-3 text-center border-t border-gray-100 dark:border-gray-800">
                <button 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400"
                  onClick={() => setIsTransactionsModalOpen(true)}
                >
                  Ver todas as transações
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}