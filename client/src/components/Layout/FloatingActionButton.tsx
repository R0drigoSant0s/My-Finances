import React, { useState, useEffect, useRef } from 'react';
import { Plus, ArrowUp, ArrowDown, Target, Building, CreditCard } from 'lucide-react';

interface FloatingActionButtonProps {
  openTransactionModal: () => void;
  openBudgetModal: () => void;
}

export default function FloatingActionButton({
  openTransactionModal,
  openBudgetModal
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Feedback tátil para botões
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Vibração curta (10ms)
    }
  };
  
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
  
  // Iniciar pulsação após um período de inatividade
  useEffect(() => {
    const pulseTimer = setTimeout(() => {
      if (!isOpen) {
        setIsPulsing(true);
      }
    }, 10000);
    
    return () => clearTimeout(pulseTimer);
  }, [isOpen]);
  
  const handleTransactionClick = (type: 'income' | 'expense') => {
    // Aqui você pode definir o tipo de transação e abrir o modal
    triggerHapticFeedback();
    
    // TODO: Configurar o tipo da transação antes de abrir o modal
    openTransactionModal();
    setIsOpen(false);
  };
  
  return (
    <div ref={menuRef} className="fixed right-6 bottom-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 -right-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-64 transform transition-all duration-200 border border-gray-100 dark:border-gray-700">
          <div className="p-2">
            {/* Nova Despesa */}
            <button 
              onClick={() => handleTransactionClick('expense')} 
              className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Nova Despesa</span>
            </button>
            
            {/* Nova Receita */}
            <button 
              onClick={() => handleTransactionClick('income')} 
              className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Nova Receita</span>
            </button>
            
            {/* Novo Orçamento */}
            <button 
              onClick={() => {
                triggerHapticFeedback();
                openBudgetModal();
                setIsOpen(false);
              }} 
              className="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Novo Orçamento</span>
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => {
          triggerHapticFeedback();
          setIsOpen(!isOpen);
          setIsPulsing(false);
        }}
        className={`w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${isPulsing ? 'fab-pulse' : ''} ${isOpen ? 'rotate-45' : ''}`}
        aria-label="Adicionar item"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}