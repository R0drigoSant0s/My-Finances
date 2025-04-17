import React, { useState, useRef, useEffect } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  PieChart, 
  Settings, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  X, 
  DollarSign, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  LineChart,
  AlertCircle,
  Calculator,
  BarChart,
  Calendar,
  History,
  Trash2,
  Plus,
  Receipt,
  Target
} from 'lucide-react';

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'investment';
  date: string;
  budgetId?: number;
};

type Budget = {
  id: number;
  name: string;
  limit: number;
};

type MonthData = {
  transactions: Transaction[];
  budgets: Budget[];
  initialBalance: number;
};

type EditingTransaction = Transaction | null;

function App() {
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
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
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

    const newBudget: Budget = {
      id: Date.now(),
      name: budgetName,
      limit: parseFloat(budgetLimit),
    };

    const currentData = getMonthData();
    updateMonthData({
      budgets: [...currentData.budgets, newBudget]
    });
    setBudgetName('');
    setBudgetLimit('');
    setIsNewBudgetModalOpen(false);
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
  const totalUsed = totalExpenses;
  const estimatedBalance = totalBudgeted === 0 ? balance : balance - totalBudgeted;

  const getBudgetUsage = (budgetId: number) => {
    return transactions
      .filter(t => t.type === 'expense' && t.budgetId === budgetId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getBudgetName = (budgetId: number) => {
    const budget = budgets.find(b => b.id === budgetId);
    return budget ? budget.name : 'Orçamento não encontrado';
  };

  const formatDisplayDate = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Minhas Finanças</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsTransactionsModalOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <History className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Date and Initial Balance Section */}
        <div className="flex items-center gap-6 mb-4">
          {/* Date Selector */}
          <div className="relative" ref={monthSelectorRef}>
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="px-3 py-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-base font-medium text-gray-900"
            >
              {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </button>

            {/* Month Selector Dropdown */}
            {isMonthSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg z-10 min-w-[200px]">
                <div className="p-2 border-b flex items-center justify-between">
                  <button
                    onClick={() => handleYearChange(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-medium">{selectedDate.getFullYear()}</span>
                  <button
                    onClick={() => handleYearChange(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        index === selectedDate.getMonth() ? 'text-blue-600 bg-blue-50' : ''
                      } ${index === currentMonth && selectedDate.getFullYear() === currentYear ? 'font-bold' : ''}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Initial Balance */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingBalance(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <span className="font-medium text-gray-900">Saldo inicial:</span>
            <span className="text-base font-medium text-gray-900">
              R$ {initialBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Initial Balance Modal */}
        {isEditingBalance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Atualizar Saldo Inicial</h3>
                <button
                  onClick={() => setIsEditingBalance(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleInitialBalanceSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={tempInitialBalance}
                    onChange={(e) => setTempInitialBalance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingBalance(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Modal */}
        {isTransactionsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Histórico de transações em {months[selectedDate.getMonth()]}
                </h3>
                <button
                  onClick={() => setIsTransactionsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {sortedTransactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhuma transação registrada
                  </p>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                          {transaction.budgetId && (
                            <span className="ml-2 text-sm text-indigo-600">
                              ({getBudgetName(transaction.budgetId)})
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-medium ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : transaction.type === 'expense'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {transaction.type === 'expense' ? '-' : '+'} R${' '}
                          {transaction.amount.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="p-1 text-gray-600 hover:text-blue-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-1 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Balance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-[#0a0d0e]" />
              <p className="text-sm text-[#0a0d0e]">Saldo Atual</p>
            </div>
            <h2 className="text-lg font-bold text-[#0a0d0e]">
              R$ {balance.toFixed(2)}
            </h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600">Receitas</p>
            </div>
            <h2 className="text-lg font-bold text-green-600">
              R$ {totalIncome.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">Despesas</p>
            </div>
            <h2 className="text-lg font-bold text-red-600">
              R$ {totalExpenses.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <LineChart className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-600">Investimentos</p>
            </div>
            <h2 className="text-lg font-bold text-blue-600">
              R$ {totalInvestments.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Budget Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-indigo-600">Orçamentos</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart className="h-4 w-4 text-indigo-600" />
                <p className="text-sm text-indigo-600">Total Orçado</p>
              </div>
              <h2 className="text-lg font-bold text-indigo-600">
                R$ {totalBudgeted.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">Total Utilizado</p>
              </div>
              <h2 className="text-lg font-bold text-red-600">
                R$ {totalUsed.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calculator className="h-4 w-4 text-[#0a0d0e]" />
                <p className="text-sm text-[#0a0d0e]">Saldo Estimado</p>
              </div>
              <h2 className="text-lg font-bold text-[#0a0d0e]">
                R$ {estimatedBalance.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Budget List */}
          {budgets.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="text-base font-semibold mb-4">Orçamentos Ativos</h3>
              <div className="space-y-4">
                {budgets.map(budget => {
                  const used = getBudgetUsage(budget.id);
                  const remaining = budget.limit - used;
                  const percentage = (used / budget.limit) * 100;
                  const percentageColor = percentage >= 100 ? 'text-red-500' : 
                                        percentage >= 75 ? 'text-yellow-500' : 
                                        'text-green-500';
                  
                  return (
                    <div key={budget.id} className="p-4 border border-gray-100 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{budget.name}</h4>
                        <span className={`text-sm font-medium ${percentageColor}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full rounded-full ${
                            percentage >= 100 ? 'bg-red-500' : 
                            percentage >= 75 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Restante: R$ {remaining.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          R$ {used.toFixed(2)} / R$ {budget.limit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* New Transaction Modal */}
        {isNewTransactionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                </h3>
                <button
                  onClick={() => {
                    setIsNewTransactionModalOpen(false);
                    setEditingTransaction(null);
                    setDescription('');
                    setAmount('');
                    setType('income');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Salário"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dia
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                    >
                      <span>{formatDisplayDate(selectedDay)}</span>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </button>
                    
                    {isCalendarOpen && (
                      <div 
                        ref={calendarRef}
                        className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 border border-gray-200 w-64"
                      >
                        <div className="p-2">
                          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-t-lg">
                            {weekDays.map(day => (
                              <div key={day} className="text-center py-1 px-1 text-xs font-medium">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-px">
                            {calendarDays.map((day, index) => (
                              <button
                                key={index}
                                type="button"
                                disabled={day === null}
                                onClick={() => {
                                  if (day !== null) {
                                    setSelectedDay(day);
                                    setIsCalendarOpen(false);
                                  }
                                }}
                                className={`
                                  text-center py-1.5 text-sm
                                  ${day === null ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                                  ${day === selectedDay ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                                `}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {type === 'expense' && budgets.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orçamento
                    </label>
                    <select
                      value={selectedBudgetId || ''}
                      onChange={(e) => setSelectedBudgetId(Number(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um orçamento</option>
                      {budgets.map(budget => (
                        <option key={budget.id} value={budget.id}>
                          {budget.name} (Restante: R$ {(budget.limit - getBudgetUsage(budget.id)).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                      type === 'income'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Receita</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                      type === 'expense'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <MinusCircle className="h-5 w-5" />
                    <span>Despesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('investment')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                      type === 'investment'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Investimento</span>
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTransaction ? 'Salvar Alterações' : 'Adicionar Transação'}
                </button>
                {editingTransaction && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTransaction(null);
                      setDescription('');
                      setAmount('');
                      setType('income');
                      setSelectedDay(new Date().getDate());
                      setSelectedBudgetId(undefined);
                      setIsNewTransactionModalOpen(false);
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar Edição
                  </button>
                )}
              </form>
            </div>
          </div>
        )}

        {/* New Budget Modal */}
        {isNewBudgetModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Novo Orçamento</h3>
                <button
                  onClick={() => {
                    setIsNewBudgetModalOpen(false);
                    setBudgetName('');
                    setBudgetLimit('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Orçamento
                  </label>
                  <input
                    type="text"
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Alimentação"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Limite (R$)
                  </label>
                  <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Adicionar Orçamento
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <div className="relative" ref={actionMenuRef}>
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-6 w-6" />
            </button>

            {isActionMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 min-w-[200px] bg-white rounded-lg shadow-lg py-2">
                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsNewTransactionModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                >
                  <Receipt className="h-5 w-5 text-blue-600" />
                  <span>Nova Transação</span>
                </button>
                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsNewBudgetModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                >
                  <Target className="h-5 w-5 text-indigo-600" />
                  <span>Novo Orçamento</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;