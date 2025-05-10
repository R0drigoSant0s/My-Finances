import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'wouter';
import { ChevronLeft, Plus, BarChart3, Trash2, Edit2, Search, Filter, ArrowDownUp, X } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Transaction, Budget } from '@/components/Finances/types';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';
import { useIsMobile } from '@/hooks/use-mobile';

// Registrar componentes do Chart.js
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface CategoryDetailsPageProps {
  transactions: Transaction[];
  budgets: Budget[];
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
  onDeleteBudget: (id: number) => Promise<void>;
  onEditBudget: (budget: Budget) => void;
  selectedMonth: Date;
}

export default function CategoryDetailsPage({
  transactions,
  budgets,
  formatCurrency,
  formatDate,
  onDeleteBudget,
  onEditBudget,
  selectedMonth
}: CategoryDetailsPageProps) {
  const [location, setLocation] = useLocation();
  const { impact } = useTapticFeedback();
  const isMobile = useIsMobile();
  
  const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortOption, setSortOption] = useState<'amount' | 'name'>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filtrar apenas despesas
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Calcular somas por categoria
  const calculateCategoryData = () => {
    // Inicializar o mapa de categorias
    const categoriesMap = new Map();
    
    // Adicionar orçamentos/categorias existentes
    budgets.forEach(budget => {
      // Calcular quanto foi gasto na categoria
      const spent = expenses
        .filter(e => e.budgetId === budget.id)
        .reduce((sum, e) => sum + e.amount, 0);
      
      categoriesMap.set(budget.id, {
        id: budget.id,
        name: budget.name,
        total: spent,
        limit: budget.limit,
        color: budget.color || getRandomColor(budget.id),
        percentage: budget.limit > 0 ? Math.min(100, (spent / budget.limit) * 100) : 0,
        transactions: expenses.filter(e => e.budgetId === budget.id)
      });
    });
    
    // Adicionar categoria "Sem categoria" para despesas sem orçamento
    const uncategorizedExpenses = expenses.filter(e => !e.budgetId);
    if (uncategorizedExpenses.length > 0) {
      const uncategorizedTotal = uncategorizedExpenses.reduce((sum, e) => sum + e.amount, 0);
      categoriesMap.set('uncategorized', {
        id: 'uncategorized',
        name: 'Sem categoria',
        total: uncategorizedTotal,
        limit: 0,
        color: 'rgba(160, 174, 192, 0.7)',
        percentage: 0,
        transactions: uncategorizedExpenses
      });
    }
    
    return Array.from(categoriesMap.values());
  };
  
  const getRandomColor = (seed: number) => {
    const colors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(78, 166, 134, 0.7)',
      'rgba(205, 97, 85, 0.7)',
    ];
    return colors[seed % colors.length];
  };
  
  const categoryData = calculateCategoryData();
  
  // Aplicar pesquisa
  const filteredCategories = categoryData
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.transactions.some((t: Transaction) => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
  // Aplicar ordenação
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOption === 'amount') {
      return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
    } else {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
  });
  
  // Calcular total de despesas
  const totalExpenses = categoryData.reduce((sum, category) => sum + category.total, 0);
  
  // Dados para o gráfico de rosca
  const doughnutData = {
    labels: sortedCategories.map(category => category.name),
    datasets: [
      {
        data: sortedCategories.map(category => category.total),
        backgroundColor: sortedCategories.map(category => category.color),
        borderColor: sortedCategories.map(category => category.color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };
  
  // Dados para o gráfico de barras
  const barData = {
    labels: sortedCategories.map(category => category.name),
    datasets: [
      {
        label: 'Gastos',
        data: sortedCategories.map(category => category.total),
        backgroundColor: sortedCategories.map(category => category.color),
        borderColor: sortedCategories.map(category => category.color.replace('0.7', '1')),
        borderWidth: 1,
      },
      {
        label: 'Limite',
        data: sortedCategories.map(category => category.limit || 0),
        backgroundColor: 'rgba(220, 220, 220, 0.7)',
        borderColor: 'rgba(220, 220, 220, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Opções para o gráfico de rosca
  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = ((value / totalExpenses) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };
  
  // Opções para o gráfico de barras
  const barOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (value >= 1000) {
              return formatCurrency(value).split(',')[0];
            }
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    impact();
  };
  
  const handleDeleteCategory = async (id: number | string) => {
    if (typeof id === 'number') {
      if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
          await onDeleteBudget(id);
        } catch (error) {
          console.error('Erro ao excluir categoria:', error);
        }
      }
    }
  };
  
  const handleAddNewCategory = () => {
    setLocation('/categories/new');
  };
  
  const handleEditCategory = (budget: Budget) => {
    onEditBudget(budget);
  };
  
  const handleGoBack = () => {
    setLocation('/');
  };
  
  const renderPieChart = () => (
    <div className="relative h-64 w-full">
      <Doughnut data={doughnutData} options={doughnutOptions} />
      {/* Total no centro */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
        <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
          {formatCurrency(totalExpenses)}
        </span>
      </div>
    </div>
  );
  
  const renderBarChart = () => (
    <div className="h-64 w-full">
      <Bar data={barData} options={barOptions} />
    </div>
  );
  
  // Formatar mês/ano para exibição
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 touch-area-expanded"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Despesas por Categoria</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              impact();
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 touch-area-expanded"
            aria-label="Pesquisar"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={handleAddNewCategory}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 touch-area-expanded"
            aria-label="Adicionar Categoria"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Subtítulo com mês selecionado */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Relatório de {formatMonthYear(selectedMonth)}
      </p>
      
      {/* Barra de pesquisa */}
      {showSearch && (
        <div className="mb-4 flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por categoria ou despesa..."
              className="w-full px-3 pl-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="ml-2 flex">
            <button
              onClick={() => {
                setSortOption(sortOption === 'amount' ? 'name' : 'amount');
                impact();
              }}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 touch-area-expanded mr-1"
              aria-label="Alternar ordenação"
            >
              {sortOption === 'amount' ? 'Valor' : 'Nome'}
            </button>
            
            <button
              onClick={toggleSortDirection}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 touch-area-expanded"
              aria-label="Inverter ordem"
            >
              <ArrowDownUp className={`w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}
      
      {/* Seletor de tipo de gráfico */}
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex">
          <button
            onClick={() => {
              setActiveChart('pie');
              impact();
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'pie'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Gráfico de Rosca
          </button>
          <button
            onClick={() => {
              setActiveChart('bar');
              impact();
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'bar'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Gráfico de Barras
          </button>
        </div>
      </div>
      
      {/* Exibir o gráfico selecionado */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
        {activeChart === 'pie' ? renderPieChart() : renderBarChart()}
      </div>
      
      {/* Lista de categorias */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Detalhes por Categoria</h2>
        
        {sortedCategories.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Nenhuma categoria encontrada para esta pesquisa.' 
                : 'Nenhuma categoria com despesas neste período.'}
            </p>
          </div>
        ) : (
          sortedCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {/* Cabeçalho da categoria */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(category.total)}
                    </span>
                    
                    {category.id !== 'uncategorized' && (
                      <div className="flex ml-2">
                        <button
                          onClick={() => {
                            impact();
                            handleEditCategory(budgets.find(b => b.id === category.id) as Budget);
                          }}
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-area-expanded"
                          aria-label="Editar categoria"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        
                        <button
                          onClick={() => {
                            impact();
                            handleDeleteCategory(category.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 touch-area-expanded"
                          aria-label="Excluir categoria"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Barra de progresso se tiver limite definido */}
                {category.limit > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span 
                        className={
                          category.percentage >= 100 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }
                      >
                        {category.percentage.toFixed(0)}% do limite
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatCurrency(category.total)} / {formatCurrency(category.limit)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          category.percentage >= 100 
                            ? 'bg-red-500' 
                            : category.percentage >= 80 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, category.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transações da categoria */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {category.transactions.map((transaction: Transaction) => (
                  <div key={transaction.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        
        {/* Botão para adicionar nova categoria */}
        <button
          onClick={handleAddNewCategory}
          className="w-full py-3 mt-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors touch-area-expanded"
        >
          <div className="flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            <span>Adicionar Nova Categoria</span>
          </div>
        </button>
      </div>
    </div>
  );
}