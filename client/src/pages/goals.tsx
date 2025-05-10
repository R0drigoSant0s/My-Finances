import AppLayout from '@/components/Layout/AppLayout';
import { PlusCircle, TrendingUp, Target, DollarSign, Percent } from 'lucide-react';
import { useState } from 'react';

export default function GoalsPage() {
  // Exemplo de metas financeiras (na implementação real, viria de uma API)
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      title: 'Fundo de Emergência', 
      target: 15000, 
      current: 10500, 
      deadline: '2023-12-31',
      category: 'Segurança' 
    },
    { 
      id: 2, 
      title: 'Entrada para Apartamento', 
      target: 50000, 
      current: 15000, 
      deadline: '2025-06-30',
      category: 'Moradia' 
    },
    { 
      id: 3, 
      title: 'Viagem para Europa', 
      target: 20000, 
      current: 8000, 
      deadline: '2024-07-15',
      category: 'Lazer' 
    },
    { 
      id: 4, 
      title: 'Curso de Especialização', 
      target: 8000, 
      current: 3000, 
      deadline: '2023-09-01',
      category: 'Educação' 
    },
  ]);
  
  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Função para formatar data
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Função para calcular o progresso da meta
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  // Função para determinar a cor do progresso
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  // Modal de nova meta
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    target: '',
    current: '',
    deadline: '',
    category: ''
  });

  // Função para adicionar nova meta
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal = {
      id: goals.length + 1,
      title: newGoalData.title,
      target: parseFloat(newGoalData.target),
      current: parseFloat(newGoalData.current || '0'),
      deadline: newGoalData.deadline,
      category: newGoalData.category
    };
    
    setGoals([...goals, newGoal]);
    setIsNewGoalModalOpen(false);
    setNewGoalData({
      title: '',
      target: '',
      current: '',
      deadline: '',
      category: ''
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas Financeiras</h1>
          
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Meta
          </button>
        </div>
        
        {/* Cards de estatísticas gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Metas</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{goals.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Total de Metas</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(goals.reduce((acc, goal) => acc + goal.target, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md">
                <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Economizado</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(goals.reduce((acc, goal) => acc + goal.current, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
                <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progresso Médio</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal.current, goal.target), 0) / (goals.length || 1))}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de metas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target);
            const progressColor = getProgressColor(progress);
            
            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {goal.category} • Prazo: {formatDate(goal.deadline)}
                  </p>
                  
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatCurrency(goal.current)} de {formatCurrency(goal.target)}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {progress}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${progressColor} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      Editar
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      Adicionar Depósito
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modal para adicionar nova meta */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nova Meta Financeira</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                onClick={() => setIsNewGoalModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddGoal}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título da Meta
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={newGoalData.title}
                    onChange={(e) => setNewGoalData({...newGoalData, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Alvo (R$)
                  </label>
                  <input
                    type="number"
                    id="target"
                    required
                    min="0"
                    step="0.01"
                    value={newGoalData.target}
                    onChange={(e) => setNewGoalData({...newGoalData, target: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="current" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Atual (R$)
                  </label>
                  <input
                    type="number"
                    id="current"
                    min="0"
                    step="0.01"
                    value={newGoalData.current}
                    onChange={(e) => setNewGoalData({...newGoalData, current: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Limite
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    required
                    value={newGoalData.deadline}
                    onChange={(e) => setNewGoalData({...newGoalData, deadline: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    id="category"
                    required
                    value={newGoalData.category}
                    onChange={(e) => setNewGoalData({...newGoalData, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Educação">Educação</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Aposentadoria">Aposentadoria</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Adicionar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}