import React, { useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import OfflineIndicator from './OfflineIndicator';

interface ConnectionManagerProps {
  children: React.ReactNode;
  onReconnect?: () => Promise<void>;
}

/**
 * Componente que gerencia o estado de conexão e sincronização de dados
 * Exibe indicador visual quando offline e sincroniza quando voltar a ficar online
 */
export default function ConnectionManager({ 
  children,
  onReconnect 
}: ConnectionManagerProps) {
  const { online, effectiveType } = useNetworkStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Detectar quando voltar a ficar online após estar offline
  useEffect(() => {
    if (!online) {
      // Marcar que esteve offline
      setWasOffline(true);
    } else if (wasOffline) {
      // Voltou a ficar online após estar offline, sincronizar dados
      const syncData = async () => {
        if (onReconnect) {
          setIsSyncing(true);
          try {
            await onReconnect();
          } catch (error) {
            console.error('Erro ao sincronizar dados:', error);
          } finally {
            setIsSyncing(false);
            setWasOffline(false);
          }
        }
      };
      
      syncData();
    }
  }, [online, wasOffline, onReconnect]);
  
  // Sugerir ao usuário que desative o modo de economia de dados se a conexão for lenta
  const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g';
  
  return (
    <>
      {/* Indicador de status de conexão */}
      <OfflineIndicator />
      
      {/* Alerta para conexão lenta */}
      {online && isSlowConnection && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 text-yellow-800 dark:text-yellow-300 text-sm text-center">
          Conexão lenta detectada. Algumas funcionalidades podem não responder rapidamente.
        </div>
      )}
      
      {/* Indicador de sincronização */}
      {isSyncing && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-blue-600 text-white text-sm py-2 px-4 rounded-full shadow-lg flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sincronizando dados...
          </div>
        </div>
      )}
      
      {/* Conteúdo da aplicação */}
      {children}
    </>
  );
}