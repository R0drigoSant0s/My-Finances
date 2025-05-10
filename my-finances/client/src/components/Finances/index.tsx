import React, { useState, useRef, useEffect } from 'react';
import {
  Wallet,
  Settings,
  PlusCircle,
  Plus,
  Receipt,
  PiggyBank,
  History
} from 'lucide-react';
import MonthSelector from './MonthSelector';
import FinancialCard from './FinancialCard';
import BudgetsSection from './BudgetsSection';
import CalendarSection from './CalendarSection';
import TransactionsSection from './TransactionsSection';
import NewTransactionModal from './NewTransactionModal';
import NewBudgetModal from './NewBudgetModal';
import TransactionsModal from './TransactionsModal';
import SettingsModal from './SettingsModal';
import { EditingTransaction, MonthData, Transaction, Budget } from './types';

export default function Finances() {
  // Month-specific data storage
  const [monthlyData, setMonthlyData] = useState<Record<string, MonthData>>({});
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'investment'>('income');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempInitialBalance, setTempInitialBalance] = useState('');
  const [budgetName, setBudgetName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | undefined>(undefined);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<EditingTransaction>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  const monthSelectorRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get current month key (YYYY-MM format)
  const getCurrentMonthKey = () => {
    return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  };

  // Get or initialize month data
  const getMonthData = () => {
    const monthKey = getCurrentMonthKey();
    if (!monthlyData[monthKey]) {
      return {
        transactions: [],
        budgets: [],
        initialBalance: 0
      };
    }
    return monthlyData[monthKey];
  };

  // Update month data
  const updateMonthData = (data: Partial<MonthData>) => {
    const monthKey = getCurrentMonthKey();
    setMonthlyData(prev => ({
      ...prev,
      [monthKey]: {
        ...getMonthData(),
        ...data
      }
    }));
  };

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
      setTempInitialBalance(getMonthData().initialBalance.toString());
    }
  }, [isEditingBalance]);

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
  }, [selectedDate, daysInMonth]);

  // Apply dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: editingTransaction?.id || Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      date: formatDate(selectedDay),
      budgetId: type === 'expense' ? selectedBudgetId : undefined,
    };

    const currentData = getMonthData();
    let updatedTransactions: Transaction[];

    if (editingTransaction) {
      updatedTransactions = currentData.transactions.map(t => 
        t.id === editingTransaction.id ? newTransaction : t
      );
    } else {
      updatedTransactions = [...currentData.transactions, newTransaction];
    }

    updateMonthData({ transactions: updatedTransactions });
    setEditingTransaction(null);
    setDescription('');
    setAmount('');
    setSelectedDay(new Date().getDate());
    setSelectedBudgetId(undefined);
    setType('income');
    setIsNewTransactionModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    const transactionDate = new Date(transaction.date);
    setSelectedDay(transactionDate.getDate());
    setSelectedBudgetId(transaction.budgetId);
    setIsTransactionsModalOpen(false);
    setIsNewTransactionModalOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    const currentData = getMonthData();
    updateMonthData({
      transactions: currentData.transactions.filter(t => t.id !== id)
    });
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetName || !budgetLimit) return;

    const currentData = getMonthData();
    
    // Check if we're editing an existing budget
    if (editingBudget) {
      const updatedBudgets = currentData.budgets.map(budget => 
        budget.id === editingBudget.id 
          ? { ...budget, name: budgetName, limit: parseFloat(budgetLimit) } 
          : budget
      );
      
      updateMonthData({ budgets: updatedBudgets });
      setEditingBudget(null);
    } else {
      // Create a new budget
      const newBudget: Budget = {
        id: Date.now(),
        name: budgetName,
        limit: parseFloat(budgetLimit),
      };
      
      updateMonthData({
        budgets: [...currentData.budgets, newBudget]
      });
    }
    
    setBudgetName('');
    setBudgetLimit('');
    setIsNewBudgetModalOpen(false);
  };
  
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetName(budget.name);
    setBudgetLimit(budget.limit.toString());
    setIsNewBudgetModalOpen(true);
  };
  
  const handleDeleteBudget = (id: number) => {
    const currentData = getMonthData();
    updateMonthData({
      budgets: currentData.budgets.filter(budget => budget.id !== id)
    });
  };

  const handleInitialBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMonthData({
      initialBalance: parseFloat(tempInitialBalance) || 0
    });
    setIsEditingBalance(false);
  };

  const currentMonthData = getMonthData();
  const { transactions, budgets, initialBalance } = currentMonthData;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded-xl">
                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Minhas Finanças</h1>
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Histórico de transações"
                onClick={() => setIsTransactionsModalOpen(true)}
              >
                <History className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Configurações"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <MonthSelector 
            months={months}
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
          />

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

          {/* Budget and Transactions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budgets Section */}
            <div className="lg:col-span-1">
              <BudgetsSection 
                budgets={budgets}
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
            
            {/* Transactions Section */}
            <div className="lg:col-span-2">
              <TransactionsSection 
                transactions={transactions}
                sortedTransactions={sortedTransactions}
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
        </div>
      </main>

      {/* Modals */}
      {isNewTransactionModalOpen && (
        <NewTransactionModal 
          isOpen={isNewTransactionModalOpen}
          setIsOpen={setIsNewTransactionModalOpen}
          type={type}
          setType={setType}
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          selectedBudgetId={selectedBudgetId}
          setSelectedBudgetId={setSelectedBudgetId}
          budgets={budgets}
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
          firstDayWeekday={firstDayWeekday}
          daysInMonth={daysInMonth}
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
          handleBudgetSubmit={handleBudgetSubmit}
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
      <div className="fixed bottom-6 right-6">
        <div className="relative">
          {isActionMenuOpen && (
            <div 
              ref={actionMenuRef}
              className="absolute bottom-12 right-0 flex flex-col items-end space-y-2 mb-2"
            >
              <button
                onClick={() => {
                  setIsNewTransactionModalOpen(true);
                  setIsActionMenuOpen(false);
                }}
                className="flex items-center bg-white dark:bg-gray-800 py-2 px-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-800 dark:text-white text-sm mr-1">Nova Transação</span>
                <Receipt className="h-4 w-4 text-blue-500" />
              </button>
              
              <button
                onClick={() => {
                  setIsNewBudgetModalOpen(true);
                  setIsActionMenuOpen(false);
                }}
                className="flex items-center bg-white dark:bg-gray-800 py-2 px-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-800 dark:text-white text-sm mr-1">Novo Orçamento</span>
                <PiggyBank className="h-4 w-4 text-green-500" />
              </button>
            </div>
          )}
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            aria-label="Adicionar novo"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
