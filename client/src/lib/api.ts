import { supabase } from './supabase';
import { MonthData, Transaction, Budget } from '@/components/Finances/types';

// Profiles
export const getProfile = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();
    
  if (error) throw error;
  return data;
};

// Month Settings
export const getMonthSettings = async (yearMonth: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  const { data, error } = await supabase
    .from('month_settings')
    .select('*')
    .eq('user_id', user.user.id)
    .eq('year_month', yearMonth)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned"
  
  return data || { initial_balance: 0 };
};

export const saveMonthSettings = async (yearMonth: string, initialBalance: number) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // Check if settings already exist
  const { data: existingSettings } = await supabase
    .from('month_settings')
    .select('id')
    .eq('user_id', user.user.id)
    .eq('year_month', yearMonth)
    .single();
    
  if (existingSettings) {
    // Update existing settings
    const { data, error } = await supabase
      .from('month_settings')
      .update({ initial_balance: initialBalance })
      .eq('id', existingSettings.id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Insert new settings
    const { data, error } = await supabase
      .from('month_settings')
      .insert([{ 
        user_id: user.user.id, 
        year_month: yearMonth, 
        initial_balance: initialBalance 
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};

// Transactions
export const getTransactions = async (yearMonth: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // Extract year and month from yearMonth (format: YYYY-MM)
  const [year, month] = yearMonth.split('-');
  
  // Calculate start and end dates for the month
  const startDate = `${year}-${month}-01`;
  const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]; // Last day of month
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return data || [];
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // A coluna category_id ainda não existe na tabela transactions
  // Vamos incluir apenas os campos que existem e adicionar o category_id na resposta
  const transactionData = { 
    user_id: user.user.id,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    date: transaction.date,
    budget_id: transaction.budgetId
  };
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single();
    
  if (error) throw error;
  
  // Adicionamos o categoryId na resposta para manter consistência no frontend
  return { ...data, category_id: transaction.categoryId };
};

export const updateTransaction = async (id: number, transaction: Omit<Transaction, 'id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // A coluna category_id ainda não existe na tabela
  // Vamos incluir apenas os campos que existem e adicionar o category_id na resposta
  const updateData = { 
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    date: transaction.date,
    budget_id: transaction.budgetId
  };
  
  const { data, error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select()
    .single();
    
  if (error) throw error;
  
  // Adicionamos o categoryId na resposta para manter consistência no frontend
  return { ...data, category_id: transaction.categoryId };
};

export const deleteTransaction = async (id: number) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id);
    
  if (error) throw error;
  return true;
};

// Função para criar a tabela de metadados dos orçamentos
export const createBudgetMetadataTable = async () => {
  try {
    const { error } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS budget_metadata (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now(),
          UNIQUE(budget_id, key)
        );
        
        -- Enable RLS
        ALTER TABLE budget_metadata ENABLE ROW LEVEL SECURITY;
        
        -- Create index
        CREATE INDEX IF NOT EXISTS budget_metadata_budget_id_idx ON budget_metadata(budget_id);
        
        -- Add policies
        CREATE POLICY "Users can view their own budget metadata" 
          ON budget_metadata 
          FOR SELECT 
          TO authenticated 
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can insert their own budget metadata" 
          ON budget_metadata 
          FOR INSERT 
          TO authenticated 
          WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY "Users can update their own budget metadata" 
          ON budget_metadata 
          FOR UPDATE 
          TO authenticated 
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can delete their own budget metadata" 
          ON budget_metadata 
          FOR DELETE 
          TO authenticated 
          USING (auth.uid() = user_id);
      `
    });
    
    if (error) {
      console.error('Erro ao criar tabela budget_metadata:', error);
    }
  } catch (error) {
    console.error('Erro ao executar SQL para criar tabela budget_metadata:', error);
  }
};

// Metadados para orçamentos (como relações com categorias)
export const saveBudgetMetadata = async (budgetId: number | string, key: string, value: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // Verificar se o registro já existe
  const { data: existingData, error: existingError } = await supabase
    .from('budget_metadata')
    .select('*')
    .eq('budget_id', budgetId)
    .eq('key', key)
    .maybeSingle();
    
  if (existingError && existingError.code !== 'PGRST116') {
    // Se for um erro diferente de "não encontrado"
    throw existingError;
  }
  
  // Se já existir um registro, atualize-o
  if (existingData) {
    const { error } = await supabase
      .from('budget_metadata')
      .update({ value })
      .eq('id', existingData.id);
      
    if (error) throw error;
    return;
  }
  
  // Criar um novo registro
  const { error } = await supabase
    .from('budget_metadata')
    .insert([{
      budget_id: budgetId,
      user_id: user.user.id,
      key,
      value
    }]);
    
  if (error) {
    // Se a tabela não existir, vamos criá-la
    if (error.code === 'PGRST204' || error.message.includes('does not exist')) {
      await createBudgetMetadataTable();
      // Tentar novamente após criar a tabela
      const { error: retryError } = await supabase
        .from('budget_metadata')
        .insert([{
          budget_id: budgetId,
          user_id: user.user.id,
          key,
          value
        }]);
        
      if (retryError) throw retryError;
    } else {
      throw error;
    }
  }
};

export const getBudgetMetadata = async (budgetId: number | string, key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('budget_metadata')
    .select('value')
    .eq('budget_id', budgetId)
    .eq('key', key)
    .maybeSingle();
    
  if (error) {
    // Se a tabela não existir, retornar null
    if (error.code === 'PGRST204' || error.message.includes('does not exist')) {
      return null;
    }
    throw error;
  }
  
  return data?.value || null;
};

// Budgets
export const getBudgets = async (yearMonth?: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // Verificando a estrutura da tabela
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.user.id);
  
  if (error) throw error;
  return data || [];
};

export const saveBudget = async (budget: Omit<Budget, 'id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // Usar os campos que existem na tabela, evitando category_id por enquanto
  const budgetData: any = {
    user_id: user.user.id,
    name: budget.name,
    budget_limit: budget.limit
  };
  
  const { data, error } = await supabase
    .from('budgets')
    .insert([budgetData])
    .select()
    .single();
    
  if (error) throw error;
  
  // Se o orçamento foi criado com sucesso e temos um categoryId
  // vamos armazená-lo usando a tabela de metadados
  let categoryId = budget.categoryId;
  if (data.id && categoryId) {
    try {
      // Salvar relação em uma tabela separada de metadados
      await saveBudgetMetadata(data.id, 'categoryId', String(categoryId));
    } catch (metaError) {
      console.warn('Erro ao salvar metadados do orçamento:', metaError);
      // Não falhar por causa do erro de metadados
    }
  }
  
  // Retornar o orçamento com as propriedades necessárias para o cliente
  return {
    id: data.id,
    name: data.name,
    limit: data.budget_limit,
    categoryId: categoryId, // Usar o valor original
    // Atribuir valores do estado do cliente para propriedades que não existem no banco
    isRecurrent: budget.isRecurrent,
    isRecurrenceActive: budget.isRecurrenceActive,
    color: budget.color
  } as Budget;
};

export const updateBudget = async (id: number, budget: Omit<Budget, 'id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  // Usar os campos que existem na tabela, evitando category_id por enquanto
  const budgetData: any = {
    name: budget.name,
    budget_limit: budget.limit
  };
  
  const { data, error } = await supabase
    .from('budgets')
    .update(budgetData)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select();
    
  if (error) throw error;
  
  // Se o orçamento foi atualizado e temos um categoryId
  // vamos armazená-lo usando a tabela de metadados
  let categoryId = budget.categoryId;
  if (id && categoryId !== undefined) {
    try {
      // Salvar relação em uma tabela separada de metadados
      await saveBudgetMetadata(id, 'categoryId', categoryId ? String(categoryId) : '');
    } catch (metaError) {
      console.warn('Erro ao salvar metadados do orçamento:', metaError);
      // Não falhar por causa do erro de metadados
    }
  }
  
  // Se não tiver dados, provavelmente já foi atualizado ou não existe
  if (!data || data.length === 0) {
    return { id, ...budget } as Budget;
  }
  
  // Retornar o orçamento com as propriedades necessárias para o cliente
  return {
    id: data[0].id,
    name: data[0].name,
    limit: data[0].budget_limit,
    categoryId: categoryId,
    // Atribuir valores do estado do cliente para propriedades que não existem no banco
    isRecurrent: budget.isRecurrent,
    isRecurrenceActive: budget.isRecurrenceActive,
    color: budget.color
  } as Budget;
};

export const deleteBudget = async (id: number) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not found');
  
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id);
    
  if (error) throw error;
  return true;
};

// Get all data for a specific month
export const getMonthData = async (yearMonth: string): Promise<MonthData> => {
  const [monthSettings, transactions, budgets] = await Promise.all([
    getMonthSettings(yearMonth),
    getTransactions(yearMonth),
    getBudgets() // Obter todos os orçamentos, pois gerenciamos recorrência no cliente
  ]);
  
  // Processar orçamentos para obter os metadados de categoria para cada um
  const budgetsWithMetadata = await Promise.all(budgets.map(async (b) => {
    let categoryIdStr = null;
    
    try {
      // Buscar a categoria vinculada nos metadados
      categoryIdStr = await getBudgetMetadata(b.id, 'categoryId');
    } catch (e) {
      console.warn(`Erro ao buscar categoria para orçamento ${b.id}:`, e);
    }
    
    // Convertendo o valor da string para número se não for nulo ou vazio
    const categoryId = categoryIdStr && categoryIdStr.trim() !== '' 
      ? parseInt(categoryIdStr, 10) 
      : null;
    
    return {
      id: b.id,
      name: b.name,
      limit: b.budget_limit,
      categoryId: categoryId,
      // Essas propriedades não existem no banco, então definimos valores padrão
      isRecurrent: false,
      isRecurrenceActive: false
    };
  }));
  
  return {
    initialBalance: monthSettings.initial_balance || 0,
    transactions: transactions.map(t => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      type: t.type,
      date: t.date,
      budgetId: t.budget_id,
      categoryId: t.category_id || null
    })),
    budgets: budgetsWithMetadata
  };
};

// Save all data for a specific month
export const saveMonthData = async (yearMonth: string, data: MonthData) => {
  await saveMonthSettings(yearMonth, data.initialBalance);
  
  // Note: This is a simplified approach. In a real app, you would need to
  // handle creating, updating, and deleting transactions and budgets based on changes.
};