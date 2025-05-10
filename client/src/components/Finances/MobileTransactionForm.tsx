import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Calendar, Tag, PiggyBank } from 'lucide-react';
import { Transaction, Budget } from './types';
import CurrencyInput from '../UI/CurrencyInput';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';

interface MobileTransactionFormProps {
  transaction: Partial<Transaction> | null;
  type: 'income' | 'expense' | 'investment';
  setType: (type: 'income' | 'expense' | 'investment') => void;
  description: string;
  setDescription: (description: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  selectedBudgetId: number | undefined;
  setSelectedBudgetId: (budgetId: number | undefined) => void;
  budgets: Budget[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  formatDate: (day: number) => string;
  isEditMode: boolean;
}

export default function MobileTransactionForm({
  transaction,
  type,
  setType,
  description,
  setDescription,
  amount,
  setAmount,
  selectedDay,
  setSelectedDay,
  selectedBudgetId,
  setSelectedBudgetId,
  budgets,
  handleSubmit,
  handleCancel,
  formatDate,
  isEditMode
}: MobileTransactionFormProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isBudgetPickerOpen, setIsBudgetPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { impact, notification, selection } = useTapticFeedback();
  
  const [animateSubmit, setAnimateSubmit] = useState(false);
  
  // Determinar os dias do mês atual
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  useEffect(() => {
    // Se o tipo mudar e não for despesa, remover a associação com orçamento
    if (type !== 'expense') {
      setSelectedBudgetId(undefined);
    }
  }, [type, setSelectedBudgetId]);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar campos
    if (!description.trim()) {
      setError('Por favor, informe uma descrição.');
      notification('error');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, informe um valor válido.');
      notification('error');
      return;
    }
    
    // Feedback visual e háptico
    setAnimateSubmit(true);
    impact();
    
    try {
      setIsSubmitting(true);
      await handleSubmit(e);
      notification('success');
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      setError('Ocorreu um erro ao salvar a transação. Tente novamente.');
      notification('error');
    } finally {
      setIsSubmitting(false);
      setAnimateSubmit(false);
    }
  };
  
  const handleTypeChange = (newType: 'income' | 'expense' | 'investment') => {
    if (type !== newType) {
      setType(newType);
      selection();
    }
  };
  
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setIsDatePickerOpen(false);
    selection();
  };
  
  const handleBudgetSelect = (budgetId: number | undefined) => {
    setSelectedBudgetId(budgetId);
    setIsBudgetPickerOpen(false);
    selection();
  };
  
  return (
    <div className="mobile-transaction-form px-4 py-5">
      <form onSubmit={handleFormSubmit}>
        {/* Seletor de tipo de transação */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-4 touch-area-expanded">
          <button 
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              type === 'income' 
                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => handleTypeChange('income')}
          >
            Receita
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              type === 'expense' 
                ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => handleTypeChange('expense')}
          >
            Despesa
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              type === 'investment' 
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => handleTypeChange('investment')}
          >
            Investimento
          </button>
        </div>
        
        {/* Campo de descrição */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Descrição da transação"
              required
            />
            {description && (
              <button
                type="button"
                onClick={() => setDescription('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-area-expanded"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Campo de valor */}
        <div className="mb-4">
          <CurrencyInput
            label="Valor"
            value={amount}
            onChange={setAmount}
            required
            id="transaction-amount"
          />
        </div>
        
        {/* Seletor de data */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen);
                impact();
              }}
              className="w-full flex items-center justify-between px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white touch-area-expanded"
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span>{formatDate(selectedDay)}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDatePickerOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-md border border-gray-200 dark:border-gray-700 z-10 py-2">
                <div className="max-h-40 overflow-y-auto">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDaySelect(day)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        day === selectedDay ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : ''
                      }`}
                    >
                      {formatDate(day)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Seletor de orçamento (apenas para despesas) */}
        {type === 'expense' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria de Orçamento
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsBudgetPickerOpen(!isBudgetPickerOpen);
                  impact();
                }}
                className="w-full flex items-center justify-between px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white touch-area-expanded"
              >
                <div className="flex items-center">
                  {selectedBudgetId ? (
                    <>
                      <Tag className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                      <span>{budgets.find(b => b.id === selectedBudgetId)?.name || 'Selecionar Orçamento'}</span>
                    </>
                  ) : (
                    <>
                      <PiggyBank className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-500 dark:text-gray-400">Selecionar Orçamento (opcional)</span>
                    </>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isBudgetPickerOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {isBudgetPickerOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-md border border-gray-200 dark:border-gray-700 z-10 py-2">
                  <div className="max-h-40 overflow-y-auto">
                    {/* Opção para nenhum orçamento */}
                    <button
                      type="button"
                      onClick={() => handleBudgetSelect(undefined)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        selectedBudgetId === undefined ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : ''
                      }`}
                    >
                      <span className="text-gray-500 dark:text-gray-400">Sem categoria</span>
                    </button>
                    
                    {/* Lista de orçamentos */}
                    {budgets.map((budget) => (
                      <button
                        key={budget.id}
                        type="button"
                        onClick={() => handleBudgetSelect(budget.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                          budget.id === selectedBudgetId ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : ''
                        }`}
                      >
                        {budget.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Botões de ação */}
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={() => {
              impact();
              handleCancel();
            }}
            className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium touch-area-expanded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors touch-area-expanded ${
              animateSubmit ? 'button-press' : ''
            } ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </div>
            ) : isEditMode ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}