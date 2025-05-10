// Script para adicionar coluna category_id à tabela budgets
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são necessárias');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para aplicar a migração
async function applyMigration() {
  console.log('Verificando se a coluna category_id existe na tabela budgets...');
  
  try {
    // Verificar se a coluna category_id existe tentando consultar
    const { error: categoryIdCheckError } = await supabase
      .from('budgets')
      .select('category_id')
      .limit(1);
      
    // Se o erro incluir "column category_id does not exist", precisamos adicioná-la
    if (categoryIdCheckError && categoryIdCheckError.message.includes('column "category_id" does not exist')) {
      console.log('Coluna category_id não existe. Adicionando...');
      
      // Usando RPC para executar SQL (se a configuração do Supabase permitir)
      const { error } = await supabase.rpc('execute_sql', {
        sql: `
          DO $$ 
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'budgets' 
              AND column_name = 'category_id'
            ) THEN
              ALTER TABLE budgets 
              ADD COLUMN category_id INTEGER;
            END IF;
          END $$;
        `
      });
      
      if (error) {
        console.error('Erro ao adicionar coluna category_id:', error.message);
        console.log('Alternativa: Adicione a coluna manualmente no Console do Supabase SQL Editor');
        console.log('Execute: ALTER TABLE budgets ADD COLUMN category_id INTEGER;');
      } else {
        console.log('Coluna category_id adicionada com sucesso!');
      }
    } else {
      console.log('A coluna category_id já existe na tabela budgets.');
    }
    
    // Verificar a estrutura da tabela após a migração
    const { data: sample, error: sampleError } = await supabase
      .from('budgets')
      .select('*')
      .limit(1);
      
    if (sampleError) {
      console.error('Erro ao verificar a tabela budgets:', sampleError.message);
    } else {
      console.log('Estrutura da tabela budgets:', Object.keys(sample[0] || {}));
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Executar a migração
applyMigration();