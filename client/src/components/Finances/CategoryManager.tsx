import React, { useState } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';

export interface Category {
  id: number;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'investment';
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (id: number, category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: number) => void;
}

// Cores do tema do aplicativo para garantir consistência visual em toda a UI
const COLORS = [
  '#3b82f6', // Azul (cor primária)
  '#ef4444', // Vermelho
  '#10b981', // Verde
  '#f59e0b', // Amarelo
  '#8b5cf6', // Roxo
  '#ec4899', // Rosa
  '#6366f1', // Indigo
  '#0ea5e9', // Azul claro
  '#f97316', // Laranja
  '#64748b', // Cinza azulado
  // Cores adicionais para maior variedade
  '#0891b2', // Ciano
  '#84cc16', // Verde limão
  '#7c3aed', // Violeta
  '#d946ef', // Magenta
  '#4f46e5'  // Índigo escuro
];

export default function CategoryManager({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'investment'>('all');
  
  // Estado para o formulário
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState(COLORS[0]);
  const [categoryType, setCategoryType] = useState<'income' | 'expense' | 'investment'>('expense');
  
  // Filtrar categorias
  const filteredCategories = filter === 'all' 
    ? categories 
    : categories.filter(cat => cat.type === filter);
  
  // Abrir modal para adicionar
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setCategoryName('');
    setCategoryColor(COLORS[0]);
    setCategoryType('expense');
    setIsModalOpen(true);
  };
  
  // Abrir modal para editar
  const handleOpenEditModal = (category: Category) => {
    setIsEditing(true);
    setEditingId(category.id);
    setCategoryName(category.name);
    setCategoryColor(category.color);
    setCategoryType(category.type);
    setIsModalOpen(true);
  };
  
  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Salvar categoria (adicionar ou editar)
  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      alert('Por favor, insira um nome para a categoria');
      return;
    }
    
    const categoryData = {
      name: categoryName.trim(),
      color: categoryColor,
      type: categoryType
    };
    
    if (isEditing && editingId !== null) {
      onEditCategory(editingId, categoryData);
    } else {
      onAddCategory(categoryData);
    }
    
    setIsModalOpen(false);
    setCategoryName('');
  };
  
  // Confirmar exclusão
  const handleDeleteConfirm = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Transações relacionadas ficarão sem categoria.')) {
      onDeleteCategory(id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Categorias</h3>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md"
        >
          <Plus size={16} />
          Nova Categoria
        </button>
      </div>
      
      {/* Filtros */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
            filter === 'all' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Todas
        </button>
        <button 
          onClick={() => setFilter('income')}
          className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
            filter === 'income' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Receitas
        </button>
        <button 
          onClick={() => setFilter('expense')}
          className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
            filter === 'expense' 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Despesas
        </button>
        <button 
          onClick={() => setFilter('investment')}
          className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
            filter === 'investment' 
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Investimentos
        </button>
      </div>
      
      {/* Lista de categorias */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredCategories.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma categoria encontrada
            </p>
          </div>
        ) : (
          filteredCategories.map(category => (
            <div 
              key={category.id} 
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  category.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : category.type === 'expense'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  {category.type === 'income' ? 'Receita' : 
                   category.type === 'expense' ? 'Despesa' : 'Investimento'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(category)}
                  className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteConfirm(category.id)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal para adicionar/editar categoria */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                  placeholder="Ex: Alimentação, Transporte, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Categoria
                </label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                  <option value="investment">Investimento</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCategoryColor(color)}
                      className={`w-8 h-8 rounded-full ${
                        categoryColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Categoria'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}