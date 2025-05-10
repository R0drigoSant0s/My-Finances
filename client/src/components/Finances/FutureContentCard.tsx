import React from 'react';
import { Calendar } from 'lucide-react';

interface FutureContentCardProps {
  title?: string;
  description?: string;
}

export default function FutureContentCard({ 
  title = "Conteúdo Futuro", 
  description = "Em breve, novos recursos estarão disponíveis nesta área." 
}: FutureContentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden h-64">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h2>
        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="p-5 flex items-center justify-center h-[calc(100%-56px)]">
        <p className="text-gray-400 dark:text-gray-500 text-center">{description}</p>
      </div>
    </div>
  );
}