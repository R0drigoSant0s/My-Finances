import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, PieChart } from 'lucide-react';
import { useLocation } from 'wouter';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { cn } from '@/lib/utils';
import { Transaction, Budget } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesByCategoryChartProps {
  transactions: Transaction[];
  budgets: Budget[];
  formatCurrency: (value: number) => string;
  onViewDetails: () => void;
  onManageCategories?: () => void;
}

export default function ExpensesByCategoryChart({
  transactions,
  budgets,
  formatCurrency,
  onViewDetails,
  onManageCategories
}: ExpensesByCategoryChartProps) {
  // Função para calcular o total de despesas por categoria
  const getExpensesByCategory = () => {
    // Criar um mapa de categorias e seus totais
    const categoryMap = new Map<number, { total: number; name: string; color: string }>();
    
    // Cores do tema do aplicativo para garantir consistência visual
    const themeColors = [
      '#3b82f6', // Azul (cor primária)
      '#ef4444', // Vermelho
      '#10b981', // Verde
      '#f59e0b', // Amarelo
      '#8b5cf6', // Roxo
      '#ec4899', // Rosa
      '#6366f1', // Indigo
      '#0ea5e9', // Azul claro
      '#f97316', // Laranja
      '#64748b'  // Cinza azulado
    ];
    
    // Populando o mapa com IDs de orçamentos e seus nomes
    budgets.forEach((budget, index) => {
      // Usar cores do tema para consistência visual
      const color = themeColors[index % themeColors.length];
      categoryMap.set(budget.id, { total: 0, name: budget.name, color });
    });
    
    // Calculando totais por categoria
    transactions.forEach(transaction => {
      if (transaction.type === 'expense' && transaction.budgetId) {
        const category = categoryMap.get(transaction.budgetId);
        if (category) {
          category.total += transaction.amount;
        }
      }
    });
    
    // Convertendo para array e ordenando pelo total (maior para menor)
    return Array.from(categoryMap.values())
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  };
  
  const expenseCategories = getExpensesByCategory();
  
  // Tomar as 5 principais categorias
  const topCategories = expenseCategories.slice(0, 5);
  
  // Agrupar o resto em "Outros" se houver mais de 5 categorias
  let otherTotal = 0;
  if (expenseCategories.length > 5) {
    otherTotal = expenseCategories.slice(5).reduce((sum, category) => sum + category.total, 0);
  }
  
  // Preparar dados para o gráfico
  const chartData = {
    labels: [...topCategories.map(c => c.name), ...(otherTotal > 0 ? ['Outros'] : [])],
    datasets: [{
      data: [...topCategories.map(c => c.total), ...(otherTotal > 0 ? [otherTotal] : [])],
      backgroundColor: [
        ...topCategories.map(c => c.color),
        ...(otherTotal > 0 ? ['#888888'] : [])
      ],
      borderWidth: 1,
      hoverOffset: 4
    }]
  };
  
  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  // Calcular o total de despesas
  const totalExpenses = topCategories.reduce((sum, category) => sum + category.total, 0) + otherTotal;
  
  // Se não houver categorias ou despesas, mostre uma mensagem
  if (topCategories.length === 0) {
    return (
      <Card className="w-full h-full bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <PieChart className="h-5 w-5" />
            Despesas por Categoria
          </CardTitle>
          <CardDescription>Visualize seus gastos por categoria</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <PieChart className="h-12 w-12 mb-4 opacity-20" />
          <p>Sem despesas registradas por categoria.</p>
          <p className="text-sm mt-2">Adicione transações com categorias para visualizar os dados.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <PieChart className="h-5 w-5" />
          Despesas por Categoria
        </CardTitle>
        <CardDescription>Total: {formatCurrency(totalExpenses)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Gráfico de rosca */}
          <div className="w-full md:w-[180px] h-[180px] relative mb-4 md:mb-0">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-center font-medium">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
          
          {/* Lista das 5 principais categorias */}
          <div className="w-full space-y-2">
            {topCategories.map((category, index) => {
              const percentage = Math.round((category.total / totalExpenses) * 100);
              return (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="block w-3 h-3 rounded-full" 
                      style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] as string }}
                    />
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(category.total)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
            
            {otherTotal > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="block w-3 h-3 rounded-full" 
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[topCategories.length] as string }}
                  />
                  <span className="text-sm font-medium">Outros</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatCurrency(otherTotal)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((otherTotal / totalExpenses) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-sm"
          onClick={onViewDetails}
        >
          Ver detalhes por categoria
          <ArrowRight className="ml-auto h-4 w-4" />
        </Button>
        
        {onManageCategories && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-sm"
            onClick={onManageCategories}
          >
            Gerenciar categorias
            <ArrowRight className="ml-auto h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}