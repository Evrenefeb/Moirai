import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context (The "Pipe")
const ThemeContext = createContext();

// 2. Create the Provider (The "Tank" holding the state)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load saved theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('moirai-theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // The function to change theme globally
  const switchTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('moirai-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom Hook (Easy way to access the context)
export const useTheme = () => useContext(ThemeContext);