import { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        shadow: 'var(--shadow)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        popover: 'var(--popover)',
        card: 'var(--card)',
        primaryForeground: 'var(--primary-foreground)',
        secondaryForeground: 'var(--secondary-foreground)',
        mutedForeground: 'var(--muted-foreground)',
        accentForeground: 'var(--accent-foreground)',
        popoverForeground: 'var(--popover-foreground)',
        cardForeground: 'var(--card-foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
