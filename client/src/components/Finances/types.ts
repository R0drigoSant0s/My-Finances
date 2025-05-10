export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'investment';
  date: string;
  budgetId?: number;
  categoryId?: number;
};

export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string; // Nome do ícone do Lucide
  type: 'income' | 'expense' | 'investment';
};

export type Budget = {
  id: number;
  name: string;
  limit: number;
  color?: string;
  spent?: number;
  isRecurrent?: boolean;
  isRecurrenceActive?: boolean;
  categoryId?: number;
};

export type EditingTransaction = Transaction | null;

export type MonthData = {
  transactions: Transaction[];
  budgets: Budget[];
  initialBalance: number;
};

export type TransactionFilters = {
  type?: 'income' | 'expense' | 'investment' | 'all';
  budgetId?: number;
  dateRange?: [Date | null, Date | null];
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
};

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

export type FormattingOptions = {
  currency: 'BRL' | 'USD' | 'EUR';
  locale: 'pt-BR' | 'en-US' | 'en-GB';
  dateFormat: 'short' | 'long' | 'numeric';
};