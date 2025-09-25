import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseClasses = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  };
  
  const variantClasses = {
    primary: 'bg-green-700 text-white hover:bg-green-800 focus:ring-green-600 dark:focus:ring-offset-gray-800',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-green-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-offset-gray-800',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
