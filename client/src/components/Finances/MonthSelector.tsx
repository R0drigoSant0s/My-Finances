import React, { RefObject } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2, History } from 'lucide-react';
import InitialBalanceModal from './InitialBalanceModal';

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

export default function MonthSelector({
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
  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Data selector e botão de transações */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap md:flex-nowrap gap-3">
          <div className="flex items-center space-x-2">
            <div className="relative inline-block" ref={monthSelectorRef}>
              <button
                onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
                className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="mr-1">{months[selectedDate.getMonth()]}</span>
                <span>{selectedDate.getFullYear()}</span>
              </button>
              
              {isMonthSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md z-10 min-w-[240px] animate-in fade-in-50 duration-100">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <button
                      onClick={() => handleYearChange(-1)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{selectedDate.getFullYear()}</span>
                    <button
                      onClick={() => handleYearChange(1)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-2 max-h-52 overflow-y-auto">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`text-center rounded-md px-1 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                          index === selectedDate.getMonth() ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                        } ${index === currentMonth && selectedDate.getFullYear() === currentYear ? 'font-bold' : ''}`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Botão de Transações do mês */}
            <button 
              onClick={() => setIsTransactionsModalOpen && setIsTransactionsModalOpen(true)}
              className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <History className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span>Transações do mês</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Initial Balance - Movido para baixo da seleção de data */}
      <div className="flex items-center ml-1">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mr-2">Saldo Inicial:</div>
        
        <div className="flex items-center">
          <span className="text-gray-800 dark:text-gray-200 font-semibold">{formatCurrency(initialBalance)}</span>
          <button 
            className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
            onClick={() => setIsEditingBalance(true)}
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
  );
}