/*
  # Create month_settings table

  1. New Tables
    - `month_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `year_month` (text, format: 'YYYY-MM')
      - `initial_balance` (numeric)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `month_settings` table
    - Add policies for authenticated users to manage their own month settings
*/

-- Create month_settings table
CREATE TABLE IF NOT EXISTS month_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year_month TEXT NOT NULL,
  initial_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, year_month)
);

-- Create index on user_id and year_month for faster queries
CREATE INDEX IF NOT EXISTS month_settings_user_id_year_month_idx ON month_settings(user_id, year_month);

-- Enable Row Level Security
ALTER TABLE month_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own month settings
CREATE POLICY "Users can view their own month settings" 
  ON month_settings 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to insert their own month settings
CREATE POLICY "Users can insert their own month settings" 
  ON month_settings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own month settings
CREATE POLICY "Users can update their own month settings" 
  ON month_settings 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to delete their own month settings
CREATE POLICY "Users can delete their own month settings" 
  ON month_settings 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on update
CREATE OR REPLACE FUNCTION update_month_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_month_settings_updated_at
BEFORE UPDATE ON month_settings
FOR EACH ROW
EXECUTE FUNCTION update_month_settings_updated_at();