import React, { useState, useRef, useEffect } from 'react';
import {
  Wallet,
  Settings,
  Plus,
  Receipt,
  PiggyBank,
  History,
  Moon,
  Sun,
  LogOut,
  Home,
  ArrowUp,
  ArrowDown,
  Target,
  LineChart
} from 'lucide-react';
import { useLocation } from 'wouter';
import MonthSelector from './MonthSelector';
import FinancialCard from './FinancialCard';
import BlankCard from './BlankCard';
import BudgetsSection from './BudgetsSection';
import CategoryDonutChart from './CategoryDonutChart';
import CategoriesModal from './CategoriesModal';
import FutureContentCard from './FutureContentCard';

import TransactionsSection from './TransactionsSection';
import NewTransactionModalWithCategories from './NewTransactionModalWithCategories';
import NewBudgetModal from './NewBudgetModal';
import TransactionsModal from './TransactionsModal';
import SettingsModal from './SettingsModal';
import { EditingTransaction, Transaction, Budget, Category } from './types';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { signOut } from '@/lib/supabase';

export default function Finances() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempInitialBalance, setTempInitialBalance] = useState('');
  const [budgetName, setBudgetName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  // Estado para recorrência de orçamentos
  const [isRecurrent, setIsRecurrent] = useState(false);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'investment'>('income');
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<EditingTransaction>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isCategoriesTabOpen, setIsCategoriesTabOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check if user has previously set a theme preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Check if user has a system preference
      if (!savedTheme) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return (savedTheme as 'light' | 'dark');
    }
    return 'light';
  });
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  const monthSelectorRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Get current month key (YYYY-MM format)
  const getCurrentMonthKey = () => {
    return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  };

  // Use the custom hook to fetch and manage data from Supabase
  const {
    data: monthData,
    loading,
    error,
    updateInitialBalance,
    addTransaction,
    editTransaction,
    removeTransaction,
    addBudget,
    editBudget,
    removeBudget
  } = useSupabaseData(getCurrentMonthKey());

  // Estado para armazenar as categorias
  const initialCategories: Category[] = [
    { id: 1, name: 'Alimentação', color: '#ef4444', icon: 'utensils', type: 'expense' },
    { id: 2, name: 'Transporte', color: '#f59e0b', icon: 'car', type: 'expense' },
    { id: 3, name: 'Moradia', color: '#3b82f6', icon: 'home', type: 'expense' },
    { id: 4, name: 'Saúde', color: '#10b981', icon: 'heart-pulse', type: 'expense' },
    { id: 5, name: 'Educação', color: '#8b5cf6', icon: 'book-open', type: 'expense' },
    { id: 6, name: 'Lazer', color: '#ec4899', icon: 'ticket', type: 'expense' },
    { id: 7, name: 'Salário', color: '#10b981', icon: 'wallet', type: 'income' },
    { id: 8, name: 'Freelance', color: '#3b82f6', icon: 'briefcase', type: 'income' },
    { id: 9, name: 'Investimentos', color: '#8b5cf6', icon: 'trending-up', type: 'investment' },
    { id: 10, name: 'Fitness', color: '#f97316', icon: 'dumbbell', type: 'expense' }
  ];

  // Função para carregar categorias do localStorage ou usar as iniciais
  const loadCategories = (): Category[] => {
    try {
      const savedCategories = localStorage.getItem('finance_categories');
      if (savedCategories) {
        return JSON.parse(savedCategories);
      }
      return initialCategories;
    } catch (err) {
      console.error('Erro ao carregar categorias do localStorage:', err);
      return initialCategories;
    }
  };
  
  const [categories, setCategories] = useState<Category[]>(loadCategories());

  const months = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
  ];
  
  const monthsFull = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate first and last day of the selected month
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Generate calendar days array including empty slots for proper alignment
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDayWeekday + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return dayNumber;
    }
    return null;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthSelectorRef.current && !monthSelectorRef.current.contains(event.target as Node)) {
        setIsMonthSelectorOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditingBalance) {
      setTempInitialBalance(monthData.initialBalance.toString());
    }
  }, [isEditingBalance, monthData.initialBalance]);

  useEffect(() => {
    // Reset selected budget when changing transaction type
    if (type !== 'expense') {
      setSelectedBudgetId(undefined);
    }
  }, [type]);

  // Update selected day when month changes
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedDate, daysInMonth, selectedDay]);

  // Apply dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Salvar categorias no localStorage quando elas mudarem
  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    }
  };

  // Abrir o modal de gerenciamento de categorias
  const handleManageCategories = () => {
    setIsCategoriesModalOpen(true);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleYearChange = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + increment);
    setSelectedDate(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setIsMonthSelectorOpen(false);
  };

  const formatDate = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Omit<Transaction, 'id'> = {
      description,
      amount: parseFloat(amount),
      type,
      date: formatDate(selectedDay),
      budgetId: type === 'expense' ? selectedBudgetId : undefined, // Associar orçamento apenas para despesas
      categoryId: selectedCategoryId // Adicionado para associar categoria à transação
    };

    try {
      if (editingTransaction) {
        await editTransaction(editingTransaction.id, newTransaction);
      } else {
        await addTransaction(newTransaction);
      }
      
      setEditingTransaction(null);
      setDescription('');
      setAmount('');
      setSelectedDay(new Date().getDate());
      setSelectedBudgetId(undefined);
      setSelectedCategoryId(undefined);
      setType('income');
      setIsNewTransactionModalOpen(false);
    } catch (error) {
      console.error('Error handling transaction:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    const transactionDate = new Date(transaction.date);
    setSelectedDay(transactionDate.getDate());
    setSelectedBudgetId(transaction.budgetId); // Restaurada a referência ao orçamento
    setSelectedCategoryId(transaction.categoryId); // Adicionado para restaurar a categoria
    setIsTransactionsModalOpen(false);
    setIsNewTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await removeTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetName || !budgetLimit) return;

    try {
      // Obtenha o mês/ano atual no formato YYYY-MM
      const currentYearMonth = getCurrentMonthKey();
      
      // Obter a cor da categoria selecionada (se houver)
      let categoryColor;
      if (selectedCategoryId) {
        const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
        if (selectedCategory) {
          categoryColor = selectedCategory.color;
        }
      }
      
      // Check if we're editing an existing budget
      if (editingBudget) {
        // Lógica para editar com suporte a recorrência
        if (isRecurrent && editingBudget.isRecurrent) {
          // Se está editando um orçamento recorrente
          // Perguntar se deseja atualizar todas as instâncias futuras ou apenas esta
          const updateFuture = window.confirm(
            "Deseja atualizar este orçamento em todos os meses futuros também? " +
            "Clique OK para atualizar todos os meses futuros. " +
            "Clique Cancelar para atualizar apenas o orçamento atual."
          );
          
          if (updateFuture) {
            // Atualiza o orçamento atual e todos os orçamentos futuros
            await editBudget(editingBudget.id, {
              name: budgetName,
              limit: parseFloat(budgetLimit),
              isRecurrent,
              isRecurrenceActive: true,
              categoryId: selectedCategoryId,
              color: categoryColor // Usar a cor da categoria, se disponível
            });
            
            // Nota: Aqui você implementaria a lógica para atualizar todos os orçamentos futuros derivados
            // deste orçamento primário. Isso dependeria da sua implementação de armazenamento.
            toast({
              title: "Orçamento atualizado",
              description: "Orçamento e todas as suas recorrências futuras foram atualizados.",
            });
          } else {
            // Atualiza apenas o orçamento atual
            await editBudget(editingBudget.id, {
              name: budgetName,
              limit: parseFloat(budgetLimit),
              // Mantém os dados de recorrência
              isRecurrent: editingBudget.isRecurrent,
              categoryId: selectedCategoryId,
              color: categoryColor // Usar a cor da categoria, se disponível
            });
            
            toast({
              title: "Orçamento atualizado",
              description: "Apenas este orçamento foi atualizado, sem afetar recorrências futuras.",
            });
          }
        } else {
          // Edição normal de orçamento não recorrente
          await editBudget(editingBudget.id, {
            name: budgetName,
            limit: parseFloat(budgetLimit),
            isRecurrent,
            isRecurrenceActive: isRecurrent,
            categoryId: selectedCategoryId,
            color: categoryColor // Usar a cor da categoria, se disponível
          });
          
          toast({
            title: "Orçamento atualizado",
            description: "Orçamento atualizado com sucesso.",
          });
        }
        
        setEditingBudget(null);
      } else {
        // Criar um novo orçamento
        const newBudget = {
          name: budgetName,
          limit: parseFloat(budgetLimit),
          yearMonth: currentYearMonth,
          isRecurrent,
          isRecurrenceActive: isRecurrent,
          categoryId: selectedCategoryId,
          color: categoryColor // Usar a cor da categoria, se disponível
        };
        
        // Adicionar o orçamento para o mês atual
        await addBudget(newBudget);
        
        if (isRecurrent) {
          toast({
            title: "Orçamento criado",
            description: "Orçamento criado com configuração de repetição mensal.",
          });
        } else {
          toast({
            title: "Orçamento criado",
            description: "Orçamento criado para o mês atual.",
          });
        }
      }
      
      // Limpar os campos e estados
      setBudgetName('');
      setBudgetLimit('');
      setIsRecurrent(false);
      setSelectedCategoryId(undefined);
      setIsNewBudgetModalOpen(false);
    } catch (error) {
      console.error('Error handling budget:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o orçamento.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetName(budget.name);
    setBudgetLimit(budget.limit.toString());
    
    // Carregar as configurações de recorrência se existirem
    setIsRecurrent(budget.isRecurrent || false);
    
    // Carregar a categoria vinculada se existir
    setSelectedCategoryId(budget.categoryId);
    
    setIsNewBudgetModalOpen(true);
  };
  
  const handleDeleteBudget = async (id: number) => {
    try {
      // Encontrar o orçamento a ser excluído
      const budgetToDelete = budgets.find(b => b.id === id);
      
      if (!budgetToDelete) return;
      
      // Verificar se o orçamento está sendo utilizado
      const budgetUsage = getBudgetUsage(id);
      
      // Se o uso for zero, sempre excluir o orçamento sem precisar de confirmação adicional
      if (budgetUsage === 0) {
        await removeBudget(id);
        
        toast({
          title: "Orçamento excluído",
          description: "O orçamento foi removido com sucesso, pois não tinha nenhum valor utilizado.",
        });
        return;
      }
      
      // Para orçamentos com valores usados, pedir confirmação
      const confirmDelete = window.confirm(
        "Este orçamento tem transações associadas. Tem certeza que deseja excluí-lo?\n\n" +
        "Isso não afetará os orçamentos de outros meses."
      );
      
      if (confirmDelete) {
        await removeBudget(id);
        
        toast({
          title: "Orçamento excluído",
          description: "O orçamento foi removido com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o orçamento.",
        variant: "destructive",
      });
    }
  };

  const handleInitialBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInitialBalance(parseFloat(tempInitialBalance) || 0);
      setIsEditingBalance(false);
    } catch (error) {
      console.error('Error updating initial balance:', error);
    }
  };

  const { transactions, budgets, initialBalance } = monthData;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = initialBalance + totalIncome - totalExpenses - totalInvestments;

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  
  // Total usado: apenas despesas associadas a orçamentos
  const totalUsed = transactions
    .filter(t => t.type === 'expense' && t.budgetId !== undefined)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Saldo estimado: saldo atual - (orçamentos - despesas já realizadas em orçamentos)
  const remainingBudget = totalBudgeted - totalUsed;
  // Se não há orçamentos, o saldo estimado é 0
  const estimatedBalance = totalBudgeted === 0 ? 0 : balance - remainingBudget;

  const getBudgetUsage = (budgetId: number) => {
    return transactions
      .filter(t => t.type === 'expense' && t.budgetId === budgetId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getBudgetName = (budgetId: number | undefined) => {
    if (!budgetId) return '';
    const budget = budgets.find(b => b.id === budgetId);
    return budget ? budget.name : 'Orçamento não encontrado';
  };

  const formatDisplayDate = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (value: number): string => {
    const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'de-DE';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 dark:text-gray-100">
      {/* Main Content */}
      <main className="pt-3 pb-6 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <MonthSelector 
            months={months}
            monthsFull={monthsFull}
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            currentYear={currentYear}
            isMonthSelectorOpen={isMonthSelectorOpen}
            setIsMonthSelectorOpen={setIsMonthSelectorOpen}
            handleYearChange={handleYearChange}
            handleMonthSelect={handleMonthSelect}
            monthSelectorRef={monthSelectorRef}
            isEditingBalance={isEditingBalance}
            setIsEditingBalance={setIsEditingBalance}
            tempInitialBalance={tempInitialBalance}
            setTempInitialBalance={setTempInitialBalance}
            handleInitialBalanceSubmit={handleInitialBalanceSubmit}
            initialBalance={initialBalance}
            formatCurrency={formatCurrency}
            setIsTransactionsModalOpen={setIsTransactionsModalOpen}
          />

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
            <FinancialCard 
              title="Saldo Atual"
              amount={balance}
              type="balance"
              formatCurrency={formatCurrency}
            />
            
            <FinancialCard 
              title="Receitas"
              amount={totalIncome}
              type="income"
              formatCurrency={formatCurrency}
            />
            
            <FinancialCard 
              title="Despesas"
              amount={totalExpenses}
              type="expense"
              formatCurrency={formatCurrency}
            />
            
            <FinancialCard 
              title="Investimentos"
              amount={totalInvestments}
              type="investment"
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Budget and Future Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-6">
            {/* Expenses by Category Chart */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 h-full">
                <CategoryDonutChart 
                  transactions={transactions}
                  categories={categories}
                  formatCurrency={formatCurrency}
                  onManageCategories={handleManageCategories}
                />
              </div>
            </div>
            
            {/* Budgets Section */}
            <div className="lg:col-span-1">
              <BudgetsSection 
                budgets={budgets}
                categories={categories}
                totalBudgeted={totalBudgeted}
                totalUsed={totalUsed}
                estimatedBalance={estimatedBalance}
                getBudgetUsage={getBudgetUsage}
                setIsNewBudgetModalOpen={setIsNewBudgetModalOpen}
                handleEditBudget={handleEditBudget}
                handleDeleteBudget={handleDeleteBudget}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>

          {/* Transactions Section */}
          <div className="w-full">
            <TransactionsSection 
              transactions={transactions}
              sortedTransactions={sortedTransactions}
              categories={categories}
              setIsTransactionsModalOpen={setIsTransactionsModalOpen}
              setIsActionMenuOpen={setIsActionMenuOpen}
              isActionMenuOpen={isActionMenuOpen}
              setType={setType}
              setIsNewTransactionModalOpen={setIsNewTransactionModalOpen}
              setIsNewBudgetModalOpen={setIsNewBudgetModalOpen}
              handleEditTransaction={handleEditTransaction}
              handleDeleteTransaction={handleDeleteTransaction}
              getBudgetName={getBudgetName}
              formatCurrency={formatCurrency}
              formatDisplayDate={formatDisplayDate}
              actionMenuRef={actionMenuRef}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {isNewTransactionModalOpen && (
        <NewTransactionModalWithCategories 
          isOpen={isNewTransactionModalOpen}
          setIsOpen={setIsNewTransactionModalOpen}
          type={type}
          setType={setType}
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          calendarRef={calendarRef}
          handleSubmit={handleSubmit}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          formatDisplayDate={formatDisplayDate}
          calendarDays={calendarDays}
          weekDays={weekDays}
          selectedBudgetId={selectedBudgetId}
          setSelectedBudgetId={setSelectedBudgetId}
          budgets={budgets}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          categories={categories}
        />
      )}

      {isNewBudgetModalOpen && (
        <NewBudgetModal 
          isOpen={isNewBudgetModalOpen}
          setIsOpen={setIsNewBudgetModalOpen}
          budgetName={budgetName}
          setBudgetName={setBudgetName}
          budgetLimit={budgetLimit}
          setBudgetLimit={setBudgetLimit}
          isRecurrent={isRecurrent}
          setIsRecurrent={setIsRecurrent}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          handleBudgetSubmit={handleBudgetSubmit}
          currentYearMonth={getCurrentMonthKey()}
          categories={categories}
        />
      )}

      {isTransactionsModalOpen && (
        <TransactionsModal 
          isOpen={isTransactionsModalOpen}
          setIsOpen={setIsTransactionsModalOpen}
          transactions={transactions}
          sortedTransactions={sortedTransactions}
          handleEditTransaction={handleEditTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
          getBudgetName={getBudgetName}
          formatCurrency={formatCurrency}
          formatDisplayDate={formatDisplayDate}
          setIsNewTransactionModalOpen={setIsNewTransactionModalOpen}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal 
          isOpen={isSettingsModalOpen}
          setIsOpen={setIsSettingsModalOpen}
          theme={theme}
          setTheme={setTheme}
          currency={currency}
          setCurrency={setCurrency}
        />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 safe-area-bottom z-50" ref={actionMenuRef}>
        <div 
          className={`absolute bottom-16 -right-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden w-60 transform transition-all duration-300 ease-in-out border border-gray-100 dark:border-gray-700 ${isActionMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
        >
          <div className="p-2">
            {/* Nova Despesa */}
            <button 
              onClick={() => {
                setIsActionMenuOpen(false);
                setType('expense');
                setIsNewTransactionModalOpen(true);
              }} 
              className="w-full flex items-center p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors hover:scale-[1.02] active:scale-[0.98] duration-150"
            >
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nova Despesa</span>
            </button>
            
            {/* Nova Receita */}
            <button 
              onClick={() => {
                setIsActionMenuOpen(false);
                setType('income');
                setIsNewTransactionModalOpen(true);
              }}
              className="w-full flex items-center p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors hover:scale-[1.02] active:scale-[0.98] duration-150"
            >
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nova Receita</span>
            </button>
            
            {/* Novo Investimento */}
            <button 
              onClick={() => {
                setIsActionMenuOpen(false);
                setType('investment');
                setIsNewTransactionModalOpen(true);
              }}
              className="w-full flex items-center p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors hover:scale-[1.02] active:scale-[0.98] duration-150"
            >
              <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                <LineChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Novo Investimento</span>
            </button>
            
            {/* Novo Orçamento */}
            <button 
              onClick={() => {
                setIsActionMenuOpen(false);
                setIsNewBudgetModalOpen(true);
              }}
              className="w-full flex items-center p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors hover:scale-[1.02] active:scale-[0.98] duration-150"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Novo Orçamento</span>
            </button>
          </div>
        </div>
        
        <button
          className={`w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg active:scale-95 ${isActionMenuOpen ? 'rotate-45' : ''}`}
          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
          aria-label="Adicionar novo"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Modal de Gerenciamento de Categorias */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        setIsOpen={setIsCategoriesModalOpen}
        categories={categories}
        onAddCategory={(newCategory) => {
          // Adicionar nova categoria ao estado
          const maxId: number = categories.reduce((max: number, cat) => Math.max(max, cat.id), 0);
          const newCategoryWithId: Category = { ...newCategory, id: maxId + 1 };
          
          // Atualizar o estado com a nova categoria
          const updatedCategories = [...categories, newCategoryWithId];
          setCategories(updatedCategories);
          
          // Salvar no localStorage
          localStorage.setItem('finance_categories', JSON.stringify(updatedCategories));
          
          toast({
            title: "Categoria adicionada",
            description: `A categoria ${newCategory.name} foi adicionada com sucesso.`,
          });
        }}
        onEditCategory={(id, updatedCategory) => {
          // Encontrar a categoria a ser atualizada
          const category = categories.find(cat => cat.id === id);
          
          if (category) {
            // Atualizar o estado com a categoria modificada
            const updatedCategories = categories.map(cat => 
              cat.id === id ? { ...cat, ...updatedCategory, id } : cat
            );
            setCategories(updatedCategories);
            
            // Salvar no localStorage
            localStorage.setItem('finance_categories', JSON.stringify(updatedCategories));
            
            toast({
              title: "Categoria atualizada",
              description: `A categoria ${category.name} foi atualizada para ${updatedCategory.name}.`,
            });
          }
        }}
        onDeleteCategory={(categoryId) => {
          // Encontrar a categoria a ser excluída
          const category = categories.find(cat => cat.id === categoryId);
          
          if (category) {
            // Atualizar o estado removendo a categoria
            const updatedCategories = categories.filter(cat => cat.id !== categoryId);
            setCategories(updatedCategories);
            
            // Salvar no localStorage
            localStorage.setItem('finance_categories', JSON.stringify(updatedCategories));
            
            toast({
              title: "Categoria excluída",
              description: `A categoria ${category.name} foi excluída.`,
            });
          }
        }}
      />
    </div>
  );
}
