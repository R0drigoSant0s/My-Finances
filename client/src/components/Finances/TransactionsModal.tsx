import { X, Plus, ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';

// Interfaces temporárias para tipagem
interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'investment';
  date: string;
  budgetId?: number;
}

interface TransactionsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transactions: Transaction[];
  sortedTransactions?: Transaction[];
  handleEditTransaction?: (transaction: Transaction) => void;
  handleDeleteTransaction?: (id: number) => void;
  getBudgetName?: (budgetId: number | undefined) => string;
  formatCurrency?: (value: number) => string;
  formatDisplayDate?: (day: number) => string;
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
}

export default function TransactionsModal({
  isOpen,
  setIsOpen,
  transactions,
  setIsNewTransactionModalOpen
}: TransactionsModalProps) {
  if (!isOpen) return null;
  
  // Ordenar transações por data (mais recentes primeiro)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Função para obter o ícone baseado no tipo de transação
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case 'expense':
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      case 'investment':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Função para obter o prefixo (+ ou -) baseado no tipo de transação
  const getTypePrefix = (type: string) => {
    switch (type) {
      case 'income':
        return "+ ";
      case 'expense':
        return "- ";
      case 'investment':
        return "";
      default:
        return "";
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Todas as Transações</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-gray-50 dark:bg-gray-700 mb-3">
                  <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhuma transação encontrada</p>
                <button 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400"
                  onClick={() => { setIsOpen(false); setIsNewTransactionModalOpen(true); }}
                >
                  Adicionar transação
                </button>
              </div>
            ) : (
              sortedTransactions.map(transaction => (
                <div key={transaction.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{transaction.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-500' 
                      : transaction.type === 'expense' 
                        ? 'text-red-600 dark:text-red-500'
                        : 'text-blue-600 dark:text-blue-500'
                  }`}>
                    {getTypePrefix(transaction.type)}R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg border border-gray-200 dark:border-gray-600"
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