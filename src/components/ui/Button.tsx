import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    primary: 'bg-green-700 text-white hover:bg-green-800 focus:ring-green-600',
    outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 focus:ring-green-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`} disabled={props.disabled || isLoading} {...props}>
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
};