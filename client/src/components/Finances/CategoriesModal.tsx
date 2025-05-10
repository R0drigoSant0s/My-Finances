import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { Category } from './types';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';
import NewCategoryModal from './NewCategoryModal';

type CategoryType = 'income' | 'expense' | 'investment';

interface CategoriesModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  categories: Category[];
  onAddCategory?: (category: Omit<Category, 'id'>) => void;
  onEditCategory?: (id: number, category: Omit<Category, 'id'>) => void;
  onDeleteCategory?: (categoryId: number) => void;
}

export default function CategoriesModal({
  isOpen,
  setIsOpen,
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: CategoriesModalProps) {
  const [filter, setFilter] = useState<CategoryType>('expense');
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { impact } = useTapticFeedback();
  
  if (!isOpen) return null;

  const filteredCategories = categories.filter(category => {
    return category.type === filter;
  });

  const handleFilterChange = (newFilter: CategoryType) => {
    setFilter(newFilter);
    impact();
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsNewCategoryModalOpen(true);
    impact();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsNewCategoryModalOpen(true);
    impact();
  };

  const handleSaveCategory = (category: Omit<Category, 'id'>) => {
    if (editingCategory) {
      // Editar categoria existente
      if (onEditCategory) {
        onEditCategory(editingCategory.id, category);
      }
    } else {
      // Adicionar nova categoria
      if (onAddCategory) {
        onAddCategory(category);
      }
    }
  };

  const handleDeleteCategoryWithConfirmation = (categoryId: number) => {
    // Verificar se a categoria está sendo usada em transações antes de excluir
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar transações existentes.');
    
    if (confirmDelete && onDeleteCategory) {
      onDeleteCategory(categoryId);
    }
  };

  // Definir cores e ícones para os tipos de categoria
  const getCategoryTypeColor = (type: CategoryType) => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'investment':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryTypeIndicatorColor = (type: CategoryType) => {
    switch (type) {
      case 'income':
        return 'bg-green-600 dark:bg-green-400';
      case 'expense':
        return 'bg-red-600 dark:bg-red-400';
      case 'investment':
        return 'bg-purple-600 dark:bg-purple-400';
      default:
        return 'bg-gray-600 dark:bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Gerenciar Categorias</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="px-5 pt-4">
          <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800">
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === 'income' 
                  ? getCategoryTypeColor('income') 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => handleFilterChange('income')}
            >
              Receitas
              {filter === 'income' && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${getCategoryTypeIndicatorColor('income')} rounded-t-full`}></div>
              )}
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === 'expense' 
                  ? getCategoryTypeColor('expense') 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => handleFilterChange('expense')}
            >
              Despesas
              {filter === 'expense' && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${getCategoryTypeIndicatorColor('expense')} rounded-t-full`}></div>
              )}
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === 'investment' 
                  ? getCategoryTypeColor('investment') 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => handleFilterChange('investment')}
            >
              Investimentos
              {filter === 'investment' && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${getCategoryTypeIndicatorColor('investment')} rounded-t-full`}></div>
              )}
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full text-center p-6 text-gray-500 dark:text-gray-400">
                Nenhuma categoria encontrada para este filtro.
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: category.color || '#3b82f6' }}
                    ></div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {category.name}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-area-expanded"
                      aria-label="Editar categoria"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategoryWithConfirmation(category.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 touch-area-expanded"
                      aria-label="Excluir categoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg border border-gray-200 dark:border-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Fechar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={handleAddCategory}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Categoria</span>
          </button>
        </div>
      </div>

      {/* Modal para adição/edição de categorias */}
      <NewCategoryModal 
        isOpen={isNewCategoryModalOpen}
        setIsOpen={setIsNewCategoryModalOpen}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        categoryType={filter}
      />
    </div>
  );
}