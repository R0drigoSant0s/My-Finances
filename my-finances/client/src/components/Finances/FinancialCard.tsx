import React from 'react';
import { 
  CircleDollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  LineChart
} from 'lucide-react';

interface FinancialCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense' | 'investment';
  formatCurrency: (value: number) => string;
}

export default function FinancialCard({ 
  title, 
  amount, 
  type, 
  formatCurrency 
}: FinancialCardProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'balance':
        return <CircleDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case 'income':
        return <ArrowUpCircle className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />;
      case 'expense':
        return <ArrowDownCircle className="h-6 w-6 text-red-500 dark:text-red-400" />;
      case 'investment':
        return <LineChart className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />;
    }
  };
  
  const getColorClass = () => {
    switch (type) {
      case 'balance':
        return "text-blue-600";
      case 'income':
        return "text-emerald-600";
      case 'expense':
        return "text-red-600";
      case 'investment':
        return "text-indigo-600";
    }
  };
  
  const getIconBgClass = () => {
    switch (type) {
      case 'balance':
        return "bg-blue-50";
      case 'income':
        return "bg-emerald-50";
      case 'expense':
        return "bg-red-50";
      case 'investment':
        return "bg-indigo-50";
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className={`${getIconBgClass()} dark:bg-opacity-20 p-2 rounded-lg`}>
            {getIcon()}
          </div>
        </div>
        <p className={`text-xl font-bold ${getColorClass()} dark:text-opacity-90`}>
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
}
