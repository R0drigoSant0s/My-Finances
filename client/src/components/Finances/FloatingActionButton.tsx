import React, { useState, useRef, useEffect } from 'react';
import { Plus, ArrowUp, ArrowDown, DollarSign, Wallet, Target } from 'lucide-react';

interface FloatingActionButtonProps {
  onNewExpense: () => void;
  onNewIncome: () => void;
  onNewBudget: () => void;
}

export default function FloatingActionButton({ 
  onNewExpense, 
  onNewIncome, 
  onNewBudget 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all transform animate-in fade-in duration-200 w-52 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              onNewExpense();
              setIsOpen(false);
            }}
            className="w-full flex items-center p-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mr-3">
              <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Nova Despesa</span>
          </button>
          
          <button
            onClick={() => {
              onNewIncome();
              setIsOpen(false);
            }}
            className="w-full flex items-center p-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
              <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Nova Receita</span>
          </button>
          
          <button
            onClick={() => {
              onNewBudget();
              setIsOpen(false);
            }}
            className="w-full flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Novo Orçamento</span>
          </button>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
        aria-label="Adicionar item"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
