import React, { useState } from 'react';
import { ArrowUp, ArrowDown, LineChart, Search, Plus, Filter, Bell } from 'lucide-react';
import BottomNavigation from '../components/Layout/BottomNavigation';
import FloatingActionButton from '../components/Layout/FloatingActionButton';
import MobileHeader from '../components/UI/MobileHeader';
import '../styles/MobileFinances.css';

// Dados de demonstração
const demoTransactions = [
  { 
    id: 1, 
    description: 'Salário', 
    amount: 3500, 
    type: 'income' as const, 
    date: '2023-04-15' 
  },
  { 
    id: 2, 
    description: 'Aluguel', 
    amount: 1200, 
    type: 'expense' as const, 
    date: '2023-04-10' 
  },
  { 
    id: 3, 
    description: 'Compras Supermercado', 
    amount: 450, 
    type: 'expense' as const, 
    date: '2023-04-05' 
  },
  { 
    id: 4, 
    description: 'Ações', 
    amount: 500, 
    type: 'investment' as const, 
    date: '2023-03-28' 
  }
];

export default function MobileDemo() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Função para formatar valores em moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <MobileHeader 
        title="Dashboard" 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      
      {/* Carrossel de Cards */}
      <div className="px-4 pt-4">
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6">
          {/* Card de Saldo */}
          <div className="snap-center min-w-[85%] flex-shrink-0 px-2 first:pl-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-2xl mr-2">
                    <LineChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Saldo Atual</span>
                </div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">3.2%</span>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(1850)}</p>
            </div>
          </div>
          
          {/* Card de Receitas */}
          <div className="snap-center min-w-[85%] flex-shrink-0 px-2">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-2xl mr-2">
                    <ArrowUp className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Receitas</span>
                </div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">0.8%</span>
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">{formatCurrency(3500)}</p>
            </div>
          </div>
          
          {/* Card de Despesas */}
          <div className="snap-center min-w-[85%] flex-shrink-0 px-2 last:pr-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-2xl mr-2">
                    <ArrowDown className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Despesas</span>
                </div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">2.1%</span>
                </div>
              </div>
              <p className="text-xl font-bold text-red-600">{formatCurrency(1650)}</p>
            </div>
          </div>
        </div>
        
        {/* Indicadores de posição */}
        <div className="flex justify-center mt-2 mb-4">
          {[0, 1, 2].map((idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 mx-1 rounded-full ${activeIndex === idx ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
      
      {/* Barra de Pesquisa e Filtros */}
      <div className="flex items-center px-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar transações..." 
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="ml-2 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
          <Filter className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      {/* Lista de Transações */}
      <div className="flex-1 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Transações Recentes</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400">Ver todas</button>
        </div>
        
        <div className="space-y-3">
          {demoTransactions.map(transaction => {
            const isIncome = transaction.type === 'income';
            const isExpense = transaction.type === 'expense';
            const isInvestment = transaction.type === 'investment';
            
            let icon;
            let bgColorClass;
            let textColorClass;
            
            if (isIncome) {
              icon = <ArrowUp className="h-4 w-4 text-green-500" />;
              bgColorClass = 'bg-green-50 dark:bg-green-900/20';
              textColorClass = 'text-green-600 dark:text-green-400';
            } else if (isExpense) {
              icon = <ArrowDown className="h-4 w-4 text-red-500" />;
              bgColorClass = 'bg-red-50 dark:bg-red-900/20';
              textColorClass = 'text-red-600 dark:text-red-400';
            } else {
              icon = <LineChart className="h-4 w-4 text-indigo-500" />;
              bgColorClass = 'bg-indigo-50 dark:bg-indigo-900/20';
              textColorClass = 'text-indigo-600 dark:text-indigo-400';
            }
            
            return (
              <div key={transaction.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-2xl ${bgColorClass} mr-3`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{transaction.description}</h3>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${textColorClass}`}>
                    {isIncome ? '+' : isExpense ? '-' : ''}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Botão de Ação Flutuante */}
      <FloatingActionButton 
        openTransactionModal={() => alert('Abrir modal de nova transação')}
        openBudgetModal={() => alert('Abrir modal de novo orçamento')}
      />
      
      {/* Navegação Inferior */}
      <BottomNavigation 
        setIsNewTransactionModalOpen={() => alert('Abrir modal de nova transação')}
      />
      
      {/* Menu Lateral (se aberto) */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold">Minhas Finanças</h2>
            </div>
            <div className="p-4">
              <nav className="space-y-2">
                <a href="#" className="block p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  Dashboard
                </a>
                <a href="#" className="block p-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Transações
                </a>
                <a href="#" className="block p-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Orçamentos
                </a>
                <a href="#" className="block p-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Configurações
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}