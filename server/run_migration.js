// Script para verificar e aplicar a migração da coluna category_id
import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndApplyMigration() {
  console.log('Verificando estrutura da tabela transactions...');
  
  try {
    // Verificar se a coluna category_id existe na tabela transactions
    const { data: columns, error: columnsError } = await supabase
      .from('transactions')
      .select('category_id')
      .limit(1);
    
    if (columnsError) {
      // Se o erro for relacionado à coluna não existir, aplique a migração
      if (columnsError.message.includes('column "category_id" does not exist')) {
        console.log('Coluna category_id não existe. Aplicando migração...');
        await applyMigration();
      } else {
        console.error('Erro ao verificar a coluna:', columnsError.message);
      }
    } else {
      console.log('A coluna category_id já existe na tabela transactions.');
      
      // Verificar uma transação específica para debugging
      const { data: sampleTransaction, error: sampleError } = await supabase
        .from('transactions')
        .select('*')
        .limit(1);
        
      if (sampleError) {
        console.error('Erro ao obter transação de exemplo:', sampleError.message);
      } else {
        console.log('Exemplo de transação:', sampleTransaction);
      }
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

async function applyMigration() {
  try {
    // Usar SQL bruto para adicionar a coluna se ela não existir
    const { error } = await supabase.rpc('execute_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'transactions' 
            AND column_name = 'category_id'
          ) THEN
            ALTER TABLE transactions 
            ADD COLUMN category_id INTEGER;
          END IF;
        END $$;
      `
    });
    
    if (error) {
      console.error('Erro ao aplicar migração:', error.message);
    } else {
      console.log('Migração aplicada com sucesso! Coluna category_id adicionada.');
    }
  } catch (error) {
    console.error('Erro ao tentar aplicar migração:', error.message);
  }
}

// Executar a verificação e migração
checkAndApplyMigration();