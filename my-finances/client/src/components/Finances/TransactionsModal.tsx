import React from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, LineChart, Edit2, Trash2, Plus } from 'lucide-react';
import { Transaction } from './types';

interface TransactionsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transactions: Transaction[];
  sortedTransactions: Transaction[];
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (id: number) => void;
  getBudgetName: (budgetId: number | undefined) => string;
  formatCurrency: (value: number) => string;
  formatDisplayDate: (day: number) => string;
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
}

export default function TransactionsModal({
  isOpen,
  setIsOpen,
  transactions,
  sortedTransactions,
  handleEditTransaction,
  handleDeleteTransaction,
  getBudgetName,
  formatCurrency,
  formatDisplayDate,
  setIsNewTransactionModalOpen
}: TransactionsModalProps) {
  if (!isOpen) return null;
  
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
        return "bg-emerald-50";
      case 'expense':
        return "bg-red-50";
      case 'investment':
        return "bg-indigo-50";
    }
  };
  
  const getAmountColor = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return "text-emerald-600";
      case 'expense':
        return "text-red-600";
      case 'investment':
        return "text-indigo-600";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Todas as Transações</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-gray-50 mb-3">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Nenhuma transação encontrada</p>
                <button 
                  className="text-sm font-medium text-blue-600"
                  onClick={() => { setIsOpen(false); setIsNewTransactionModalOpen(true); }}
                >
                  Adicionar transação
                </button>
              </div>
            ) : (
              sortedTransactions.map(transaction => {
                const transactionDate = new Date(transaction.date);
                return (
                  <div key={transaction.id} className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${getIconBgClass(transaction.type)} flex items-center justify-center flex-shrink-0`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center text-xs text-gray-500">
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
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`font-medium ${getAmountColor(transaction.type)}`}>
                          {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button 
                          className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full transition-colors"
                          onClick={() => { handleEditTransaction(transaction); setIsOpen(false); }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-lg border border-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Fechar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={() => { setIsOpen(false); setIsNewTransactionModalOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>
    </div>
  );
}
