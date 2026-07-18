import React from 'react';
import { useTheme } from './ThemeSettings';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;