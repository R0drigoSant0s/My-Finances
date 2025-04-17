import { useState, useEffect } from 'react';
import { getMonthData, saveMonthSettings, saveTransaction, updateTransaction, deleteTransaction, saveBudget, updateBudget, deleteBudget } from '@/lib/api';
import { MonthData, Transaction, Budget } from '@/components/Finances/types';
import { useToast } from './use-toast';

export function useSupabaseData(yearMonth: string) {
  const [data, setData] = useState<MonthData>({
    transactions: [],
    budgets: [],
    initialBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch data on mount and when yearMonth changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthData = await getMonthData(yearMonth);
        setData(monthData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados financeiros.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [yearMonth, toast]);

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
      setData(prev => ({
        ...prev,
        transactions: [...prev.transactions, {
          id: newTransaction.id,
          description: newTransaction.description,
          amount: newTransaction.amount,
          type: newTransaction.type,
          date: newTransaction.date,
          budgetId: newTransaction.budget_id
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
      setData(prev => ({
        ...prev,
        budgets: [...prev.budgets, {
          id: newBudget.id,
          name: newBudget.name,
          limit: newBudget.limit
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
    removeBudget
  };
}