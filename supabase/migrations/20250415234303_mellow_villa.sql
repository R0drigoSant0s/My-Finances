/*
  # Create budgets table

  1. New Tables
    - `budgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text)
      - `limit` (numeric, renamed to "budget_limit" to avoid SQL keyword conflict)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `budgets` table
    - Add policies for authenticated users to manage their own budgets
*/

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_limit NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS budgets_user_id_idx ON budgets(user_id);

-- Enable Row Level Security
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own budgets
CREATE POLICY "Users can view their own budgets" 
  ON budgets 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to insert their own budgets
CREATE POLICY "Users can insert their own budgets" 
  ON budgets 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own budgets
CREATE POLICY "Users can update their own budgets" 
  ON budgets 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to delete their own budgets
CREATE POLICY "Users can delete their own budgets" 
  ON budgets 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on update
CREATE OR REPLACE FUNCTION update_budgets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON budgets
FOR EACH ROW
EXECUTE FUNCTION update_budgets_updated_at();