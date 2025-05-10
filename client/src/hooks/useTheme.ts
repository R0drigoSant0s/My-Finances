import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Verificar o tema no localStorage ou usar light como padrão
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica localStorage primeiro
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Se existir no localStorage, retorna o valor salvo
    // Se não existir, verifica preferência do sistema
    if (savedTheme) {
      return savedTheme;
    } else {
      // Verifica preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
  });

  // Efeito para aplicar o tema no documento quando ele mudar
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Salvar o tema no localStorage para persistência
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}