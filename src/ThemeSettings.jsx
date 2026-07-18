import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem('theme');
  const [isDark, setIsDark] = useState(savedTheme ? savedTheme === 'dark' : true);

  useEffect(() => {
    // Apply theme on mount
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};