import React from 'react';
import { X } from 'lucide-react';

interface NewBudgetModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  budgetName: string;
  setBudgetName: (name: string) => void;
  budgetLimit: string;
  setBudgetLimit: (limit: string) => void;
  handleBudgetSubmit: (e: React.FormEvent) => void;
}

export default function NewBudgetModal({
  isOpen,
  setIsOpen,
  budgetName,
  setBudgetName,
  budgetLimit,
  setBudgetLimit,
  handleBudgetSubmit
}: NewBudgetModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Novo Orçamento</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form className="p-5" onSubmit={handleBudgetSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="budgetName">
                Nome do Orçamento
              </label>
              <input 
                type="text" 
                id="budgetName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: Alimentação, Transporte, Lazer..."
                required
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="budgetLimit">
                Limite
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">R$</span>
                </div>
                <input 
                  type="number" 
                  id="budgetLimit"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0,00"
                  required
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
