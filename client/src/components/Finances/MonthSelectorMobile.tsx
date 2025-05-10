import React, { RefObject, useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2, History, ArrowLeft, ArrowRight } from 'lucide-react';
import InitialBalanceModal from './InitialBalanceModal';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface MonthSelectorProps {
  months: string[];
  selectedDate: Date;
  currentMonth: number;
  currentYear: number;
  isMonthSelectorOpen: boolean;
  setIsMonthSelectorOpen: (isOpen: boolean) => void;
  handleYearChange: (increment: number) => void;
  handleMonthSelect: (month: number) => void;
  monthSelectorRef: RefObject<HTMLDivElement>;
  isEditingBalance: boolean;
  setIsEditingBalance: (isEditing: boolean) => void;
  tempInitialBalance: string;
  setTempInitialBalance: (balance: string) => void;
  handleInitialBalanceSubmit: (e: React.FormEvent) => void;
  initialBalance: number;
  formatCurrency: (value: number) => string;
  setIsTransactionsModalOpen?: (isOpen: boolean) => void;
}

export default function MonthSelectorMobile({
  months,
  selectedDate,
  currentMonth,
  currentYear,
  isMonthSelectorOpen,
  setIsMonthSelectorOpen,
  handleYearChange,
  handleMonthSelect,
  monthSelectorRef,
  isEditingBalance,
  setIsEditingBalance,
  tempInitialBalance,
  setTempInitialBalance,
  handleInitialBalanceSubmit,
  initialBalance,
  formatCurrency,
  setIsTransactionsModalOpen
}: MonthSelectorProps) {
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | null>(null);
  
  // Configurar gestos de deslize para navegação entre meses
  const handleSwipeLeft = () => {
    // Avançar para o próximo mês (direita -> esquerda)
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    handleMonthSelect(newDate.getMonth());
    if (newDate.getFullYear() !== selectedDate.getFullYear()) {
      handleYearChange(1);
    }
    
    // Animação de feedback
    setSwipeAnimation('left');
    setTimeout(() => setSwipeAnimation(null), 300);
    
    // Feedback tátil
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  };
  
  const handleSwipeRight = () => {
    // Voltar para o mês anterior (esquerda -> direita)
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    handleMonthSelect(newDate.getMonth());
    if (newDate.getFullYear() !== selectedDate.getFullYear()) {
      handleYearChange(-1);
    }
    
    // Animação de feedback
    setSwipeAnimation('right');
    setTimeout(() => setSwipeAnimation(null), 300);
    
    // Feedback tátil
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  };
  
  // Referência para container com gestos habilitados
  const swipeRef = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50
  });
  
  // Ocultar dica de swipe após algum tempo
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);
  
  // Sempre que mudar de mês, reiniciar animação
  useEffect(() => {
    setSwipeAnimation(null);
  }, [selectedDate]);
  
  return (
    <div className="flex flex-col gap-2 mb-4 month-swiper" ref={swipeRef}>
      {/* Indicador de troca de mês com swipe */}
      {showSwipeHint && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1 bg-blue-50 dark:bg-blue-900/20 py-1 px-2 rounded-md animate-pulse">
          <span className="flex items-center justify-center">
            <ArrowLeft className="h-3 w-3 mr-1" />
            Deslize para navegar entre meses
            <ArrowRight className="h-3 w-3 ml-1" />
          </span>
        </div>
      )}
      
      {/* Data selector e botão de transações */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-3 w-full">
          <div className="flex items-center justify-between w-full">
            {/* Seletor de mês com botões para navegação */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleSwipeRight()}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-full touch-area-expanded"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              
              <div 
                onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
                className={`flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 touch-area-expanded
                  ${swipeAnimation === 'left' ? 'animate-slide-left-fade' : ''}
                  ${swipeAnimation === 'right' ? 'animate-slide-right-fade' : ''}
                `}
              >
                <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                <span className="mr-1">{months[selectedDate.getMonth()]}</span>
                <span>{selectedDate.getFullYear()}</span>
              </div>
              
              <button
                onClick={() => handleSwipeLeft()}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-full touch-area-expanded"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Botão de Transações do mês - móvel para direita em mobile */}
            <button 
              onClick={() => setIsTransactionsModalOpen && setIsTransactionsModalOpen(true)}
              className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 touch-area-expanded"
            >
              <History className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
              <span>Transações</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Seletor de Mês modal */}
      {isMonthSelectorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={() => setIsMonthSelectorOpen(false)}>
          <div 
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full animate-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-medium text-lg text-gray-900 dark:text-white">Selecionar Mês</h3>
              <button
                onClick={() => setIsMonthSelectorOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleYearChange(-1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors touch-area-expanded"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="font-medium text-gray-800 dark:text-gray-200 text-lg">{selectedDate.getFullYear()}</span>
                <button
                  onClick={() => handleYearChange(1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors touch-area-expanded"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => {
                      handleMonthSelect(index);
                      setIsMonthSelectorOpen(false);
                    }}
                    className={`p-3 rounded-lg text-center touch-area-expanded transition-colors ${
                      index === selectedDate.getMonth() 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    } ${
                      index === currentMonth && selectedDate.getFullYear() === currentYear 
                        ? 'border border-blue-500 dark:border-blue-500' 
                        : ''
                    }`}
                  >
                    <span className="text-sm">{month}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => {
                  handleMonthSelect(currentMonth);
                  if (selectedDate.getFullYear() !== currentYear) {
                    const newDate = new Date();
                    const yearDiff = newDate.getFullYear() - selectedDate.getFullYear();
                    handleYearChange(yearDiff);
                  }
                  setIsMonthSelectorOpen(false);
                }}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors touch-area-expanded"
              >
                Mês Atual
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Initial Balance - Movido para baixo da seleção de data */}
      <div className="flex items-center justify-between mt-1 px-1">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-2">Saldo Inicial:</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold mobile-text-condensed">{formatCurrency(initialBalance)}</span>
        </div>
        
        <button 
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-area-expanded" 
          onClick={() => setIsEditingBalance(true)}
          aria-label="Editar saldo inicial"
        >
          <Edit2 className="h-4 w-4 text-blue-500" />
        </button>

        <InitialBalanceModal 
          isOpen={isEditingBalance}
          setIsOpen={setIsEditingBalance}
          tempInitialBalance={tempInitialBalance}
          setTempInitialBalance={setTempInitialBalance}
          handleSubmit={handleInitialBalanceSubmit}
        />
      </div>
    </div>
  );
}