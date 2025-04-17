# My Finances - Project Summary

## Overview
My Finances is a personal finance management application built with React, TypeScript, and Tailwind CSS. It allows users to track their income, expenses, and investments, manage budgets, and view financial summaries by month. The application uses Supabase for authentication and data storage.

## Key Features
- User authentication (login/register)
- Track income, expenses, and investments
- Manage monthly budgets with progress tracking
- View financial summaries with cards for balance, income, expenses, and investments
- Monthly data selection with calendar interface
- Dark mode support
- Multiple currency format options (BRL, USD, EUR)
- PWA support for mobile installation

## Project Structure

### Main Components
- `Finances/index.tsx` - Main container component that orchestrates the entire application
- `FinancialCard.tsx` - Cards displaying financial summaries (balance, income, expenses, investments)
- `BudgetsSection.tsx` - Section for managing and displaying budgets
- `TransactionsSection.tsx` - Section for displaying recent transactions
- `MonthSelector.tsx` - Component for selecting month and year
- `NewTransactionModal.tsx` - Modal for adding/editing transactions
- `NewBudgetModal.tsx` - Modal for adding/editing budgets
- `SettingsModal.tsx` - Modal for app settings (theme, currency)
- `TransactionsModal.tsx` - Modal for viewing all transactions
- `AuthGuard.tsx` - Component for protecting routes that require authentication

### Authentication
- `AuthContext.tsx` - Context for managing authentication state
- `auth.tsx` - Login and registration page
- `supabase.ts` - Supabase client and authentication functions

### Data Structure
- `Transaction` - Represents financial transactions with properties:
  - `id`: Unique identifier
  - `description`: Description of the transaction
  - `amount`: Monetary value
  - `type`: 'income', 'expense', or 'investment'
  - `date`: Date of the transaction
  - `budgetId`: Optional reference to a budget (for expenses)

- `Budget` - Represents spending budgets with properties:
  - `id`: Unique identifier
  - `name`: Budget name
  - `limit`: Maximum amount allocated

- `MonthData` - Stores data for each month:
  - `transactions`: Array of transactions
  - `budgets`: Array of budgets
  - `initialBalance`: Starting balance for the month

### Database Schema
The application uses Supabase with the following tables:
- `profiles` - User profiles linked to auth.users
- `month_settings` - Monthly settings including initial balance
- `transactions` - Financial transactions
- `budgets` - Budget definitions

### State Management
- Uses React's useState and useEffect hooks for local state
- Uses React Context for global state (authentication)
- Uses custom hooks for data fetching and management
- Implements React Query for API data fetching and caching

### UI Features
- Responsive design that works on mobile and desktop
- Dark mode toggle
- Currency format selection (BRL, USD, EUR)
- Interactive calendar for date selection
- Progress bars for budget tracking
- Floating action button for adding transactions and budgets
- Toast notifications for user feedback

### PWA Support
The application includes Progressive Web App features:
- Can be installed on mobile devices
- Full-screen support for iPhones
- Custom icons for home screen
- Manifest and service worker configuration

## Implementation Details

### Data Persistence
- Uses Supabase for data storage and retrieval
- Implements Row Level Security (RLS) for data protection
- Each user can only access their own data

### Theming
- Supports light and dark modes
- Theme is applied using CSS classes and Tailwind's dark mode
- Theme preference is stored in localStorage

### Formatting
- Currency formatting based on locale (BRL, USD, EUR)
- Date formatting for display

### Authentication
- Email and password authentication with Supabase
- Protected routes with AuthGuard component
- User session management

## Future Enhancements
- Data export/import
- Financial reports and analytics
- Recurring transactions
- Financial goals tracking
- Budget categories and tags
- Multi-device synchronization
- Offline support