import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * ThemeProvider component that provides theme-related context to its children.
 * 
 * This component manages a dark/light theme state, persists the theme preference
 * in localStorage, and applies the appropriate class to the root HTML element.
 * It also provides a method to toggle the theme.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the theme context.
 * 
 * @returns {JSX.Element} The ThemeContext.Provider component wrapping the children.
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * @context
 * The context value includes:
 * - {boolean} isDark - Indicates whether the dark theme is active.
 * - {Function} toggleTheme - Function to toggle between dark and light themes.
 */

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
