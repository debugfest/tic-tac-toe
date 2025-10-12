import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../themes';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-center items-center gap-4 my-4">
      <label htmlFor="theme-select" className="text-primary-text font-semibold">
        Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as keyof typeof themes)}
        className="p-2 rounded-md bg-surface border-2 border-board-border text-primary-text"
      >
        {Object.keys(themes).map((themeKey) => (
          <option key={themeKey} value={themeKey}>
            {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};