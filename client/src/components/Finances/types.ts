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
  
  // Propriedades de recorrência
  yearMonth?: string; // formato YYYY-MM para rastrear o mês específico
  isRecurrent?: boolean;
  isRecurrenceActive?: boolean; // para controlar se a recorrência continua ativa
};

export type MonthData = {
  transactions: Transaction[];
  budgets: Budget[];
  initialBalance: number;
};

export type EditingTransaction = Transaction | null;
