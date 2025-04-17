import React, { RefObject } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
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
  formatCurrency
}: MonthSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center flex-wrap md:flex-nowrap">
          <div className="relative inline-block mr-4" ref={monthSelectorRef}>
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{months[selectedDate.getMonth()]}</span>
              <span>{selectedDate.getFullYear()}</span>
            </button>
            
            {isMonthSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-md z-10 min-w-[240px] animate-in fade-in-50 duration-100">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleYearChange(-1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-gray-800">{selectedDate.getFullYear()}</span>
                  <button
                    onClick={() => handleYearChange(1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 p-2 max-h-52 overflow-y-auto">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`text-center rounded-md px-1 py-2 text-sm hover:bg-blue-50 transition-colors ${
                        index === selectedDate.getMonth() ? 'bg-blue-50 text-blue-700 font-medium' : ''
                      } ${index === currentMonth && selectedDate.getFullYear() === currentYear ? 'font-bold' : ''}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Initial Balance */}
          <div className="flex items-center mt-2 md:mt-0">
            <div className="text-sm text-gray-500 font-medium mr-1">Saldo Inicial:</div>
            
            <div className="flex items-center">
              <span className="text-gray-800 font-semibold">{formatCurrency(initialBalance)}</span>
              <button 
                className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors" 
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
      </div>
    </div>
  );
}
