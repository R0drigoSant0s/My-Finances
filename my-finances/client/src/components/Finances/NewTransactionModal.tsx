import React, { RefObject } from 'react';
import { 
  X, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LineChart,
  Calendar 
} from 'lucide-react';
import { Budget, EditingTransaction } from './types';

interface NewTransactionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: 'income' | 'expense' | 'investment';
  setType: (type: 'income' | 'expense' | 'investment') => void;
  description: string;
  setDescription: (description: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedBudgetId: number | undefined;
  setSelectedBudgetId: (id: number | undefined) => void;
  budgets: Budget[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  calendarRef: RefObject<HTMLDivElement>;
  handleSubmit: (e: React.FormEvent) => void;
  editingTransaction: EditingTransaction;
  setEditingTransaction: (transaction: EditingTransaction) => void;
  formatDisplayDate: (day: number) => string;
  calendarDays: (number | null)[];
  weekDays: string[];
  firstDayWeekday: number;
  daysInMonth: number;
}

export default function NewTransactionModal({
  isOpen,
  setIsOpen,
  type,
  setType,
  description,
  setDescription,
  amount,
  setAmount,
  selectedBudgetId,
  setSelectedBudgetId,
  budgets,
  selectedDay,
  setSelectedDay,
  isCalendarOpen,
  setIsCalendarOpen,
  calendarRef,
  handleSubmit,
  editingTransaction,
  setEditingTransaction,
  formatDisplayDate,
  calendarDays,
  weekDays,
  firstDayWeekday,
  daysInMonth
}: NewTransactionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {editingTransaction 
              ? 'Editar Transação' 
              : type === 'income' 
                ? 'Nova Receita' 
                : type === 'expense' 
                  ? 'Nova Despesa' 
                  : 'Novo Investimento'}
          </h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => { setIsOpen(false); setEditingTransaction(null); }}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form className="p-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1 mb-4">
              <button 
                type="button"
                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${
                  type === 'income' 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setType('income')}
              >
                <ArrowUpCircle className="h-4 w-4" />
                <span>Receita</span>
              </button>
              
              <button 
                type="button"
                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${
                  type === 'expense' 
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400' 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setType('expense')}
              >
                <ArrowDownCircle className="h-4 w-4" />
                <span>Despesa</span>
              </button>
              
              <button 
                type="button"
                className={`py-2 px-1 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${
                  type === 'investment' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setType('investment')}
              >
                <LineChart className="h-4 w-4" />
                <span>Invest.</span>
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">
                Descrição
              </label>
              <input 
                type="text" 
                id="description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Salário, Aluguel, Ações..."
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="amount">
                Valor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">R$</span>
                </div>
                <input 
                  type="number" 
                  id="amount"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  value={amount}
                  required
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            {type === 'expense' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Orçamento
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={selectedBudgetId}
                  onChange={(e) => setSelectedBudgetId(e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Selecione um orçamento (opcional)</option>
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <div className="relative" ref={calendarRef}>
                <button 
                  type="button"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-left flex justify-between items-center text-gray-900 dark:text-gray-100"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span>{formatDisplayDate(selectedDay)}</span>
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                
                {isCalendarOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-3 w-[280px] max-w-full animate-in fade-in-50 zoom-in-95 duration-100">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Selecionar Data</h3>
                        <button 
                          type="button" 
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsCalendarOpen(false)}
                        >
                          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 mb-1">
                        {weekDays.map(day => (
                          <div key={day} className="text-center text-xs font-medium text-blue-500 dark:text-blue-400">{day[0]}</div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-0.5 bg-gray-50 dark:bg-gray-700 rounded-lg p-1.5">
                        {calendarDays.map((day, index) => {
                          const today = new Date();
                          const currentMonth = new Date().getMonth();
                          const currentYear = new Date().getFullYear();
                          const isToday = day === today.getDate() && 
                                      currentMonth === today.getMonth() && 
                                      currentYear === today.getFullYear();
                          
                          return (
                            <div key={index} className="flex items-center justify-center p-0.5">
                              {day !== null ? (
                                <button 
                                  type="button"
                                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors
                                    ${selectedDay === day 
                                      ? 'bg-blue-500 text-white font-medium shadow-sm' 
                                      : isToday
                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300'}`}
                                  onClick={() => { setSelectedDay(day); setIsCalendarOpen(false); }}
                                >
                                  {day}
                                </button>
                              ) : (
                                <div className="w-6 h-6"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => { setIsOpen(false); setEditingTransaction(null); }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                {editingTransaction ? 'Salvar Alterações' : 'Adicionar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
