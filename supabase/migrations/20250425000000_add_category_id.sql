/*
  # Add category_id column to transactions table

  1. Changes
    - Add category_id column to transactions table
    - This column will be used to associate transactions with categories
*/

-- Add category_id column to transactions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN category_id UUID;
  END IF;
END $$;