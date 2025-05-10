import { useState, useEffect } from 'react';

// Hook para verificar se a tela é mobile (menor que 768px de largura)
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar tamanho inicial
    checkMobile();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);

    // Remover listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}