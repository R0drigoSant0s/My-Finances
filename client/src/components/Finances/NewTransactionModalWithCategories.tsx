import { useRef, RefObject, useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LineChart,
  Tag
} from 'lucide-react';

// Define interfaces para orçamentos e categorias
interface Budget {
  id: number;
  name: string;
  limit: number;
}

interface Category {
  id: number;
  name: string;
  color: string;
  type: 'income' | 'expense' | 'investment';
}

interface NewTransactionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: 'income' | 'expense' | 'investment';
  setType: (type: 'income' | 'expense' | 'investment') => void;
  description: string;
  setDescription: (description: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  calendarRef: RefObject<HTMLDivElement>;
  handleSubmit: (e: React.FormEvent) => void;
  editingTransaction: any | null;
  setEditingTransaction: (transaction: any | null) => void;
  formatDisplayDate: (day: number) => string;
  calendarDays: (number | null)[];
  weekDays: string[];
  // Adicionado para selecionar orçamento
  selectedBudgetId?: number;
  setSelectedBudgetId?: (id: number | undefined) => void;
  budgets?: Budget[];
  // Adicionado para selecionar categoria
  selectedCategoryId?: number;
  setSelectedCategoryId?: (id: number | undefined) => void;
  categories?: Category[];
}

export default function NewTransactionModal({
  isOpen,
  setIsOpen,
  type,
  setType,
  description,
  setDescription,
  amount,
  setAmount,
  selectedDay,
  setSelectedDay,
  isCalendarOpen,
  setIsCalendarOpen,
  calendarRef,
  handleSubmit,
  editingTransaction,
  setEditingTransaction,
  formatDisplayDate,
  calendarDays,
  weekDays,
  selectedBudgetId,
  setSelectedBudgetId,
  budgets,
  selectedCategoryId,
  setSelectedCategoryId,
  categories
}: NewTransactionModalProps) {
  const [isBudgetDropdownOpen, setIsBudgetDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const budgetDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Fechar dropdown de orçamento ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(event.target as Node)) {
        setIsBudgetDropdownOpen(false);
      }
    }

    if (isBudgetDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBudgetDropdownOpen]);
  
  // Fechar dropdown de categoria ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);
  
  // Filtrar categorias pelo tipo selecionado
  const filteredCategories = categories?.filter(category => category.type === type) || [];
  
  // Fechar dropdowns ao trocar o tipo de transação
  useEffect(() => {
    setIsBudgetDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [type]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => {
              setIsOpen(false);
              setEditingTransaction(null);
            }}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    type === 'income' 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setType('income')}
                >
                  <ArrowUpCircle className={`h-5 w-5 mb-0.5 ${
                    type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  Receita
                </button>
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    type === 'expense' 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setType('expense')}
                >
                  <ArrowDownCircle className={`h-5 w-5 mb-0.5 ${
                    type === 'expense' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  Despesa
                </button>
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    type === 'investment' 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setType('investment')}
                >
                  <LineChart className={`h-5 w-5 mb-0.5 ${
                    type === 'investment' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  Invest.
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Salário, Supermercado, etc."
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">R$</span>
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    // Permitir apenas números, vírgula e ponto
                    const value = e.target.value.replace(/[^0-9,.]/g, '');
                    setAmount(value);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full flex justify-between items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{formatDisplayDate(selectedDay)}</span>
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {isCalendarOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-black/30" 
                    onClick={() => setIsCalendarOpen(false)}
                  ></div>
                  <div
                    ref={calendarRef}
                    className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-[280px]"
                  >
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">Selecionar Data</h3>
                        <button 
                          type="button" 
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsCalendarOpen(false)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                          <div
                            key={day}
                            className="h-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium"
                          >
                            {day[0]}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-0.5 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                        {calendarDays.map((day, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (day) {
                                setSelectedDay(day);
                                setIsCalendarOpen(false);
                              }
                            }}
                            disabled={day === null}
                            className={`h-7 w-7 rounded-md flex items-center justify-center text-xs ${
                              day === selectedDay
                                ? 'bg-blue-500 text-white font-medium'
                                : day !== null
                                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                : 'text-gray-300 dark:text-gray-700 cursor-default'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Seleção de Categoria */}
            {setSelectedCategoryId && categories && categories.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center">
                    {selectedCategoryId !== undefined ? (
                      <>
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: categories.find(c => c.id === selectedCategoryId)?.color || '#374151' }}
                        />
                        <span>
                          {categories.find(c => c.id === selectedCategoryId)?.name || 'Selecionar categoria'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>Selecionar categoria</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                
                {/* Modal/Dialog para seleção de categoria */}
                {isCategoryDropdownOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-4 max-h-[80vh]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Selecionar Categoria</h3>
                        <button 
                          type="button" 
                          onClick={() => setIsCategoryDropdownOpen(false)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 overflow-y-auto max-h-[60vh] pb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategoryId(undefined);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                            selectedCategoryId === undefined
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            Sem categoria
                          </span>
                          {selectedCategoryId === undefined && (
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          )}
                        </button>
                        
                        {filteredCategories.length === 0 ? (
                          <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                            Não há categorias disponíveis para este tipo de transação.
                          </div>
                        ) : (
                          filteredCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                setSelectedCategoryId(category.id);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                                selectedCategoryId === category.id
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </span>
                              {selectedCategoryId === category.id && (
                                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Seleção de Orçamento (apenas para despesas) */}
            {type === 'expense' && budgets && budgets.length > 0 && setSelectedBudgetId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Orçamento
                </label>
                <button
                  type="button"
                  onClick={() => setIsBudgetDropdownOpen(!isBudgetDropdownOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>
                    {selectedBudgetId === undefined 
                      ? 'Selecionar orçamento' 
                      : budgets.find(b => b.id === selectedBudgetId)?.name || 'Orçamento não encontrado'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                
                {/* Modal/Dialog para seleção de orçamento */}
                {isBudgetDropdownOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-4 max-h-[80vh]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Selecionar Orçamento</h3>
                        <button 
                          type="button" 
                          onClick={() => setIsBudgetDropdownOpen(false)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 overflow-y-auto max-h-[60vh] pb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBudgetId(undefined);
                            setIsBudgetDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                            selectedBudgetId === undefined
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>Sem orçamento</span>
                          {selectedBudgetId === undefined && (
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          )}
                        </button>
                        
                        {budgets.map((budget) => (
                          <button
                            key={budget.id}
                            type="button"
                            onClick={() => {
                              setSelectedBudgetId(budget.id);
                              setIsBudgetDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                              selectedBudgetId === budget.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <span>{budget.name}</span>
                            {selectedBudgetId === budget.id && (
                              <CheckCircle2 className="h-4 w-4 text-blue-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setEditingTransaction(null);
                }}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!description || !amount}
              >
                {editingTransaction ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}