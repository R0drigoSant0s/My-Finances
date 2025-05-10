import { HfInference } from '@huggingface/inference';

// Inicializar cliente Hugging Face com a chave API
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Interface para categorização de transações
export interface TransactionCategorization {
  category: string;
  confidence: number;
  subcategory?: string;
}

// Interface para análise de sentimento
export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
}

// Classe de serviços Hugging Face para finanças
export class HuggingFaceService {
  /**
   * Categoriza uma descrição de transação em uma categoria financeira
   * Usa um modelo de classificação de texto para determinar a categoria mais provável
   */
  static async categorizeTransaction(description: string): Promise<TransactionCategorization> {
    try {
      // Modelo de classificação de texto zero-shot
      const modelId = 'facebook/bart-large-mnli';
      
      // Lista de categorias financeiras comuns
      const categories = [
        'Alimentação', 'Transporte', 'Moradia', 'Saúde', 
        'Educação', 'Lazer', 'Roupas', 'Eletrônicos', 
        'Serviços', 'Utilidades', 'Viagem', 'Presente'
      ];
      
      // Fazer a chamada à API do Hugging Face
      const result = await hf.zeroShotClassification({
        model: modelId,
        inputs: description,
        parameters: { candidate_labels: categories }
      });
      
      // Tratar resultado como any para evitar problemas de tipos
      const typedResult = result as any;
      
      // Extrair labels e scores com segurança
      const labels = Array.isArray(typedResult.labels) ? typedResult.labels : categories;
      const scores = Array.isArray(typedResult.scores) ? typedResult.scores : Array(categories.length).fill(0);
      
      // Encontrar a categoria com maior pontuação
      let highestIndex = 0;
      for (let i = 1; i < scores.length; i++) {
        if (scores[i] > scores[highestIndex]) {
          highestIndex = i;
        }
      }
      
      return {
        category: labels[highestIndex],
        confidence: scores[highestIndex]
      };
    } catch (error) {
      console.error('Erro ao categorizar transação com Hugging Face:', error);
      
      // Fallback para categorização baseada em regras simples
      return fallbackCategorization(description);
    }
  }
  
  /**
   * Analisa o sentimento do texto financeiro
   * Útil para avaliar comentários ou notas em transações
   */
  static async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      // Modelo de análise de sentimento
      const modelId = 'distilbert-base-uncased-finetuned-sst-2-english';
      
      const result = await hf.textClassification({
        model: modelId,
        inputs: text
      });
      
      // Mapear resultados para nossa interface
      const sentiment = result[0].label.toLowerCase() === 'positive' 
        ? 'positive' 
        : result[0].label.toLowerCase() === 'negative'
          ? 'negative'
          : 'neutral';
      
      return {
        sentiment: sentiment as 'positive' | 'neutral' | 'negative',
        score: result[0].score
      };
    } catch (error) {
      console.error('Erro ao analisar sentimento com Hugging Face:', error);
      return { 
        sentiment: 'neutral',
        score: 0.5
      };
    }
  }
  
  /**
   * Extrai entidades financeiras de um texto
   * Como valores, datas, estabelecimentos, etc.
   */
  static async extractFinancialEntities(text: string): Promise<Record<string, string>> {
    try {
      // Modelo de reconhecimento de entidades nomeadas
      const modelId = 'dslim/bert-base-NER';
      
      const result = await hf.tokenClassification({
        model: modelId,
        inputs: text
      });
      
      // Agrupar entidades
      const entities: Record<string, string> = {};
      let currentEntity = '';
      let currentType = '';
      
      for (let i = 0; i < result.length; i++) {
        // Garantir que o item atual existe e tem as propriedades esperadas
        const item = result[i];
        if (!item || typeof item.entity !== 'string' || typeof item.word !== 'string') {
          continue;
        }
        
        // Se é início de entidade ou continuação da mesma entidade
        if (item.entity.startsWith('B-')) {
          // Salvar entidade anterior se existir
          if (currentEntity && currentType && currentType !== '') {
            entities[currentType] = currentEntity.trim();
          }
          
          // Iniciar nova entidade
          currentType = item.entity.substring(2).toLowerCase();
          currentEntity = item.word;
        } else if (item.entity.startsWith('I-')) {
          // Continuação da entidade atual
          currentEntity += ' ' + item.word;
        }
      }
      
      // Adicionar última entidade
      if (currentEntity && currentType && currentType !== '') {
        entities[currentType] = currentEntity.trim();
      }
      
      return entities;
    } catch (error) {
      console.error('Erro ao extrair entidades com Hugging Face:', error);
      return {};
    }
  }
}

/**
 * Categorização baseada em regras simples (fallback quando a API falha)
 */
function fallbackCategorization(description: string): TransactionCategorization {
  description = description.toLowerCase();
  
  // Mapeamento de palavras-chave para categorias
  const categoryKeywords: Record<string, string[]> = {
    'Alimentação': ['restaurante', 'lanche', 'supermercado', 'mercado', 'comida', 'delivery', 'ifood', 'refeição'],
    'Transporte': ['uber', 'táxi', '99', 'gasolina', 'combustível', 'ônibus', 'metrô', 'passagem', 'estacionamento'],
    'Moradia': ['aluguel', 'condomínio', 'iptu', 'água', 'luz', 'energia', 'gás', 'internet', 'wifi'],
    'Saúde': ['farmácia', 'remédio', 'consulta', 'médico', 'hospital', 'exame', 'dentista', 'terapia'],
    'Educação': ['escola', 'faculdade', 'curso', 'livro', 'material', 'mensalidade'],
    'Lazer': ['cinema', 'teatro', 'show', 'streaming', 'netflix', 'spotify', 'prime', 'jogo', 'viagem', 'hotel'],
    'Roupas': ['roupa', 'calçado', 'sapato', 'tênis', 'vestuário', 'fashion', 'loja'],
    'Eletrônicos': ['celular', 'computador', 'notebook', 'tablet', 'gadget', 'eletrônico']
  };
  
  // Verificar cada categoria
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (description.includes(keyword)) {
        return {
          category,
          confidence: 0.7 // Confiança média para categorizações baseadas em regras
        };
      }
    }
  }
  
  // Categoria padrão se nenhuma correspondência for encontrada
  return {
    category: 'Outros',
    confidence: 0.5
  };
}