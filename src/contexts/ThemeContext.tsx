import { createContext, useContext,useState,useEffect,ReactNode } from "react";
import {themes} from '../themes';
type Theme = keyof typeof themes;
interface ThemeContextType{
    theme: Theme;
    setTheme: (theme: Theme) =>void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme =() => {
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
interface ThemeProviderProps{
    children: ReactNode;
}
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const themeColors = themes[theme];

    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (theme === 'dark' || theme === 'neon') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};