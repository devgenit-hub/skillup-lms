'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        relative inline-flex h-8 w-16 items-center
        rounded-full border-2 border-border
        bg-muted transition-all duration-300
        hover:bg-muted/80
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        dark:bg-primary
      "
      style={{ opacity: mounted ? 1 : 0 }}
      aria-label="Toggle theme"
    >
      <span
        className="
          relative h-6 w-6 transform rounded-full
          bg-background shadow-lg
          transition-transform duration-300
          translate-x-1
          dark:translate-x-8
          flex items-center justify-center
        "
      >
        <Sun
          className="h-4 w-4 text-foreground absolute inset-0 m-auto transition-opacity duration-200 dark:opacity-0"
          strokeWidth={2}
        />

        <Moon
          className="h-4 w-4 text-foreground absolute inset-0 m-auto transition-opacity duration-200 opacity-0 dark:opacity-100"
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
