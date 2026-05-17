/** @component ThemeToggle — sun/moon toggle button */
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      id="theme-toggle"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
      title={`Modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
