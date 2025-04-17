import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme types
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeMode?: ThemeMode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultThemeMode = 'light' 
}) => {
  // Try to get saved theme from local storage
  const getSavedThemeMode = (): ThemeMode => {
    try {
      const saved = localStorage.getItem('themeMode') as ThemeMode | null;
      if (saved && (saved === 'light' || saved === 'dark')) {
        return saved;
      }
      
      // Check system preference as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      return defaultThemeMode;
    }
  };
  
  const [themeMode, setThemeMode] = useState<ThemeMode>(getSavedThemeMode());
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(themeMode);
    
    // Save to local storage
    try {
      localStorage.setItem('themeMode', themeMode);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [themeMode]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
