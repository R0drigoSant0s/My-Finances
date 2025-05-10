import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Plus, Edit2, Trash2, Info, AlertCircle, Tag as TagIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/UI/card';
import { Button } from '../components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/UI/dialog';
import { Input } from '../components/UI/input';
import { Label } from '../components/UI/label';
import { Badge } from '../components/UI/badge';
import { Progress } from '../components/UI/progress';
import { useTapticFeedback } from '../hooks/useTapticFeedback';
import { Transaction, Budget } from '../components/Finances/types';

interface CategoryManagementPageProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  onEditBudget: (id: number, budget: Omit<Budget, 'id'>) => Promise<void>;
  onDeleteBudget: (id: number) => Promise<void>;
  formatCurrency: (value: number) => string;
}

export default function CategoryManagementPage({
  budgets,
  transactions,
  onAddBudget,
  onEditBudget,
  onDeleteBudget,
  formatCurrency
}: CategoryManagementPageProps) {
  const [, setLocation] = useLocation();
  const { impact } = useTapticFeedback();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  
  // Calcular quanto do orçamento já foi usado
  const getBudgetUsage = (budgetId: number) => {
    const budgetTransactions = transactions.filter(
      t => t.type === 'expense' && t.budgetId === budgetId
    );
    
    return budgetTransactions.reduce((total, t) => total + t.amount, 0);
  };
  
  // Verificar se uma categoria está sendo usada em alguma transação
  const isBudgetInUse = (budgetId: number) => {
    return transactions.some(t => t.budgetId === budgetId);
  };
  
  // Cores predefinidas para categorias
  const predefinedColors = [
    '#3b82f6', // Azul
    '#ef4444', // Vermelho
    '#f59e0b', // Laranja
    '#10b981', // Verde
    '#8b5cf6', // Roxo
    '#ec4899', // Rosa
    '#6b7280', // Cinza
    '#0ea5e9', // Azul céu
    '#14b8a6', // Verde azulado
    '#f43f5e', // Vermelho rosa
  ];
  
  const handleAddCategory = async () => {
    try {
      if (!newCategoryName.trim() || !newCategoryLimit) {
        return;
      }
      
      const newBudget: Omit<Budget, 'id'> = {
        name: newCategoryName.trim(),
        limit: parseFloat(newCategoryLimit),
        color: newCategoryColor
      };
      
      await onAddBudget(newBudget);
      setNewCategoryName('');
      setNewCategoryLimit('');
      setNewCategoryColor('#3b82f6');
      setIsAddModalOpen(false);
      impact();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  };
  
  const handleEditCategory = async () => {
    try {
      if (!selectedBudget || !newCategoryName.trim() || !newCategoryLimit) {
        return;
      }
      
      const updatedBudget: Omit<Budget, 'id'> = {
        name: newCategoryName.trim(),
        limit: parseFloat(newCategoryLimit),
        color: newCategoryColor
      };
      
      await onEditBudget(selectedBudget.id, updatedBudget);
      setIsEditModalOpen(false);
      impact();
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
    }
  };
  
  const handleDeleteCategory = async () => {
    try {
      if (!selectedBudget) {
        return;
      }
      
      await onDeleteBudget(selectedBudget.id);
      setIsDeleteModalOpen(false);
      impact();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };
  
  const openEditModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setNewCategoryName(budget.name);
    setNewCategoryLimit(budget.limit.toString());
    setNewCategoryColor(budget.color || '#3b82f6');
    setIsEditModalOpen(true);
    impact();
  };
  
  const openDeleteModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsDeleteModalOpen(true);
    impact();
  };
  
  const handleGoBack = () => {
    setLocation('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 touch-area-expanded"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciar Categorias</h1>
        </div>
        
        <Button 
          onClick={() => {
            setIsAddModalOpen(true);
            impact();
          }}
          size="sm"
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova Categoria
        </Button>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Crie e gerencie categorias para organizar melhor suas despesas.
      </p>
      
      {/* Lista de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.length === 0 ? (
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma categoria</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Adicione categorias para organizar melhor suas despesas e controlar seu orçamento.
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Categoria
            </Button>
          </div>
        ) : (
          budgets.map((budget) => {
            const used = getBudgetUsage(budget.id);
            const percentage = budget.limit > 0 ? Math.min(100, (used / budget.limit) * 100) : 0;
            
            return (
              <Card 
                key={budget.id} 
                className="border-t-4 relative overflow-hidden transition-all hover:shadow-md"
                style={{ borderTopColor: budget.color || '#3b82f6' }}
              >
                {/* Fundo com gradiente sutil */}
                <div 
                  className="absolute inset-0 opacity-5 z-0" 
                  style={{ 
                    background: `linear-gradient(135deg, ${budget.color || '#3b82f6'} 0%, transparent 80%)` 
                  }}
                />
                
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: `${budget.color || '#3b82f6'}20` }}>
                        <div className="w-5 h-5 flex items-center justify-center" style={{ color: budget.color || '#3b82f6' }}>
                          <TagIcon className="w-4 h-4" />
                        </div>
                      </div>
                      <CardTitle className="text-lg font-medium">{budget.name}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(budget)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-area-expanded"
                        aria-label="Editar categoria"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(budget)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 touch-area-expanded"
                        aria-label="Excluir categoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <CardDescription>
                    Limite: {formatCurrency(budget.limit)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Utilizado: {formatCurrency(used)}</span>
                    <span className={`font-medium ${percentage > 90 ? 'text-red-500' : percentage > 70 ? 'text-amber-500' : 'text-green-500'}`}>
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${percentage < 70 ? 'bg-green-500' : percentage < 90 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {isBudgetInUse(budget.id) && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Info className="w-3 h-3 mr-1" />
                      Esta categoria está sendo usada em transações
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      
      {/* Modal para adicionar categoria */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>
              Crie uma nova categoria para organizar suas despesas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da categoria</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Alimentação"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">Limite mensal</Label>
              <Input
                id="limit"
                type="number"
                value={newCategoryLimit}
                onChange={(e) => setNewCategoryLimit(e.target.value)}
                placeholder="Ex: 500"
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategoryColor === color ? 'border-black dark:border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Cor ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCategory}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para editar categoria */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Modifique os detalhes desta categoria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome da categoria</Label>
              <Input
                id="edit-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Alimentação"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-limit">Limite mensal</Label>
              <Input
                id="edit-limit"
                type="number"
                value={newCategoryLimit}
                onChange={(e) => setNewCategoryLimit(e.target.value)}
                placeholder="Ex: 500"
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategoryColor === color ? 'border-black dark:border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Cor ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCategory}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação para excluir categoria */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Categoria</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta categoria?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedBudget && isBudgetInUse(selectedBudget.id) && (
              <div className="flex items-start bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md p-3 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 dark:text-amber-200 font-medium">Atenção</p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Esta categoria está sendo usada em algumas transações. 
                    Ao excluí-la, essas transações ficarão sem categoria.
                  </p>
                </div>
              </div>
            )}
            
            <p className="text-gray-700 dark:text-gray-300">
              {selectedBudget?.name && (
                <>
                  Você está prestes a excluir a categoria <Badge variant="outline">{selectedBudget.name}</Badge>.
                  Esta ação não pode ser desfeita.
                </>
              )}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}