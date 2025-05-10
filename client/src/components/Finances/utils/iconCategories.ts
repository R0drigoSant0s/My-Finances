// Categorias de ícones organizadas para melhor navegação
// Baseado no arquivo do Figma fornecido

export type IconCategory = {
  id: string;
  name: string;
  icons: string[];
};

export const iconCategories: IconCategory[] = [
  {
    id: 'base',
    name: 'Básico',
    icons: [
      'home',
      'search',
      'settings',
      'bookmark',
      'tag',
      'user',
      'users',
      'mail',
      'phone',
      'bell',
      'clock',
      'calendar',
      'check',
      'x',
      'plus',
      'minus',
      'eye',
      'trash',
      'trending-up',
      'trending-down',
      'dollar-sign',
      'shopping-cart',
      'dumbbell'
    ]
  },
  {
    id: 'finance',
    name: 'Finanças',
    icons: [
      'dollar-sign',
      'credit-card',
      'wallet',
      'trending-up',
      'bar-chart',
      'landmark',
      'receipt',
      'percent',
      'shopping-cart',
      'pie-chart',
      'calculator'
    ]
  },
  {
    id: 'food',
    name: 'Alimentação',
    icons: [
      'utensils',
      'coffee',
      'shopping-bag'
    ]
  },
  {
    id: 'transport',
    name: 'Transporte',
    icons: [
      'car',
      'bus',
      'train',
      'plane',
      'truck'
    ]
  },
  {
    id: 'health',
    name: 'Saúde',
    icons: [
      'heart-pulse',
      'activity',
      'weight'
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icons: [
      'dumbbell',
      'weight',
      'activity'
    ]
  },
  {
    id: 'home',
    name: 'Casa',
    icons: [
      'home',
      'bed',
      'tv'
    ]
  },
  {
    id: 'tech',
    name: 'Tecnologia',
    icons: [
      'smartphone',
      'laptop',
      'wifi',
      'bluetooth',
      'headphones',
      'printer',
      'battery'
    ]
  },
  {
    id: 'work',
    name: 'Trabalho',
    icons: [
      'briefcase',
      'book-open',
      'calendar',
      'clock',
      'file',
      'mail',
      'paperclip',
      'phone',
      'clipboard'
    ]
  },
  {
    id: 'education',
    name: 'Educação',
    icons: [
      'book',
      'graduation-cap'
    ]
  },
  {
    id: 'entertainment',
    name: 'Entretenimento',
    icons: [
      'music',
      'video',
      'film'
    ]
  },
  {
    id: 'leisure',
    name: 'Lazer',
    icons: [
      'dumbbell',
      'sun',
      'umbrella',
      'gamepad',
      'palette',
      'bike'
    ]
  },
  {
    id: 'travel',
    name: 'Viagem',
    icons: [
      'plane'
    ]
  },
  {
    id: 'shopping',
    name: 'Compras',
    icons: [
      'shopping-bag',
      'shopping-cart',
      'gift',
      'tag'
    ]
  }
];

// Função auxiliar para obter todos os ícones em uma lista única
export const getAllIcons = (): string[] => {
  return iconCategories.flatMap(category => category.icons);
};