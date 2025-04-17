import React from 'react';
import { X, Moon, Sun, DollarSign, Euro, CircleDollarSign } from 'lucide-react';

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
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Configurações</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Preferências de Exibição</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tema</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-2 rounded-md transition-colors ${
                        theme === 'light' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      aria-label="Tema Claro"
                    >
                      <Sun className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-2 rounded-md transition-colors ${
                        theme === 'dark' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      aria-label="Tema Escuro"
                    >
                      <Moon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Formato de Moeda</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrency('BRL')}
                      className={`p-2 rounded-md transition-colors ${
                        currency === 'BRL' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      aria-label="Real Brasileiro"
                    >
                      <CircleDollarSign className="h-5 w-5" />
                      <span className="sr-only">R$</span>
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`p-2 rounded-md transition-colors ${
                        currency === 'USD' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      aria-label="Dólar Americano"
                    >
                      <DollarSign className="h-5 w-5" />
                      <span className="sr-only">$</span>
                    </button>
                    <button
                      onClick={() => setCurrency('EUR')}
                      className={`p-2 rounded-md transition-colors ${
                        currency === 'EUR' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      aria-label="Euro"
                    >
                      <Euro className="h-5 w-5" />
                      <span className="sr-only">€</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Sobre o App</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Versão: 1.0.0</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
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