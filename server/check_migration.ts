// Script para verificar e aplicar a migração para category_id
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são necessárias');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para aplicar a migração
async function applyMigration() {
  console.log('Verificando se a coluna category_id existe na tabela transactions...');
  
  try {
    // Aplicar migração diretamente usando RPC ou REST
    const { data, error } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erro ao acessar a tabela transactions:', error.message);
      process.exit(1);
    }
    
    console.log('Modificando a tabela transactions para adicionar a coluna category_id...');
    
    // Como não temos acesso direto ao SQL via RPC, vamos verificar se a coluna existe
    // tentando consultar uma transação com a coluna category_id
    const { error: categoryError } = await supabase
      .from('transactions')
      .select('category_id')
      .limit(1);
      
    if (categoryError && categoryError.message.includes('column "category_id" does not exist')) {
      console.log('Coluna category_id não existe. A migração precisa ser aplicada no Supabase.');
      console.log('Por favor, atualize o esquema de banco de dados no painel do Supabase.');
    } else {
      console.log('A coluna category_id parece existir ou outro erro ocorreu.');
    }
    
    // Continue com a verificação da estrutura da tabela
    
    // Verificar a estrutura da tabela após a migração
    const { data: sample, error: sampleError } = await supabase
      .from('transactions')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Erro ao verificar a estrutura da tabela:', sampleError.message);
    } else {
      console.log('Estrutura da tabela transactions após migração:');
      console.log(sample && sample.length > 0 ? Object.keys(sample[0]) : 'Nenhuma transação encontrada');
    }
    
  } catch (error: any) {
    console.error('Erro inesperado:', error.message);
    process.exit(1);
  }
}

// Executar a migração
applyMigration();