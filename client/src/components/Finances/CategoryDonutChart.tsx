import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Transaction, Category } from './types';
import { Settings } from 'lucide-react';

// Registrar os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryDonutChartProps {
  transactions: Transaction[];
  categories: Category[];
  formatCurrency: (value: number) => string;
  onManageCategories?: () => void;
}

const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ 
  transactions, 
  categories,
  formatCurrency,
  onManageCategories
}) => {
  // Filtrar apenas as transações de despesas
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Agrupar gastos por categoria
  const expensesByCategory = expenseTransactions.reduce<Record<string, number>>((acc, transaction) => {
    const categoryId = transaction.categoryId;
    
    // Se a transação tem uma categoria
    if (categoryId !== undefined) {
      // Se a categoria já existe no acumulador, somar o valor
      if (acc[categoryId]) {
        acc[categoryId] += transaction.amount;
      } else {
        // Se não, inicializar
        acc[categoryId] = transaction.amount;
      }
    } else {
      // Para transações sem categoria específica
      if (acc['uncategorized']) {
        acc['uncategorized'] += transaction.amount;
      } else {
        acc['uncategorized'] = transaction.amount;
      }
    }
    
    return acc;
  }, {});
  
  // Preparar os dados para o gráfico
  const chartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [] as string[],
        borderColor: [] as string[],
        borderWidth: 1,
      },
    ],
  };
  
  // Preencher os dados do gráfico
  Object.entries(expensesByCategory).forEach(([categoryId, amount]) => {
    if (categoryId === 'uncategorized') {
      chartData.labels.push('Sem categoria');
      chartData.datasets[0].data.push(amount);
      chartData.datasets[0].backgroundColor.push('rgba(203, 213, 225, 0.5)'); // Cor mais clara e transparente para sem categoria
      chartData.datasets[0].borderColor.push('rgba(148, 163, 184, 0.5)');
    } else {
      const category = categories.find(c => c.id === parseInt(categoryId));
      if (category) {
        chartData.labels.push(category.name);
        chartData.datasets[0].data.push(amount);
        chartData.datasets[0].backgroundColor.push(category.color);
        chartData.datasets[0].borderColor.push(category.color);
      }
    }
  });
  
  // Calcular o total de despesas
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Opções para o gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / totalExpenses) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  // Verificar se há dados para exibir
  const hasData = chartData.datasets[0].data.length > 0;
  
  // Renderizar a legenda manualmente
  const renderLegend = () => {
    return chartData.labels.map((label, index) => {
      const value = chartData.datasets[0].data[index];
      const percentage = ((value / totalExpenses) * 100).toFixed(1);
      const color = chartData.datasets[0].backgroundColor[index];
      const isUncategorized = label === 'Sem categoria';
      
      return (
        <div key={index} className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: color as string }}
            ></div>
            <span className={`text-sm ${isUncategorized 
              ? 'text-gray-400 dark:text-gray-500 italic' 
              : 'text-gray-600 dark:text-gray-300'}`}>
              {label}: {percentage}%
            </span>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {formatCurrency(value)}
          </div>
        </div>
      );
    });
  };
  
  return (
    <div className="h-full w-full">
      {/* Header sempre visível com título e botão de configuração */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
          Gastos por Categoria
        </div>
        {onManageCategories && (
          <button 
            onClick={onManageCategories}
            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1 rounded-full transition-colors"
            title="Gerenciar Categorias"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Conteúdo condicional do gráfico */}
      {hasData ? (
        <div className="flex flex-col h-[calc(100%-32px)]">
          <div className="relative h-[180px] mb-3">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>
          <div className="mt-auto overflow-y-auto max-h-[120px] pr-1">
            {renderLegend()}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-32px)] p-4 text-center">
          <div className="text-gray-400 mb-2">Sem dados de despesas por categoria</div>
          <p className="text-sm text-gray-500">
            Adicione transações com categorias para visualizar o gráfico de distribuição.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryDonutChart;