import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExpenseCategory {
  id: number;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

interface ExpenseCategoryChartProps {
  categories: ExpenseCategory[];
  totalExpenses: number;
  formatCurrency: (value: number) => string;
}

export default function ExpenseCategoryChart({ 
  categories, 
  totalExpenses,
  formatCurrency 
}: ExpenseCategoryChartProps) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
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
  
  // Preparar dados para o gráfico
  const chartData = categories.map((category, index) => ({
    name: category.name,
    value: category.amount,
    percentage: category.percentage,
    // Usar cor da categoria se disponível, senão usar cor do tema
    color: category.color || themeColors[index % themeColors.length]
  }));
  
  // Função para renderizar o rótulo personalizado
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
  }: any) => {
    // Não mostrar rótulos em dispositivos móveis ou para percentuais muito pequenos
    if (isMobile || percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Função para renderizar o tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-700 dark:text-gray-300">{formatCurrency(payload[0].value)}</p>
          <p className="text-gray-500 dark:text-gray-400">{`${(payload[0].payload.percentage * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Função para lidar com o hover sobre as fatias do gráfico
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <h3 className="text-base font-semibold mb-2">Despesas por Categoria</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhuma categoria de despesa encontrada</p>
            <button className="text-blue-600 dark:text-blue-400">
              Adicionar categoria
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold">Despesas por Categoria</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(totalExpenses)}
        </p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={isMobile ? 80 : 100}
              innerRadius={isMobile ? 40 : 60}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={activeIndex === index ? '#fff' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout={isMobile ? "horizontal" : "vertical"} 
              align={isMobile ? "center" : "right"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              iconType="circle"
              wrapperStyle={isMobile ? { marginTop: '10px' } : { marginRight: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}