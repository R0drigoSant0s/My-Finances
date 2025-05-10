import React from 'react';
import { useLocation, Route } from 'wouter';
import CategoryDetailsPage from './CategoryDetailsPage';
import { Transaction, Budget } from '@/components/Finances/types';

// Dados mock para demonstração - em um app real, estes dados viriam da API
const mockTransactions: Transaction[] = [
  { id: 1, description: 'Supermercado', amount: 250.50, type: 'expense', date: '2025-04-15', budgetId: 1 },
  { id: 2, description: 'Farmácia', amount: 85.30, type: 'expense', date: '2025-04-18', budgetId: 2 },
  { id: 3, description: 'Internet', amount: 120.00, type: 'expense', date: '2025-04-10', budgetId: 3 },
  { id: 4, description: 'Salário', amount: 3500.00, type: 'income', date: '2025-04-05' },
  { id: 5, description: 'Restaurante', amount: 65.80, type: 'expense', date: '2025-04-20', budgetId: 1 },
  { id: 6, description: 'Roupa', amount: 120.00, type: 'expense', date: '2025-04-22', budgetId: 4 },
  { id: 7, description: 'Uber', amount: 25.90, type: 'expense', date: '2025-04-12', budgetId: 5 },
  { id: 8, description: 'Cinema', amount: 45.00, type: 'expense', date: '2025-04-16', budgetId: 6 },
];

const mockBudgets: Budget[] = [
  { id: 1, name: 'Alimentação', limit: 800.00, color: 'rgba(54, 162, 235, 0.7)' },
  { id: 2, name: 'Saúde', limit: 300.00, color: 'rgba(255, 99, 132, 0.7)' },
  { id: 3, name: 'Serviços', limit: 500.00, color: 'rgba(255, 206, 86, 0.7)' },
  { id: 4, name: 'Vestuário', limit: 200.00, color: 'rgba(75, 192, 192, 0.7)' },
  { id: 5, name: 'Transporte', limit: 300.00, color: 'rgba(153, 102, 255, 0.7)' },
  { id: 6, name: 'Lazer', limit: 300.00, color: 'rgba(255, 159, 64, 0.7)' },
];

// Componente wrapper que fornece dados para o CategoryDetailsPage
export default function CategoryDetailsWrapper() {
  const [, setLocation] = useLocation();
  
  // Formato de moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  // Formato de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Funções de mock para manipulação de categorias
  const handleDeleteBudget = async (id: number) => {
    console.log(`Categoria ${id} excluída`);
    // Em um app real, isto faria uma chamada à API
  };
  
  const handleEditBudget = (budget: Budget) => {
    console.log(`Editando categoria:`, budget);
    // Em um app real, isto abriria um modal de edição
  };
  
  return (
    <CategoryDetailsPage
      transactions={mockTransactions}
      budgets={mockBudgets}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      onDeleteBudget={handleDeleteBudget}
      onEditBudget={handleEditBudget}
      selectedMonth={new Date()}
    />
  );
}