import React from 'react';
import MonthSelector from './MonthSelector';
import FinancialCardCarousel from './FinancialCardCarousel';
import MobileTransactionList from './MobileTransactionList';
import FloatingActionButton from '@/components/Layout/FloatingActionButton';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import { Transaction, Budget } from './types';

interface MobileFinancesProps {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  selectedDate: Date;
  currentMonth: number;
  currentYear: number;
  isMonthSelectorOpen: boolean;
  setIsMonthSelectorOpen: (isOpen: boolean) => void;
  handleYearChange: (increment: number) => void;
  handleMonthSelect: (month: number) => void;
  monthSelectorRef: React.RefObject<HTMLDivElement>;
  isEditingBalance: boolean;
  setIsEditingBalance: (isEditing: boolean) => void;
  tempInitialBalance: string;
  setTempInitialBalance: (balance: string) => void;
  handleInitialBalanceSubmit: (e: React.FormEvent) => void;
  initialBalance: number;
  formatCurrency: (value: number) => string;
  months: string[];
  monthsFull?: string[];
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  transactions: Transaction[];
  budgets: Budget[];
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (id: number) => void;
  getBudgetName: (budgetId: number | undefined) => string;
  setIsNewTransactionModalOpen: (isOpen: boolean) => void;
  setIsNewBudgetModalOpen: (isOpen: boolean) => void;
  setIsTransactionsModalOpen: (isOpen: boolean) => void;
}

export default function MobileFinances({
  selectedDay,
  setSelectedDay,
  selectedDate,
  currentMonth,
  currentYear,
  isMonthSelectorOpen,
  setIsMonthSelectorOpen,
  handleYearChange,
  handleMonthSelect,
  monthSelectorRef,
  isEditingBalance,
  setIsEditingBalance,
  tempInitialBalance,
  setTempInitialBalance,
  handleInitialBalanceSubmit,
  initialBalance,
  formatCurrency,
  months,
  monthsFull,
  balance,
  totalIncome,
  totalExpenses,
  totalInvestments,
  transactions,
  budgets,
  handleEditTransaction,
  handleDeleteTransaction,
  getBudgetName,
  setIsNewTransactionModalOpen,
  setIsNewBudgetModalOpen,
  setIsTransactionsModalOpen
}: MobileFinancesProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Seletor de Mês */}
      <div className="bg-white dark:bg-gray-900 p-4 sticky top-0 z-20 shadow-sm border-b border-gray-200 dark:border-gray-800">
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
      </div>
      
      {/* Cards Financeiros em carrossel */}
      <div className="px-4 pt-4">
        <FinancialCardCarousel 
          balance={balance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          totalInvestments={totalInvestments}
          formatCurrency={formatCurrency}
        />
      </div>
      
      {/* Lista de Transações Móvel */}
      <div className="px-4 flex-1">
        <MobileTransactionList 
          transactions={transactions}
          handleEditTransaction={handleEditTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
          formatCurrency={formatCurrency}
          getBudgetName={getBudgetName}
        />
      </div>
      
      {/* Botão de Ação Flutuante */}
      <FloatingActionButton 
        openTransactionModal={() => setIsNewTransactionModalOpen(true)}
        openBudgetModal={() => setIsNewBudgetModalOpen(true)}
      />
      
      {/* Navegação Inferior */}
      <BottomNavigation 
        setIsNewTransactionModalOpen={setIsNewTransactionModalOpen}
      />
    </div>
  );
}