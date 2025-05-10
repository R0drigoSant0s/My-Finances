import React, { useState } from 'react';
import { Category } from './types';
import { Plus, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';

type CategoryType = 'income' | 'expense' | 'investment';

interface CategoriesTabProps {
  categories: Category[];
  onClose: () => void;
  onAddCategory?: () => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (categoryId: number) => void;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  onClose,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [filter, setFilter] = useState<CategoryType>('expense');
  const { impact } = useTapticFeedback();

  const filteredCategories = categories.filter(category => {
    return category.type === filter;
  });

  const handleFilterChange = (newFilter: CategoryType) => {
    setFilter(newFilter);
    impact();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Gerenciar Categorias</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 dark:text-gray-400">
          Fechar
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800">
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              filter === 'income' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleFilterChange('income')}
          >
            Receitas
            {filter === 'income' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-400 rounded-t-full"></div>
            )}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              filter === 'expense' 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleFilterChange('expense')}
          >
            Despesas
            {filter === 'expense' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 dark:bg-red-400 rounded-t-full"></div>
            )}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              filter === 'investment' 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => handleFilterChange('investment')}
          >
            Investimentos
            {filter === 'investment' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 rounded-t-full"></div>
            )}
          </button>
        </div>
        
        {onAddCategory && (
          <Button 
            size="sm"
            variant="outline"
            className="flex items-center"
            onClick={() => {
              impact();
              if (onAddCategory) onAddCategory();
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nova
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] pr-1">
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
                {onEditCategory && (
                  <button
                    onClick={() => {
                      impact();
                      if (onEditCategory) onEditCategory(category);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-area-expanded"
                    aria-label="Editar categoria"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
                {onDeleteCategory && (
                  <button
                    onClick={() => {
                      impact();
                      if (onDeleteCategory) onDeleteCategory(category.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 touch-area-expanded"
                    aria-label="Excluir categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;