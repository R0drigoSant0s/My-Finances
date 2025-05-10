import { pgTable, text, serial, integer, boolean, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tabela de transações financeiras
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(), // 'income', 'expense', 'investment'
  date: text("date").notNull(),
  budgetId: text("budget_id"),
  yearMonth: text("year_month").notNull(), // formato: YYYY-MM
});

export const insertTransactionSchema = createInsertSchema(transactions);
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Tabela de orçamentos/categorias
export const budgets = pgTable("budgets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  limit: real("limit").notNull(),
  yearMonth: text("year_month").notNull(),
  isRecurrent: boolean("is_recurrent").default(false),
  isRecurrenceActive: boolean("is_recurrence_active").default(false),
});

export const insertBudgetSchema = createInsertSchema(budgets);
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;