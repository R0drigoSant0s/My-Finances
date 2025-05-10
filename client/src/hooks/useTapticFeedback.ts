import { useCallback } from 'react';

type FeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Hook para fornecer feedback tátil/háptico em dispositivos móveis
 */
export function useTapticFeedback() {
  /**
   * Trigger para feedback tátil com diferentes intensidades
   * - light: vibração curta e leve (5ms)
   * - medium: vibração média (10ms)
   * - heavy: vibração mais forte (15ms)
   * - success: padrão de sucesso (vibração dupla curta)
   * - warning: padrão de alerta (vibração média)
   * - error: padrão de erro (vibração tripla)
   * - selection: seleção/mudança (vibração muito curta)
   */
  const trigger = useCallback((type: FeedbackType = 'light') => {
    // Verificar se a API de vibração está disponível
    if (!('vibrate' in navigator)) return;
    
    switch (type) {
      case 'light':
        navigator.vibrate(5);
        break;
      case 'medium':
        navigator.vibrate(10);
        break;
      case 'heavy':
        navigator.vibrate(15);
        break;
      case 'success':
        navigator.vibrate([5, 50, 5]);
        break;
      case 'warning':
        navigator.vibrate([10, 100, 10]);
        break;
      case 'error':
        navigator.vibrate([10, 50, 10, 50, 10]);
        break;
      case 'selection':
        navigator.vibrate(2);
        break;
      default:
        navigator.vibrate(5);
    }
  }, []);
  
  /**
   * Impacto para componentes com função de botão ou toque
   * Usado para dar feedback em botões e interações
   */
  const impact = useCallback((element?: HTMLElement | null) => {
    if (element) {
      // Adicionar classe de animação
      element.classList.add('button-press');
      
      // Remover depois da animação terminar
      setTimeout(() => {
        element.classList.remove('button-press');
      }, 200);
    }
    
    // Vibração leve
    trigger('light');
  }, [trigger]);
  
  /**
   * Notificação para eventos importantes
   * Usado para chamar atenção para notificações ou alertas
   */
  const notification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    trigger(type);
  }, [trigger]);
  
  /**
   * Seleção para mudanças de estado
   * Usado para seleções de itens, toggles, etc.
   */
  const selection = useCallback(() => {
    trigger('selection');
  }, [trigger]);
  
  return {
    trigger,
    impact,
    notification,
    selection
  };
}