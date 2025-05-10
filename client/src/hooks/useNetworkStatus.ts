import { useState, useEffect } from 'react';

interface NetworkStatus {
  online: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink?: number;
  rtt?: number;
}

export function useNetworkStatus(): NetworkStatus {
  // Estado inicial presumindo estar online (otimista)
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
    effectiveType: 'unknown',
    downlink: undefined,
    rtt: undefined
  });

  useEffect(() => {
    // Função para atualizar o tipo de conexão
    const updateConnectionStatus = () => {
      // Verificar se a API de Network Information está disponível
      if ('connection' in navigator && navigator.connection) {
        const connection = navigator.connection as any;
        
        setStatus({
          online: navigator.onLine,
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      } else {
        // Fallback para browsers que não suportam a API
        setStatus({
          online: navigator.onLine,
          effectiveType: 'unknown'
        });
      }
    };

    // Event listeners para mudanças de conexão
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, online: true }));
      
      // Notificação visual de reconexão
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Conexão restaurada', {
          body: 'Você está online novamente. Seus dados serão sincronizados.'
        });
      }
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, online: false }));
    };

    // Atualizar estado inicial
    updateConnectionStatus();

    // Registrar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitorar mudanças no tipo de conexão, se suportado
    if ('connection' in navigator && navigator.connection) {
      const connection = navigator.connection as any;
      connection.addEventListener('change', updateConnectionStatus);
    }

    // Limpar event listeners ao desmontar
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator && navigator.connection) {
        const connection = navigator.connection as any;
        connection.removeEventListener('change', updateConnectionStatus);
      }
    };
  }, []);

  return status;
}

// Hook simplificado que retorna apenas se está online ou offline
export function useOnlineStatus(): boolean {
  const { online } = useNetworkStatus();
  return online;
}