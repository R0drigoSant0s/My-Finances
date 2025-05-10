import React, { RefObject } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2, History } from 'lucide-react';
import InitialBalanceModal from './InitialBalanceModal';

interface MonthSelectorProps {
  months: string[];
  monthsFull?: string[];  // Opcional para compatibilidade com código existente
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

export default function MonthSelector({
  months,
  monthsFull,
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
  // Função para navegar para o mês anterior
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    handleMonthSelect(newDate.getMonth());
    if (newDate.getFullYear() !== selectedDate.getFullYear()) {
      handleYearChange(-1);
    }
  };

  // Função para navegar para o próximo mês
  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    handleMonthSelect(newDate.getMonth());
    if (newDate.getFullYear() !== selectedDate.getFullYear()) {
      handleYearChange(1);
    }
  };

  // Array com as abreviações dos meses em maiúsculas
  const monthsAbbr = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Data selector centralizado com navegação por setas */}
      <div className="flex items-center justify-center w-full mb-3">
        <div className="flex items-center">
          {/* Botão para mês anterior */}
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Seletor de mês centralizado */}
          <div className="relative" ref={monthSelectorRef}>
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="flex items-center px-4 py-2 mx-2 bg-transparent rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-normal text-black dark:text-white"
              aria-label="Selecionar mês"
            >
              <span>{monthsFull ? monthsFull[selectedDate.getMonth()] : months[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
            </button>
            
            {isMonthSelectorOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md z-10 min-w-[260px]" 
                style={{
                  animation: 'dropDown 250ms ease-out forwards'
                }}>
                {/* CSS para a animação já foi adicionado via CSS global */}
                <div className="bg-blue-600 text-white p-3 border-b border-blue-700 flex items-center justify-between">
                  <button
                    onClick={() => handleYearChange(-1)}
                    className="p-1.5 hover:bg-blue-700 rounded-full transition-colors"
                    aria-label="Ano anterior"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                  <span className="font-medium text-white">{selectedDate.getFullYear()}</span>
                  <button
                    onClick={() => handleYearChange(1)}
                    className="p-1.5 hover:bg-blue-700 rounded-full transition-colors"
                    aria-label="Próximo ano"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 max-h-52 overflow-y-auto">
                  {monthsAbbr.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => {
                        handleMonthSelect(index);
                        setIsMonthSelectorOpen(false);
                      }}
                      className={`text-center px-2 py-2 text-xs hover:text-blue-600 dark:hover:text-blue-500 ${
                        index === selectedDate.getMonth() ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                      aria-label={`Selecionar ${monthsFull ? monthsFull[index] : months[index]}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
                
                {/* Botões de ação na parte inferior */}
                <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsMonthSelectorOpen(false)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 text-xs font-normal"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      handleMonthSelect(now.getMonth());
                      if (now.getFullYear() !== selectedDate.getFullYear()) {
                        const yearDiff = now.getFullYear() - selectedDate.getFullYear();
                        handleYearChange(yearDiff);
                      }
                      setIsMonthSelectorOpen(false);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 text-xs font-normal"
                  >
                    Mês Atual
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Botão para próximo mês */}
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Botão de Transações do mês e Saldo Inicial */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Botão de Transações do mês */}
        <button 
          onClick={() => setIsTransactionsModalOpen && setIsTransactionsModalOpen(true)}
          className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <History className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
          <span>Transações do mês</span>
        </button>
        
        {/* Initial Balance */}
        <div className="flex items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-2">Saldo Inicial:</div>
          
          <div className="flex items-center">
            <span className="text-gray-800 dark:text-gray-200 font-semibold">{formatCurrency(initialBalance)}</span>
            <button 
              className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
              onClick={() => setIsEditingBalance(true)}
              aria-label="Editar saldo inicial"
            >
              <Edit2 className="h-3.5 w-3.5 text-blue-500" />
            </button>
          </div>

          <InitialBalanceModal 
            isOpen={isEditingBalance}
            setIsOpen={setIsEditingBalance}
            tempInitialBalance={tempInitialBalance}
            setTempInitialBalance={setTempInitialBalance}
            handleSubmit={handleInitialBalanceSubmit}
          />
        </div>
      </div>
    </div>
  );
}