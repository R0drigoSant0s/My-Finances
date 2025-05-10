export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'investment';
  date: string;
  budgetId?: number;
};

export type Budget = {
  id: number;
  name: string;
  limit: number;
};

export type MonthData = {
  transactions: Transaction[];
  budgets: Budget[];
  initialBalance: number;
};

export type EditingTransaction = Transaction | null;
