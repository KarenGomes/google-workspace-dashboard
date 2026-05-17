/**
 * @module ThemeContext
 * @description Provides { theme, toggleTheme } throughout the tree.
 * Persists selection to localStorage; sets data-theme on <html>.
 * Default: 'dark'.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { createLogger } from '../utils/logger';

const log = createLogger('ThemeContext');
const Ctx = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    log.info('theme →', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}

/** @throws if used outside <ThemeProvider> */
export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
