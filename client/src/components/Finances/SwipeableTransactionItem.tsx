import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Transaction } from './types';
import SwipeableItem from '../UI/SwipeableItem';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';

interface SwipeableTransactionItemProps {
  transaction: Transaction;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (id: number) => void;
  getBudgetName?: (budgetId?: number) => string;
}

export default function SwipeableTransactionItem({
  transaction,
  formatCurrency,
  formatDate,
  handleEditTransaction,
  handleDeleteTransaction,
  getBudgetName
}: SwipeableTransactionItemProps) {
  const { impact, notification } = useTapticFeedback();
  
  // Configuração dos ícones e cores por tipo de transação
  const getTransactionStyle = () => {
    switch (transaction.type) {
      case 'income':
        return {
          iconBg: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600',
          amountColor: 'text-green-600 dark:text-green-500',
          amountPrefix: '+'
        };
      case 'expense':
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600',
          amountColor: 'text-red-600 dark:text-red-500',
          amountPrefix: '-'
        };
      case 'investment':
        return {
          iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
          iconColor: 'text-indigo-600',
          amountColor: 'text-indigo-600 dark:text-indigo-500',
          amountPrefix: '-'
        };
      default:
        return {
          iconBg: 'bg-gray-100 dark:bg-gray-800',
          iconColor: 'text-gray-600',
          amountColor: 'text-gray-600',
          amountPrefix: ''
        };
    }
  };
  
  // Obter o ícone com base no tipo de transação
  const getTransactionIcon = () => {
    const style = getTransactionStyle();
    
    switch (transaction.type) {
      case 'income':
        return (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.iconBg}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.iconColor}>
              <path d="M12 5L12 19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'expense':
        return (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.iconBg}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.iconColor}>
              <path d="M12 19L12 5M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'investment':
        return (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.iconBg}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.iconColor}>
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12H9.375C9.996 12 10.5 12.504 10.5 13.125V19.875C10.5 20.496 9.996 21 9.375 21H4.125C3.504 21 3 20.496 3 19.875V13.125Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.25 7.5C8.25 6.879 8.754 6.375 9.375 6.375H14.625C15.246 6.375 15.75 6.879 15.75 7.5V19.875C15.75 20.496 15.246 21 14.625 21H9.375C8.754 21 8.25 20.496 8.25 19.875V7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 4.125C13.5 3.504 14.004 3 14.625 3H19.875C20.496 3 21 3.504 21 4.125V19.875C21 20.496 20.496 21 19.875 21H14.625C14.004 21 13.5 20.496 13.5 19.875V4.125Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.iconBg}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.iconColor}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
    }
  };
  
  const style = getTransactionStyle();
  
  // Ações de deslizar para a direita
  const swipeActions = [
    {
      icon: <Pencil size={20} className="text-white" />,
      color: '#4b5563', // gray-600
      label: 'Editar',
      onClick: () => {
        impact();
        handleEditTransaction(transaction);
      }
    },
    {
      icon: <Trash2 size={20} className="text-white" />,
      color: '#dc2626', // red-600
      label: 'Excluir',
      onClick: () => {
        impact();
        notification('warning');
        handleDeleteTransaction(transaction.id);
      }
    }
  ];
  
  return (
    <SwipeableItem 
      actions={swipeActions}
      onSwipeStart={() => impact()}
    >
      <div className="transaction-item p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          {getTransactionIcon()}
          
          <div className="flex-1 ml-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mobile-text-condensed">
                  {transaction.description}
                </h3>
                <div className="flex flex-col xs:flex-row xs:items-center gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </span>
                  
                  {transaction.budgetId && getBudgetName && (
                    <>
                      <span className="hidden xs:inline text-xs text-gray-400 mx-1">•</span>
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">
                        {getBudgetName(transaction.budgetId)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <span className={`font-semibold mobile-text-condensed ${style.amountColor}`}>
                {style.amountPrefix} {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SwipeableItem>
  );
}