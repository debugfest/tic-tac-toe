/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode : 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'primary-text': 'rgb(var(--color-primary-text) / <alpha-value>)',
        'secondary-text': 'rgb(var(--color-secondary-text) / <alpha-value>)',
        'board-border': 'rgb(var(--color-board-border) / <alpha-value>)',
        'x-color': 'rgb(var(--color-x) / <alpha-value>)',
        'o-color': 'rgb(var(--color-o) / <alpha-value>)'
      }
    },
  },
  plugins: [],
};
