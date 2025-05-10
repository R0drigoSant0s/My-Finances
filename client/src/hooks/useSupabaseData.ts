import { useState, useEffect } from 'react';
import { getMonthData, saveMonthSettings, saveTransaction, updateTransaction, deleteTransaction, saveBudget, updateBudget, deleteBudget } from '@/lib/api';
import { MonthData, Transaction, Budget } from '@/components/Finances/types';
import { useToast } from './use-toast';

// Função auxiliar para armazenar as categorias de transações e orçamentos localmente
// até que a migração do banco de dados seja feita
const TRANSACTION_CATEGORY_STORAGE_KEY = 'transaction_categories';
const BUDGET_CATEGORY_STORAGE_KEY = 'budget_categories';

// Salvar a associação de transação -> categoria
function saveTransactionCategory(transactionId: number, categoryId: number | null) {
  try {
    const storageData = localStorage.getItem(TRANSACTION_CATEGORY_STORAGE_KEY);
    const categories = storageData ? JSON.parse(storageData) : {};
    categories[transactionId] = categoryId;
    localStorage.setItem(TRANSACTION_CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Erro ao salvar categoria no localStorage:', err);
  }
}

// Obter a categoria de uma transação
function getTransactionCategory(transactionId: number): number | null {
  try {
    const storageData = localStorage.getItem(TRANSACTION_CATEGORY_STORAGE_KEY);
    if (!storageData) return null;
    
    const categories = JSON.parse(storageData);
    return categories[transactionId] || null;
  } catch (err) {
    console.error('Erro ao ler categoria do localStorage:', err);
    return null;
  }
}

// Salvar a associação de orçamento -> categoria
function saveBudgetCategory(budgetId: number, categoryId: number | null) {
  try {
    const storageData = localStorage.getItem(BUDGET_CATEGORY_STORAGE_KEY);
    const categories = storageData ? JSON.parse(storageData) : {};
    categories[budgetId] = categoryId;
    localStorage.setItem(BUDGET_CATEGORY_STORAGE_KEY, JSON.stringify(categories));
    console.log(`Categoria ${categoryId} salva para orçamento ${budgetId}`);
  } catch (err) {
    console.error('Erro ao salvar categoria de orçamento no localStorage:', err);
  }
}

// Obter a categoria de um orçamento
function getBudgetCategory(budgetId: number): number | null {
  try {
    const storageData = localStorage.getItem(BUDGET_CATEGORY_STORAGE_KEY);
    if (!storageData) return null;
    
    const categories = JSON.parse(storageData);
    return categories[budgetId] || null;
  } catch (err) {
    console.error('Erro ao ler categoria de orçamento do localStorage:', err);
    return null;
  }
}

// Exportar as funções para que possam ser usadas fora do hook
export { saveBudgetCategory, getBudgetCategory };

export function useSupabaseData(yearMonth: string) {
  const [data, setData] = useState<MonthData>({
    transactions: [],
    budgets: [],
    initialBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Função para buscar dados do mês, pode ser chamada de fora do hook quando necessário
  const fetchData = async () => {
    setLoading(true);
    try {
      const monthData = await getMonthData(yearMonth);
      
      // Aplicar categorias armazenadas localmente às transações
      // já que a coluna category_id não existe no banco de dados ainda
      const transactionsWithLocalCategories = monthData.transactions.map(t => {
        const localCategoryId = getTransactionCategory(t.id);
        return {
          ...t,
          categoryId: t.categoryId || localCategoryId || undefined
        };
      });
      
      // Aplicar categorias armazenadas localmente aos orçamentos
      const budgetsWithLocalCategories = monthData.budgets.map(b => {
        const localCategoryId = getBudgetCategory(b.id);
        return {
          ...b,
          categoryId: b.categoryId || localCategoryId || undefined
        };
      });
      
      // Atualizar o estado com os dados corretos
      setData({
        ...monthData,
        transactions: transactionsWithLocalCategories as Transaction[],
        budgets: budgetsWithLocalCategories as Budget[]
      });
      
      setError(null);
      return monthData;
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar seus dados financeiros.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when yearMonth changes
  useEffect(() => {
    fetchData();
  }, [yearMonth]);

  // Update initial balance
  const updateInitialBalance = async (balance: number) => {
    try {
      await saveMonthSettings(yearMonth, balance);
      setData(prev => ({ ...prev, initialBalance: balance }));
      toast({
        title: "Saldo inicial atualizado",
        description: "O saldo inicial foi atualizado com sucesso.",
      });
    } catch (err) {
      console.error('Error updating initial balance:', err);
      toast({
        title: "Erro ao atualizar saldo",
        description: "Não foi possível atualizar o saldo inicial.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Add transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await saveTransaction(transaction);
      
      // Salvar a categoria no localStorage temporariamente
      if (transaction.categoryId) {
        saveTransactionCategory(newTransaction.id, transaction.categoryId);
      }
      
      setData(prev => ({
        ...prev,
        transactions: [...prev.transactions, {
          id: newTransaction.id,
          description: newTransaction.description,
          amount: newTransaction.amount,
          type: newTransaction.type,
          date: newTransaction.date,
          budgetId: newTransaction.budget_id,
          categoryId: transaction.categoryId || undefined // Corrigir problemas de tipo
        }]
      }));
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso.",
      });
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      toast({
        title: "Erro ao adicionar transação",
        description: "Não foi possível adicionar a transação.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update transaction
  const editTransaction = async (id: number, transaction: Omit<Transaction, 'id'>) => {
    try {
      await updateTransaction(id, transaction);
      
      // Salvar a categoria no localStorage temporariamente
      if (transaction.categoryId) {
        saveTransactionCategory(id, transaction.categoryId);
      }
      
      setData(prev => ({
        ...prev,
        transactions: prev.transactions.map(t => 
          t.id === id ? { ...transaction, id } : t
        )
      }));
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      });
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast({
        title: "Erro ao atualizar transação",
        description: "Não foi possível atualizar a transação.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete transaction
  const removeTransaction = async (id: number) => {
    try {
      await deleteTransaction(id);
      setData(prev => ({
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id)
      }));
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso.",
      });
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast({
        title: "Erro ao remover transação",
        description: "Não foi possível remover a transação.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Add budget
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const newBudget = await saveBudget(budget);
      
      // Salvar a categoria no localStorage
      if (newBudget.id && budget.categoryId !== undefined) {
        saveBudgetCategory(newBudget.id, budget.categoryId);
      }
      
      setData(prev => ({
        ...prev,
        budgets: [...prev.budgets, {
          id: newBudget.id,
          name: newBudget.name,
          limit: newBudget.limit,
          categoryId: budget.categoryId
        }]
      }));
      toast({
        title: "Orçamento adicionado",
        description: "O orçamento foi adicionado com sucesso.",
      });
      return newBudget;
    } catch (err) {
      console.error('Error adding budget:', err);
      toast({
        title: "Erro ao adicionar orçamento",
        description: "Não foi possível adicionar o orçamento.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update budget
  const editBudget = async (id: number, budget: Omit<Budget, 'id'>) => {
    try {
      await updateBudget(id, budget);
      
      // Salvar a categoria no localStorage
      if (budget.categoryId !== undefined) {
        saveBudgetCategory(id, budget.categoryId);
      }
      
      setData(prev => ({
        ...prev,
        budgets: prev.budgets.map(b => 
          b.id === id ? { ...budget, id } : b
        )
      }));
      toast({
        title: "Orçamento atualizado",
        description: "O orçamento foi atualizado com sucesso.",
      });
    } catch (err) {
      console.error('Error updating budget:', err);
      toast({
        title: "Erro ao atualizar orçamento",
        description: "Não foi possível atualizar o orçamento.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete budget
  const removeBudget = async (id: number) => {
    try {
      await deleteBudget(id);
      
      // Remover a categoria do orçamento do localStorage
      try {
        const storageData = localStorage.getItem(BUDGET_CATEGORY_STORAGE_KEY);
        if (storageData) {
          const categories = JSON.parse(storageData);
          delete categories[id];
          localStorage.setItem(BUDGET_CATEGORY_STORAGE_KEY, JSON.stringify(categories));
        }
      } catch (e) {
        console.warn('Erro ao remover categoria do orçamento do localStorage:', e);
      }
      
      setData(prev => ({
        ...prev,
        budgets: prev.budgets.filter(b => b.id !== id)
      }));
      toast({
        title: "Orçamento removido",
        description: "O orçamento foi removido com sucesso.",
      });
    } catch (err) {
      console.error('Error deleting budget:', err);
      toast({
        title: "Erro ao remover orçamento",
        description: "Não foi possível remover o orçamento.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    updateInitialBalance,
    addTransaction,
    editTransaction,
    removeTransaction,
    addBudget,
    editBudget,
    removeBudget,
    refetch: fetchData // Expor a função fetchData como refetch
  };
}