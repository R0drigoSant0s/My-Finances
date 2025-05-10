import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronDown, Tag } from 'lucide-react';
import { Category } from './types';
import { useTapticFeedback } from '@/hooks/useTapticFeedback';
import { iconCategories } from './utils/iconCategories';
import { getIcon } from './utils/lucideIcons';

// Mapeamento de cores com códigos e nomes amigáveis
// Organizadas em 3 linhas de 6 cores (18 cores no total)
const colorMap: {[key: string]: string} = {
  // Primeira linha: tons de preto, cinza, vermelho, rosa, roxo, azul escuro
  '#222222': 'Preto',
  '#606060': 'Cinza',
  '#e74c3c': 'Vermelho',
  '#e84393': 'Rosa',
  '#a55eea': 'Roxo',
  '#5f27cd': 'Roxo Escuro',
  // Segunda linha: azul, azul claro, verde água, verde escuro, verde médio, verde claro
  '#3867d6': 'Azul',
  '#48dbfb': 'Azul Claro',
  '#1dd1a1': 'Verde Água',
  '#10ac84': 'Verde Escuro',
  '#7bed9f': 'Verde Médio',
  '#badc58': 'Verde Claro',
  // Terceira linha: amarelo, laranja, marrom, salmão, coral, pêssego
  '#f9ca24': 'Amarelo',
  '#ff9f43': 'Laranja',
  '#d35400': 'Marrom',
  '#ff6b6b': 'Salmão',
  '#ff9ff3': 'Coral',
  '#feca57': 'Pêssego'
};

// Lista de códigos de cores para uso em loops
const colorOptions = Object.keys(colorMap);

// Ícone padrão para categorias
const DEFAULT_ICON = '📊';

interface NewCategoryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  editingCategory: Category | null;
  categoryType: 'income' | 'expense' | 'investment';
}

export default function NewCategoryModal({
  isOpen,
  setIsOpen,
  onSave,
  editingCategory,
  categoryType
}: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIconCategory, setSelectedIconCategory] = useState(iconCategories[0].id);
  const { impact } = useTapticFeedback();

  // Referências para os seletores
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSelectedColor(editingCategory.color);
      setSelectedIcon(editingCategory.icon || iconCategories[0].icons[0]);
    } else {
      // Valores padrão para nova categoria com base no tipo
      setName('');
      setSelectedColor(colorOptions[0]);
      
      // Seleciona automaticamente o ícone apropriado com base no tipo de categoria
      if (categoryType === 'income') {
        setSelectedIcon('trending-up');
      } else if (categoryType === 'expense') {
        setSelectedIcon('trending-down');
      } else {
        setSelectedIcon('dollar-sign');
      }
    }
    // Fechar os pickers quando o modal for aberto/fechado
    setShowColorPicker(false);
    setShowIconPicker(false);
  }, [editingCategory, isOpen]);

  // Adicionar tratamento para click fora do seletor de cores
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Adicionar tratamento para click fora do seletor de ícones
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) {
        setShowIconPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    impact();
    
    if (!name.trim()) return;

    const newCategory: Omit<Category, 'id'> = {
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon, // Usar o ícone selecionado
      type: categoryType
    };

    onSave(newCategory);
    setIsOpen(false);
  };

  const toggleColorPicker = () => {
    impact();
    setShowColorPicker(!showColorPicker);
    setShowIconPicker(false); // Fechar o outro picker se estiver aberto
  };

  const toggleIconPicker = () => {
    impact();
    setShowIconPicker(!showIconPicker);
    setShowColorPicker(false); // Fechar o outro picker se estiver aberto
  };

  const selectColor = (color: string) => {
    impact();
    setSelectedColor(color);
    // Fechar automaticamente o popover após selecionar uma cor
    setShowColorPicker(false);
  };
  
  const selectIcon = (icon: string) => {
    impact();
    setSelectedIcon(icon);
    // Fechar automaticamente o popover após selecionar um ícone
    setShowIconPicker(false);
  };
  
  const selectIconCategory = (categoryId: string) => {
    impact();
    setSelectedIconCategory(categoryId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Alimentação, Transporte, Salário..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor
              </label>
              
              <div className="relative mt-2" ref={colorPickerRef}>
                {/* Botão para mostrar o seletor de cor */}
                <div 
                  onClick={toggleColorPicker}
                  className="flex items-center border rounded-md p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${selectedColor}15` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {colorMap[selectedColor] || 'Cor Personalizada'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showColorPicker ? 'transform rotate-180' : ''}`} />
                </div>
                
                {/* Modal flutuante (separado) com a grade de cores */}
                {showColorPicker && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Overlay transparente para capturar cliques fora do modal */}
                    <div 
                      className="absolute inset-0 bg-transparent" 
                      onClick={() => setShowColorPicker(false)}
                    ></div>
                    
                    {/* Modal de cores flutuante */}
                    <div 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-5 max-w-md w-[320px] z-10"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Selecionar cor</h3>
                        <button 
                          type="button" 
                          onClick={() => setShowColorPicker(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-4">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => selectColor(color)}
                            className="flex items-center justify-center hover:scale-105 transition-transform"
                            aria-label={`Cor ${colorMap[color]}`}
                            title={colorMap[color]}
                          >
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedColor === color 
                                ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-800' 
                                : ''
                              }`}
                              style={{ 
                                backgroundColor: `${color}15` // Fundo com opacidade ainda menor (15%)
                              }}
                            >
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color }}
                              />
                              {selectedColor === color && (
                                <div className="absolute">
                                  <Check className="w-4 h-4 text-white stroke-[3]" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ícone
              </label>
              
              <div className="relative mt-2" ref={iconPickerRef}>
                {/* Botão para mostrar o seletor de ícone */}
                <div 
                  onClick={toggleIconPicker}
                  className="flex items-center border rounded-md p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${selectedColor}15` }}
                  >
                    {React.createElement(getIcon(selectedIcon), { className: "h-5 w-5", style: { color: selectedColor } })}
                  </div>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {editingCategory ? selectedIcon : 'Selecionar Ícone'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showIconPicker ? 'transform rotate-180' : ''}`} />
                </div>
                
                {/* Modal flutuante (separado) com a grade de ícones */}
                {showIconPicker && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Overlay transparente para capturar cliques fora do modal */}
                    <div 
                      className="absolute inset-0 bg-transparent" 
                      onClick={() => setShowIconPicker(false)}
                    ></div>
                    
                    {/* Modal de ícones flutuante */}
                    <div 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-5 max-w-lg w-[90%] z-10 max-h-[80vh] overflow-y-auto"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Selecionar ícone</h3>
                        <button 
                          type="button" 
                          onClick={() => setShowIconPicker(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Navegação por categorias de ícones */}
                      <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                        {iconCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => selectIconCategory(category.id)}
                            className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
                              selectedIconCategory === category.id 
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Grade de ícones para a categoria selecionada */}
                      <div className="grid grid-cols-6 gap-4 mt-4">
                        {iconCategories.find(c => c.id === selectedIconCategory)?.icons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => selectIcon(icon)}
                            className="flex items-center justify-center hover:scale-105 transition-transform"
                            aria-label={`Ícone ${icon}`}
                            title={icon}
                          >
                            <div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedIcon === icon 
                                ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-800' 
                                : ''
                              }`}
                              style={{ 
                                backgroundColor: `${selectedColor}15`
                              }}
                            >
                              {React.createElement(getIcon(icon), { className: "h-6 w-6", style: { color: selectedColor } })}

                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md border border-gray-300 dark:border-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}