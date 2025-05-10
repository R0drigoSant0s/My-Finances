import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Budget } from './types';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';
import CurrencyInput from '../UI/CurrencyInput';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<Budget, 'id'> | Budget) => Promise<void>;
  category?: Budget;
  isEditMode?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  isEditMode = false
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [color, setColor] = useState('#3b82f6'); // Azul padrão
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { impact, notification } = useTapticFeedback();
  
  // Predefinição de cores
  const colorOptions = [
    '#3b82f6', // Azul
    '#ef4444', // Vermelho
    '#10b981', // Verde
    '#f59e0b', // Âmbar
    '#8b5cf6', // Roxo
    '#ec4899', // Rosa
    '#6b7280', // Cinza
    '#0ea5e9', // Azul claro
    '#84cc16', // Verde limão
    '#f97316', // Laranja
  ];
  
  // Inicializar com os valores da categoria em edição
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setLimit(category.limit?.toString() || '');
      setColor(category.color || colorOptions[0]);
    } else {
      // Valores iniciais para nova categoria
      setName('');
      setLimit('');
      setColor(colorOptions[0]);
    }
  }, [category, isOpen]);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar campos
    if (!name.trim()) {
      setError('Por favor, informe um nome para a categoria.');
      notification('error');
      return;
    }
    
    // Converter limit para número
    const limitValue = limit ? parseFloat(limit.replace(',', '.')) : 0;
    
    try {
      setIsSubmitting(true);
      // Criar objeto com dados da categoria
      const budgetData: Omit<Budget, 'id'> = {
        name: name.trim(),
        limit: limitValue,
        color: color,
      };
      
      // Se for edição, incluir o ID da categoria
      if (isEditMode && category) {
        await onSave({ ...budgetData, id: category.id });
      } else {
        await onSave(budgetData);
      }
      
      // Feedback tátil de sucesso
      notification('success');
      
      // Resetar form e fechar modal
      resetForm();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError('Ocorreu um erro ao salvar a categoria. Tente novamente.');
      notification('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setLimit('');
    setColor(colorOptions[0]);
    setError('');
  };
  
  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md shadow-xl animate-in zoom-in-95 duration-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditMode ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button
            onClick={() => {
              impact();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-4">
          {/* Campo nome da categoria */}
          <div className="mb-4">
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome da Categoria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Ex: Alimentação, Transporte, Lazer"
              required
            />
          </div>
          
          {/* Campo limite da categoria */}
          <div className="mb-4">
            <CurrencyInput
              label="Limite Mensal"
              value={limit}
              onChange={setLimit}
              id="category-limit"
              placeholder="R$ 0,00 (opcional)"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Defina um limite para monitorar seus gastos nesta categoria.
            </p>
          </div>
          
          {/* Seletor de cor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor da Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => {
                    setColor(colorOption);
                    impact();
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === colorOption 
                      ? 'border-gray-900 dark:border-white scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  aria-label={`Cor ${colorOption}`}
                />
              ))}
            </div>
          </div>
          
          {/* Campo de cor personalizada */}
          <div className="mb-6">
            <label htmlFor="custom-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cor Personalizada
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="custom-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="ml-2 flex-1 px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="#RRGGBB"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Digite um código de cor hex (ex: #3b82f6) ou use o seletor.
            </p>
          </div>
          
          {/* Mensagem de erro */}
          {error && (
            <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Botões de ação */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                impact();
                onClose();
              }}
              className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </div>
              ) : isEditMode ? 'Atualizar' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}