import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { useAuth, View } from '../App';
import { ThemeToggle } from './ui/ThemeToggle';
import type { Notification } from '../types';
import { NotificationPanel } from './ui/NotificationPanel';
import { Button } from './ui/Button';

interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    currentView: View;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onNavigate: (view: View, applicantId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onToggleSidebar, 
    isSidebarOpen, 
    currentView, 
    searchTerm, 
    onSearchChange,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onNavigate
}) => {
  const { currentUser } = useAuth();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const showSearchBar = ['dashboard', 'applications', 'profile'].includes(currentView);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handlePanelNavigate = (link: Notification['link']) => {
      if (link) {
          onNavigate(link.view, link.applicantId);
      }
  }


  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex items-center justify-between sticky top-0 z-20 h-20 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
             <button onClick={onToggleSidebar} className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 focus:outline-none mr-4">
                {isSidebarOpen ? ICONS.close : ICONS.menu}
            </button>
            <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Nwangele LGA Loan Management</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Empowering Local Businesses in Imo State</p>
            </div>
        </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        {showSearchBar && (
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search applicants..."
                className="w-40 md:w-56 lg:w-64 pl-4 pr-10 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 focus:w-48 md:focus:w-72 text-slate-900 dark:text-slate-200"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <svg className="h-5 w-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
        )}
        <ThemeToggle />
         <div ref={notificationRef} className="relative">
             <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationsOpen(prev => !prev)}
              className="p-2 !rounded-full relative"
              aria-label={`${unreadCount} unread notifications`}
            >
              {ICONS.bell}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                </span>
              )}
            </Button>
            {isNotificationsOpen && (
                <NotificationPanel 
                    notifications={notifications}
                    onMarkAsRead={onMarkAsRead}
                    onMarkAllAsRead={onMarkAllAsRead}
                    onNavigate={handlePanelNavigate}
                    onClose={() => setNotificationsOpen(false)}
                />
            )}
        </div>
        <div className="flex items-center space-x-2">
            <img 
              src={currentUser?.profilePictureUrl || `https://i.pravatar.cc/40?u=${currentUser?.email}`}
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
            />
          <div className="hidden sm:block">
            <div className="font-semibold text-slate-700 dark:text-slate-200">{currentUser?.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
