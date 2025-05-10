import React, { RefObject } from 'react';
import { Transaction, Category } from './types';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LineChart, 
  ChevronDown, 
  Plus, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { getIcon } from './utils/lucideIcons';

interface TransactionsSectionProps {
  transactions: Transaction[];
  sortedTransactions: Transaction[];
  categories: Category[];
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
  categories,
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
  
  // Função para obter o ícone padrão baseado no tipo de transação
  const getDefaultTransactionIcon = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="text-emerald-500 h-5 w-5" />;
      case 'expense':
        return <ArrowDownCircle className="text-red-500 h-5 w-5" />;
      case 'investment':
        return <LineChart className="text-indigo-500 h-5 w-5" />;
    }
  };
  
  // Função para obter a classe de fundo padrão baseada no tipo de transação
  const getDefaultIconBgClass = (type: 'income' | 'expense' | 'investment') => {
    switch (type) {
      case 'income':
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case 'expense':
        return "bg-red-50 dark:bg-red-900/20";
      case 'investment':
        return "bg-indigo-50 dark:bg-indigo-900/20";
    }
  };
  
  // Função para buscar categoria associada à transação
  const getCategoryForTransaction = (transaction: Transaction) => {
    if (!transaction.categoryId || !categories) return null;
    return categories.find(category => category.id === transaction.categoryId) || null;
  };
  
  // Função para renderizar ícone baseado na categoria ou tipo padrão
  const renderTransactionIcon = (transaction: Transaction) => {
    const category = getCategoryForTransaction(transaction);
    
    if (category) {
      // Usar o ícone da categoria se disponível
      const IconComponent = getIcon(category.icon);
      return (
        <div style={{ color: category.color }}>
          <IconComponent className="h-5 w-5" key={`icon-${category.id}`} />
        </div>
      );
    } else {
      // Renderizar ícone padrão baseado no tipo
      return getDefaultTransactionIcon(transaction.type);
    }
  };
  
  // Função para obter estilo de fundo do ícone baseado na categoria ou tipo
  const getIconStyle = (transaction: Transaction) => {
    const category = getCategoryForTransaction(transaction);
    
    if (category) {
      // Retornar estilo com cor da categoria (com baixa opacidade)
      return {
        backgroundColor: `${category.color}20`, // 20% de opacidade
        className: ''
      };
    } else {
      // Retornar classe de fundo padrão baseada no tipo
      return {
        backgroundColor: '',
        className: getDefaultIconBgClass(transaction.type)
      };
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
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
            <LineChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-white">Transações Recentes</h2>
        </div>
        <div>
          <button 
            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
            onClick={() => setIsTransactionsModalOpen(true)}
            title="Ver todas as transações"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="inline-flex p-5 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
              <Plus className="h-7 w-7 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-3">Nenhuma transação encontrada</p>
            <button 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
              onClick={() => setIsNewTransactionModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Adicionar transação
            </button>
          </div>
        ) : (
          <div className="max-h-[550px] overflow-y-auto px-1">
            {sortedTransactions.slice(0, 5).map((transaction, index) => {
              const transactionDate = new Date(transaction.date);
              const iconStyle = getIconStyle(transaction);
              const category = getCategoryForTransaction(transaction);
              
              return (
                <div key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors rounded-xl mx-2 my-1">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${iconStyle.className}`}
                        style={iconStyle.backgroundColor ? { backgroundColor: iconStyle.backgroundColor } : {}}
                      >
                        {renderTransactionIcon(transaction)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-base">{transaction.description}</h4>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            {formatDisplayDate(transactionDate.getDate())}
                          </span>
                          
                          {transaction.budgetId && (
                            <span className="ml-1.5 inline-flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full text-blue-700 dark:text-blue-300">
                              {getBudgetName(transaction.budgetId)}
                            </span>
                          )}
                          
                          {category && (
                            <span 
                              className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs" 
                              style={{ 
                                backgroundColor: `${category.color}20`, 
                                color: category.color
                              }}
                            >
                              {category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className={`font-semibold ${getAmountColor(transaction.type)} text-base`}>
                        {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                      </div>
                      <div className="flex mt-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg p-0.5">
                        <button 
                          className="p-1.5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rounded-md transition-colors"
                          onClick={() => handleEditTransaction(transaction)}
                          title="Editar"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-md transition-colors"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          title="Excluir"
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
              <div className="px-5 py-4 text-center border-t border-gray-100 dark:border-gray-800">
                <button 
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                  onClick={() => setIsTransactionsModalOpen(true)}
                >
                  Ver todas as transações
                  <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}