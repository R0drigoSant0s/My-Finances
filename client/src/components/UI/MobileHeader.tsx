import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function MobileHeader({ title, onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-4 shadow-sm safe-area-header">
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-2 text-lg font-bold text-gray-800 dark:text-white">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Search size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}