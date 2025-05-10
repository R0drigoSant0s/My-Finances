/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `description` (text)
      - `amount` (numeric)
      - `type` (text, enum: 'income', 'expense', 'investment')
      - `date` (date)
      - `budget_id` (uuid, nullable)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to manage their own transactions
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'investment')),
  date DATE NOT NULL,
  budget_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on user_id and date for faster queries
CREATE INDEX IF NOT EXISTS transactions_user_id_date_idx ON transactions(user_id, date);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own transactions
CREATE POLICY "Users can view their own transactions" 
  ON transactions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to insert their own transactions
CREATE POLICY "Users can insert their own transactions" 
  ON transactions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own transactions
CREATE POLICY "Users can update their own transactions" 
  ON transactions 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to delete their own transactions
CREATE POLICY "Users can delete their own transactions" 
  ON transactions 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on update
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at();