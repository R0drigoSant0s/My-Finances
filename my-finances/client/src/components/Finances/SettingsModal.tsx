import React from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currency: 'BRL' | 'USD' | 'EUR';
  setCurrency: (currency: 'BRL' | 'USD' | 'EUR') => void;
}

export default function SettingsModal({
  isOpen,
  setIsOpen,
  theme,
  setTheme,
  currency,
  setCurrency
}: SettingsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Configurações</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Preferências de Exibição</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/80 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tema</span>
                  <select 
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md text-sm"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Formato de Moeda</span>
                  <select 
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md text-sm"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'BRL' | 'USD' | 'EUR')}
                  >
                    <option value="BRL">R$ (Real Brasileiro)</option>
                    <option value="USD">$ (Dólar Americano)</option>
                    <option value="EUR">€ (Euro)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Sobre o App</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/80 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Versão: 1.0.0</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Este é um aplicativo para controle de finanças pessoais, desenvolvido 
                  para ajudar você a gerenciar suas receitas, despesas e investimentos.
                </p>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}