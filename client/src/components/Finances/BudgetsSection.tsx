import React, { useState } from 'react';
import { Budget, Category } from './types';
import { Plus, Edit, Trash, Wallet, TrendingUp, TrendingDown, DollarSign, Tag } from 'lucide-react';

interface BudgetsSectionProps {
  budgets: Budget[];
  categories: Category[];
  totalBudgeted: number;
  totalUsed: number;
  estimatedBalance: number;
  getBudgetUsage: (budgetId: number) => number;
  setIsNewBudgetModalOpen: (isOpen: boolean) => void;
  handleEditBudget: (budget: Budget) => void;
  handleDeleteBudget: (id: number) => void;
  formatCurrency: (value: number) => string;
}

export default function BudgetsSection({
  budgets,
  categories,
  totalBudgeted,
  totalUsed,
  estimatedBalance,
  getBudgetUsage,
  setIsNewBudgetModalOpen,
  handleEditBudget,
  handleDeleteBudget,
  formatCurrency
}: BudgetsSectionProps) {
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Orçamentos</h2>
      </div>
      
      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-800 mr-3">
              <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xs text-green-600 dark:text-green-400 mb-1">Total orçado</div>
              <div className="text-lg font-medium text-green-700 dark:text-green-400">{formatCurrency(totalBudgeted)}</div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-800 mr-3">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-xs text-red-600 dark:text-red-400 mb-1">Total utilizado</div>
              <div className="text-lg font-medium text-red-700 dark:text-red-400">{formatCurrency(totalUsed)}</div>
            </div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 mr-3">
            <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">Saldo estimado</div>
            <div className="text-lg font-medium text-blue-600 dark:text-blue-400">{formatCurrency(estimatedBalance)}</div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-800">
        <h3 className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Seus Orçamentos</h3>
        
        <div className="max-h-96 overflow-y-auto px-5 pb-4">
          {budgets.length === 0 ? (
            <div className="py-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer" onClick={() => setIsNewBudgetModalOpen(true)}>
                <Plus className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum orçamento cadastrado</p>
              <button 
                className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                onClick={() => setIsNewBudgetModalOpen(true)}
              >
                Adicionar orçamento
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget, index) => {
                const usage = getBudgetUsage(budget.id);
                const percentage = budget.limit === 0 ? 0 : Math.round(usage / budget.limit * 100);
                const isOverBudget = percentage > 90;
                
                // Encontra a categoria vinculada ao orçamento, se existir
                const linkedCategory = budget.categoryId ? 
                  categories.find(cat => cat.id === budget.categoryId) : undefined;
                
                return (
                  <div 
                    key={budget.id} 
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg relative overflow-hidden transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" 
                  >
                    {/* Gradiente sutil baseado na cor do orçamento ou da categoria vinculada */}
                    <div 
                      className="absolute inset-0 opacity-5 z-0" 
                      style={{ 
                        background: `linear-gradient(135deg, ${linkedCategory?.color || budget.color || '#3b82f6'} 0%, transparent 80%)` 
                      }}
                    />
                    
                    <div className="flex justify-between items-center mb-2 relative z-10">
                      <div className="flex items-center">
                        <div className="w-2 h-10 rounded-full mr-2" 
                          style={{ backgroundColor: linkedCategory?.color || budget.color || '#3b82f6' }} />
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">{budget.name}</h3>
                          {linkedCategory && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              <Tag className="h-3 w-3 mr-1" style={{ color: linkedCategory.color }} />
                              <span>{linkedCategory.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${percentage > 90 
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                          : percentage > 70 
                            ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`
                        }>
                          {percentage}%
                        </span>
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
                            onClick={() => handleEditBudget(budget)}
                            aria-label="Editar"
                          >
                            <Edit className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          </button>
                          
                          <button 
                            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-800/30 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700"
                            onClick={() => handleDeleteBudget(budget.id)}
                            aria-label="Excluir"
                          >
                            <Trash className="h-4 w-4 text-red-500 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm mb-2 relative z-10">
                      <span className="text-gray-600 dark:text-gray-400">{formatCurrency(usage)}</span>
                      <span className="text-gray-500 dark:text-gray-400">de {formatCurrency(budget.limit)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden relative z-10">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: linkedCategory 
                            ? linkedCategory.color 
                            : budget.color || '#3b82f6' // Usa a cor da linha vertical (azul por padrão)
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}