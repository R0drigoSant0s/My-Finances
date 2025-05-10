import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown, LineChart } from 'lucide-react';
import FinancialCard from './FinancialCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface FinancialCardCarouselProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  formatCurrency: (value: number) => string;
}

export default function FinancialCardCarousel({
  balance,
  totalIncome,
  totalExpenses,
  totalInvestments,
  formatCurrency
}: FinancialCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const cards = [
    {
      title: 'Saldo',
      amount: balance,
      type: 'balance' as const,
      icon: <LineChart />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Receitas',
      amount: totalIncome,
      type: 'income' as const,
      icon: <ArrowUp />,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600'
    },
    {
      title: 'Despesas',
      amount: totalExpenses,
      type: 'expense' as const,
      icon: <ArrowDown />,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600'
    },
    {
      title: 'Investimentos',
      amount: totalInvestments,
      type: 'investment' as const,
      icon: <LineChart />,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600'
    }
  ];
  
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;
    
    const handleScroll = () => {
      if (!carouselRef.current) return;
      
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.offsetWidth * 0.85; // 85% of width
      const newIndex = Math.round(scrollLeft / itemWidth);
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };
    
    const carousel = carouselRef.current;
    carousel.addEventListener('scroll', handleScroll);
    
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, isMobile]);
  
  // Mobile carousel
  if (isMobile) {
    return (
      <div className="px-4 pt-4">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
        >
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="snap-center min-w-[85%] flex-shrink-0 px-2 first:pl-0 last:pr-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`${card.iconBg} p-2 rounded-lg mr-2`}>
                      <span className={`${card.iconColor}`}>
                        {React.cloneElement(card.icon, { className: 'h-6 w-6' })}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</span>
                  </div>
                </div>
                <p className={`text-xl font-bold ${
                  card.type === 'balance' ? 'text-blue-600' :
                  card.type === 'income' ? 'text-green-600' :
                  card.type === 'expense' ? 'text-red-600' :
                  'text-purple-600'
                }`}>
                  {formatCurrency(card.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicadores de posição */}
        <div className="flex justify-center mt-2 mb-4">
          {cards.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 mx-1 rounded-full ${
                activeIndex === idx ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Desktop grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <FinancialCard 
        title="Saldo" 
        amount={balance} 
        type="balance" 
        formatCurrency={formatCurrency}
      />
      <FinancialCard 
        title="Receitas" 
        amount={totalIncome} 
        type="income" 
        formatCurrency={formatCurrency}
      />
      <FinancialCard 
        title="Despesas" 
        amount={totalExpenses} 
        type="expense" 
        formatCurrency={formatCurrency}
      />
      <FinancialCard 
        title="Investimentos" 
        amount={totalInvestments} 
        type="investment" 
        formatCurrency={formatCurrency}
      />
    </div>
  );
}