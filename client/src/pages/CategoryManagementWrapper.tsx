import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Transaction, Budget } from '@/components/Finances/types';
import CategoryManagementPage from './CategoryManagementPage';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { saveBudget, updateBudget, deleteBudget } from '@/lib/api';

export default function CategoryManagementWrapper() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const { 
    data: monthData, 
    loading: isLoading, 
    error: isError,
    addBudget: _addBudget,
    editBudget: _editBudget,
    removeBudget: _removeBudget
  } = useSupabaseData(currentYearMonth);
  
  // Função auxiliar para atualizar os dados após operações CRUD
  const refetchBudgets = () => {
    // Já temos as funções individuais que atualizam o estado
    // Não precisamos fazer nada adicional aqui
  };
  
  // Formato de moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  // Handlers para operações de CRUD de categorias
  const handleAddBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      await _addBudget(budget);
      toast({
        title: "Categoria adicionada",
        description: `A categoria ${budget.name} foi adicionada com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao adicionar a categoria.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const handleEditBudget = async (id: number, budget: Omit<Budget, 'id'>) => {
    try {
      await _editBudget(id, budget);
      toast({
        title: "Categoria atualizada",
        description: `A categoria ${budget.name} foi atualizada com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar a categoria.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const handleDeleteBudget = async (id: number) => {
    try {
      await _removeBudget(id);
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando categorias...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !monthData) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-4 text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Erro ao carregar dados</h3>
          <p className="text-red-700 dark:text-red-300 mt-1">
            Não foi possível carregar as categorias. Tente novamente mais tarde.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <CategoryManagementPage
      budgets={monthData.budgets || []}
      transactions={monthData.transactions || []}
      onAddBudget={handleAddBudget}
      onEditBudget={handleEditBudget}
      onDeleteBudget={handleDeleteBudget}
      formatCurrency={formatCurrency}
    />
  );
}