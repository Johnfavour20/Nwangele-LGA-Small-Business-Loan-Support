import React from 'react';
import type { View } from '../App';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { ICONS, NigeriaFlag, ImoStateSeal } from '../constants';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isExpanded: boolean;
}> = ({ icon, label, isActive, onClick, isExpanded }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-green-100 text-green-800 font-semibold dark:bg-green-900/50 dark:text-green-300'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
      } ${!isExpanded ? 'justify-center' : ''}`}
    >
      {icon}
      <span className={`ml-4 transition-opacity duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen }) => {
  const { currentUser, logout } = useAuth();
  const userRole = currentUser?.role;

  const getNavItems = () => {
    switch (userRole) {
      case UserRole.Admin:
        return [
          { view: 'dashboard', icon: ICONS.dashboard, label: 'Dashboard' },
          { view: 'applications', icon: ICONS.applications, label: 'Applications' },
          { view: 'users', icon: ICONS.users, label: 'User Management' },
          { view: 'reports', icon: ICONS.reports, label: 'Reports' },
        ];
      case UserRole.Officer:
        return [
          { view: 'dashboard', icon: ICONS.dashboard, label: 'Dashboard' },
          { view: 'applications', icon: ICONS.applications, label: 'Applications' },
          { view: 'reports', icon: ICONS.reports, label: 'Reports' },
        ];
      case UserRole.Applicant:
        return [
          { view: 'dashboard', icon: ICONS.dashboard, label: 'My Dashboard' },
          { view: 'applications', icon: ICONS.applications, label: 'My Applications' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 flex flex-col z-30 transition-all duration-300 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}>
      <div className={`flex items-center p-4 border-b border-slate-200 dark:border-slate-700 transition-all duration-300 h-20 ${isOpen ? 'justify-start' : 'justify-center'}`}>
        <div className="flex items-center gap-2">
            <ImoStateSeal />
            <NigeriaFlag />
        </div>
        {isOpen && <h1 className="text-xl font-bold ml-2 whitespace-nowrap text-green-800 dark:text-green-300">LGA LOANS</h1>}
      </div>

      <nav className="flex-1 p-2">
        <ul>
          {navItems.map(item => (
             <NavItem
              key={item.view}
              icon={item.icon}
              label={item.label}
              isActive={currentView === item.view || (currentView === 'profile' && item.view === 'applications')}
              onClick={() => onNavigate(item.view as View)}
              isExpanded={isOpen}
            />
          ))}
        </ul>
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        <ul>
           {userRole === UserRole.Admin && <NavItem icon={ICONS.settings} label="Settings" isActive={currentView === 'settings'} onClick={() => onNavigate('settings')} isExpanded={isOpen} />}
           {userRole === UserRole.Applicant && <NavItem icon={ICONS.profile} label="My Profile" isActive={currentView === 'my-profile'} onClick={() => onNavigate('my-profile')} isExpanded={isOpen} />}
          <NavItem icon={ICONS.logout} label="Logout" isActive={false} onClick={logout} isExpanded={isOpen} />
        </ul>
      </div>
    </aside>
  );
};