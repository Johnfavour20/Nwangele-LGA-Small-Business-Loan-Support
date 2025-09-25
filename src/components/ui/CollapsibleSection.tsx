import React, { useState } from 'react';

const ChevronIcon: React.FC<{ isRotated: boolean }> = ({ isRotated }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transform transition-transform duration-300 text-gray-500 ${isRotated ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
        <ChevronIcon isRotated={isOpen} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out grid ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
            <div className="p-4 sm:p-5 border-t border-slate-200">
              {children}
            </div>
        </div>
      </div>
    </div>
  );
};