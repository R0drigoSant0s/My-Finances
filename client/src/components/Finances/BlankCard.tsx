import React from 'react';

interface BlankCardProps {
  title?: string;
  description?: string;
}

export default function BlankCard({ 
  title = "Conteúdo Futuro", 
  description = "Espaço reservado para conteúdo adicional" 
}: BlankCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden h-64">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div className="p-5 flex items-center justify-center h-[calc(100%-56px)]">
        <p className="text-gray-400 dark:text-gray-500 text-center">{description}</p>
      </div>
    </div>
  );
}