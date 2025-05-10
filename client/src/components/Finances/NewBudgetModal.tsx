import React from 'react';
import { X, RefreshCw, Link } from 'lucide-react';
import { Category } from './types';

interface NewBudgetModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  budgetName: string;
  setBudgetName: (name: string) => void;
  budgetLimit: string;
  setBudgetLimit: (limit: string) => void;
  isRecurrent: boolean;
  setIsRecurrent: (isRecurrent: boolean) => void;
  selectedCategoryId?: number;
  setSelectedCategoryId: (id: number | undefined) => void;
  handleBudgetSubmit: (e: React.FormEvent) => void;
  currentYearMonth: string;
  categories: Category[];
}

export default function NewBudgetModal({
  isOpen,
  setIsOpen,
  budgetName,
  setBudgetName,
  budgetLimit,
  setBudgetLimit,
  isRecurrent,
  setIsRecurrent,
  selectedCategoryId,
  setSelectedCategoryId,
  handleBudgetSubmit,
  currentYearMonth,
  categories
}: NewBudgetModalProps) {
  
  // Extrai o mês atual para exibição amigável
  const currentMonthName = new Date(
    parseInt(currentYearMonth.split('-')[0]), 
    parseInt(currentYearMonth.split('-')[1]) - 1
  ).toLocaleString('pt-BR', { month: 'long' });
  
  // Filtra categorias apenas do tipo despesa
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Novo Orçamento</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form className="p-5" onSubmit={handleBudgetSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="budgetName">
                Nome do Orçamento
              </label>
              <input 
                type="text" 
                id="budgetName"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Alimentação, Transporte, Lazer..."
                required
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="budgetLimit">
                Limite
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">R$</span>
                </div>
                <input 
                  type="number" 
                  id="budgetLimit"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  required
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                />
              </div>
            </div>
            
            {/* Seleção de categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center" htmlFor="categorySelect">
                <Link className="h-4 w-4 mr-1.5 text-blue-500" />
                Vincular à categoria
              </label>
              <select
                id="categorySelect"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">-- Nenhuma categoria --</option>
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

            </div>
            
            {/* Opção de recorrência */}
            <div className="flex items-center py-1.5">
              <input
                type="checkbox"
                id="isRecurrent"
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isRecurrent" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <RefreshCw className="h-4 w-4 mr-1.5 text-blue-500" />
                Repetir mensalmente
              </label>
            </div>
            
            {isRecurrent && (
              <div className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p>Este orçamento foi criado para <strong>{currentMonthName}</strong> e será replicado automaticamente para os meses seguintes.</p>
                <p className="mt-1.5">Você poderá desativar a repetição a qualquer momento sem afetar orçamentos anteriores.</p>
              </div>
            )}
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}