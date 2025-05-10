import React from 'react';

interface MobileLoadingStateProps {
  type?: 'card' | 'transaction' | 'list' | 'budget';
  count?: number;
  className?: string;
}

export default function MobileLoadingState({
  type = 'transaction',
  count = 3,
  className = ''
}: MobileLoadingStateProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 w-full">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        );
      
      case 'transaction':
        return (
          <div className="animate-pulse p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'budget':
        return (
          <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
            <div className="flex justify-between items-center mt-1">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        );
      
      case 'list':
      default:
        return (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        );
    }
  };

  // Criar um array com o número de skeletons especificado
  const skeletons = Array.from({ length: count }, (_, index) => (
    <React.Fragment key={index}>
      {renderSkeleton()}
    </React.Fragment>
  ));

  return (
    <div className={`mobile-loading-state ${className}`}>
      {skeletons}
    </div>
  );
}