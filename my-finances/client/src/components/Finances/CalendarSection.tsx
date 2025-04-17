import React from 'react';

interface CalendarSectionProps {
  weekDays: string[];
  calendarDays: (number | null)[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  formatDisplayDate: (day: number) => string;
}

export default function CalendarSection({
  weekDays,
  calendarDays,
  selectedDay,
  setSelectedDay,
  formatDisplayDate
}: CalendarSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Calendário</h2>
      </div>
      
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square flex items-center justify-center">
              {day !== null && (
                <button 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                    ${selectedDay === day 
                      ? 'bg-blue-500 text-white font-medium' 
                      : 'hover:bg-gray-100 text-gray-800'}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">Data selecionada:</div>
          <div className="text-sm font-medium text-gray-800">{formatDisplayDate(selectedDay)}</div>
        </div>
      </div>
    </div>
  );
}
