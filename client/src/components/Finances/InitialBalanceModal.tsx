import React from 'react';
import { X } from 'lucide-react';

interface InitialBalanceModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tempInitialBalance: string;
  setTempInitialBalance: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function InitialBalanceModal({
  isOpen,
  setIsOpen,
  tempInitialBalance,
  setTempInitialBalance,
  handleSubmit
}: InitialBalanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl animate-in fade-in-50 duration-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-medium text-lg text-gray-800 dark:text-gray-100">Editar Saldo Inicial</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="initialBalance">
                Valor do Saldo Inicial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">R$</span>
                </div>
                <input 
                  type="number" 
                  id="initialBalance"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  value={tempInitialBalance}
                  required
                  onChange={(e) => setTempInitialBalance(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
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
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}