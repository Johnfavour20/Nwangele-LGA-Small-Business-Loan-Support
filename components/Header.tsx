import React from 'react';
import { ICONS } from '../constants';
import { useAuth, View, useTheme } from '../App';

interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    currentView: View;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen, currentView, searchTerm, onSearchChange }) => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const showSearchBar = ['dashboard', 'applications', 'profile'].includes(currentView);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between sticky top-0 z-20 h-20 border-b border-slate-200 dark:border-gray-700">
        <div className="flex items-center">
             <button onClick={onToggleSidebar} className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-500 focus:outline-none mr-4">
                {isSidebarOpen ? ICONS.close : ICONS.menu}
            </button>
            <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Nwangele LGA Loan Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Empowering Local Businesses in Imo State</p>
            </div>
        </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        {showSearchBar && (
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search applicants..."
                className="w-40 md:w-56 lg:w-64 pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 focus:w-48 md:focus:w-72"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
        )}
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? ICONS.moon : ICONS.sun}
        </button>
        <div className="flex items-center space-x-2">
            <img 
              src={`https://i.pravatar.cc/40?u=${currentUser?.email}`}
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
            />
          <div className="hidden sm:block">
            <div className="font-semibold text-gray-700 dark:text-gray-200">{currentUser?.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};