import React from 'react';
import * as LucideIcons from 'lucide-react';

// Mapeamento de nomes para componentes de ícones do Lucide
export const iconMap: { [key: string]: React.FC<{ className?: string, style?: React.CSSProperties }> } = {
  // Básico
  'home': LucideIcons.Home,
  'settings': LucideIcons.Settings,
  'bookmark': LucideIcons.Bookmark,
  'tag': LucideIcons.Tag,
  'user': LucideIcons.User,
  'users': LucideIcons.Users,
  'mail': LucideIcons.Mail,
  'phone': LucideIcons.Phone,
  'bell': LucideIcons.Bell,
  'clock': LucideIcons.Clock,
  'calendar': LucideIcons.Calendar,
  'check': LucideIcons.Check,
  'x': LucideIcons.X,
  'plus': LucideIcons.Plus,
  'minus': LucideIcons.Minus,
  'eye': LucideIcons.Eye,
  'trash': LucideIcons.Trash,
  'search': LucideIcons.Search,
  'file': LucideIcons.File,
  'trending-up': LucideIcons.TrendingUp,
  'trending-down': LucideIcons.TrendingDown,
  'dollar-sign': LucideIcons.DollarSign,
  'shopping-cart': LucideIcons.ShoppingCart,
  'clipboard': LucideIcons.Clipboard,
  'dumbbell': LucideIcons.Dumbbell,
  
  // Finanças
  'credit-card': LucideIcons.CreditCard,
  'wallet': LucideIcons.Wallet,
  'bar-chart': LucideIcons.BarChart,
  'receipt': LucideIcons.Receipt,
  'percent': LucideIcons.Percent,
  'pie-chart': LucideIcons.PieChart,
  'calculator': LucideIcons.Calculator,
  'landmark': LucideIcons.Landmark,
  
  // Alimentação
  'utensils': LucideIcons.Utensils,
  'coffee': LucideIcons.Coffee,
  'shopping-bag': LucideIcons.ShoppingBag,
  
  // Transporte
  'car': LucideIcons.Car,
  'bus': LucideIcons.Bus,
  'train': LucideIcons.Train,
  'plane': LucideIcons.Plane,
  'truck': LucideIcons.Truck,
  
  // Saúde
  'heart': LucideIcons.Heart,
  'heart-pulse': LucideIcons.HeartPulse,
  'activity': LucideIcons.Activity,
  'weight': LucideIcons.Weight,
  
  // Casa
  'tv': LucideIcons.Tv,
  'bed': LucideIcons.Bed,
  
  // Tecnologia
  'smartphone': LucideIcons.Smartphone,
  'laptop': LucideIcons.Laptop,
  'wifi': LucideIcons.Wifi,
  'bluetooth': LucideIcons.Bluetooth,
  'headphones': LucideIcons.Headphones,
  'printer': LucideIcons.Printer,
  'battery': LucideIcons.Battery,
  
  // Trabalho
  'briefcase': LucideIcons.Briefcase,
  'book-open': LucideIcons.BookOpen,
  
  // Educação
  'book': LucideIcons.Book,
  'graduation-cap': LucideIcons.GraduationCap,
  
  // Entretenimento
  'music': LucideIcons.Music,
  'video': LucideIcons.Video,
  'film': LucideIcons.Film,
  
  // Lazer
  'sun': LucideIcons.Sun,
  'umbrella': LucideIcons.Umbrella,
  'gamepad': LucideIcons.Gamepad2,
  'palette': LucideIcons.Palette,
  'bike': LucideIcons.Bike,
  
  // Compras
  'gift': LucideIcons.Gift,
};

// Função auxiliar para obter um ícone do Lucide pelo nome
export function getIcon(name: string) {
  return iconMap[name] || LucideIcons.HelpCircle;
}