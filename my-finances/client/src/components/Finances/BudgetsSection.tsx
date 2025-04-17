import React, { useState } from 'react';
import { Budget } from './types';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';

interface BudgetsSectionProps {
  budgets: Budget[];
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
  totalBudgeted,
  totalUsed,
  estimatedBalance,
  getBudgetUsage,
  setIsNewBudgetModalOpen,
  handleEditBudget,
  handleDeleteBudget,
  formatCurrency
}: BudgetsSectionProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Orçamentos</h2>
      </div>
      
      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
            <div className="text-xs text-green-600 dark:text-green-400 mb-1">Total orçado</div>
            <div className="text-lg font-medium text-green-700 dark:text-green-400">{formatCurrency(totalBudgeted)}</div>
          </div>
          
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
            <div className="text-xs text-red-600 dark:text-red-400 mb-1">Total utilizado</div>
            <div className="text-lg font-medium text-red-700 dark:text-red-400">{formatCurrency(totalUsed)}</div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">Saldo estimado</div>
          <div className="text-lg font-medium text-blue-600 dark:text-blue-400">{formatCurrency(estimatedBalance)}</div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700">
        <h3 className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Seus Orçamentos</h3>
        
        <div className="max-h-96 overflow-y-auto px-5 pb-4">
          {budgets.length === 0 ? (
            <div className="py-6 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-600 mb-3">
                <Plus className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum orçamento cadastrado</p>
              <button 
                className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400"
                onClick={() => setIsNewBudgetModalOpen(true)}
              >
                Adicionar orçamento
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map(budget => {
                const usage = getBudgetUsage(budget.id);
                const percentage = budget.limit === 0 ? 0 : Math.round(usage / budget.limit * 100);
                const isOverBudget = percentage > 90;
                
                return (
                  <div key={budget.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white">{budget.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isOverBudget ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {percentage}%
                        </span>
                        <div className="relative">
                          <button 
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={() => setOpenMenuId(openMenuId === budget.id ? null : budget.id)}
                            aria-label="Opções"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </button>
                          
                          {openMenuId === budget.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                              <button 
                                className="w-full flex items-center px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                  handleEditBudget(budget);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2 text-blue-500" />
                                Editar
                              </button>
                              <button 
                                className="w-full flex items-center px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                  handleDeleteBudget(budget.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2 text-red-500" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">{formatCurrency(usage)}</span>
                      <span className="text-gray-500 dark:text-gray-400">de {formatCurrency(budget.limit)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className={isOverBudget ? 'bg-red-500 dark:bg-red-400 h-1.5 rounded-full' : 'bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full'}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
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
