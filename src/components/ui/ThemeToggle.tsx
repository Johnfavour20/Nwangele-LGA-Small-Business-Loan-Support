import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ICONS } from '../../constants';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="p-2 !rounded-full"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? ICONS.moon : ICONS.sun}
    </Button>
  );
};
