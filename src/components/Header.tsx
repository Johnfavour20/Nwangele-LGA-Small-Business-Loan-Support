import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { useAuth, View, useTheme } from '../App';
import { UserRole } from '../types';
import { ImageModal } from './ui/ImageModal';

interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    currentView: View;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onNavigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen, currentView, searchTerm, onSearchChange, onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const showSearchBar = ['dashboard', 'applications', 'profile'].includes(currentView);
  const profilePictureUrl = currentUser?.profilePictureUrl || `https://i.pravatar.cc/40?u=${currentUser?.email}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManageAccount = () => {
    const destination: View = currentUser?.role === UserRole.Applicant ? 'my-profile' : 'settings';
    onNavigate(destination);
    setProfileOpen(false);
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between sticky top-0 z-20 h-20 border-b border-slate-200 dark:border-gray-700">
          <div className="flex items-center min-w-0">
               <button onClick={onToggleSidebar} className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-500 focus:outline-none mr-4">
                  {isSidebarOpen ? ICONS.close : ICONS.menu}
              </button>
              <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">Nwangele LGA Loan Management</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Empowering Local Businesses in Imo State</p>
              </div>
          </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
          
          <div className="relative" ref={profileRef}>
            <div className="flex items-center space-x-2">
              <button onClick={() => setImageModalOpen(true)} className="focus:outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800">
                  <img 
                    src={profilePictureUrl}
                    alt="User" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                  />
              </button>
              <button onClick={() => setProfileOpen(!isProfileOpen)} className="hidden sm:block text-left focus:outline-none">
                <div className="font-semibold text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">{currentUser?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.role}</div>
              </button>
            </div>
            
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 animate-fade-in origin-top-right overflow-hidden">
                <div className="p-4 flex items-center gap-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <img src={profilePictureUrl} alt="User" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{currentUser?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Role:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{currentUser?.role}</span>
                  </div>
                  {currentUser?.ward && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Ward:</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{currentUser.ward}</span>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t dark:border-gray-700">
                   <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleManageAccount(); }}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {currentUser?.role === UserRole.Applicant ? ICONS.profile : ICONS.settings}
                      <span>Manage Account</span>
                    </a>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); logout(); }}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      {ICONS.logout}
                      <span className="font-semibold">Logout</span>
                    </a>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>
      <ImageModal isOpen={isImageModalOpen} onClose={() => setImageModalOpen(false)} imageUrl={profilePictureUrl} />
    </>
  );
};