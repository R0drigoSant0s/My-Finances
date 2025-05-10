/*
  # Add foreign key constraint to budget_id

  1. Changes
    - Add foreign key constraint to transactions.budget_id referencing budgets.id
    - Set ON DELETE SET NULL to handle budget deletion gracefully
  
  2. Implementation Notes
    - Uses a DO block to check if the budgets table exists before adding the constraint
    - This ensures the migration is safe to run even if the budgets table doesn't exist yet
*/

-- Add foreign key constraint to budget_id
DO $$ 
BEGIN
  -- Check if both tables exist before adding the constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'budgets'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'transactions'
  ) THEN
    -- Check if the constraint doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'transactions_budget_id_fkey' 
      AND table_schema = 'public'
    ) THEN
      ALTER TABLE transactions 
      ADD CONSTRAINT transactions_budget_id_fkey 
      FOREIGN KEY (budget_id) 
      REFERENCES budgets(id) 
      ON DELETE SET NULL;
    END IF;
  END IF;
END $$;