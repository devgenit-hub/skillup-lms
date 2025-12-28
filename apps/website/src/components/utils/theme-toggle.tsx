'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  iconClassName?: string;
}

export function ThemeToggle({ className, iconClassName }: ThemeToggleProps = {}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={className || 'p-2 rounded-md hover:bg-muted/30'}
        disabled
      >
        <div className={iconClassName || 'h-5 w-5'} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={className || 'p-2 rounded-md hover:bg-muted/30'}
    >
      {theme === 'dark' ? (
        <Sun className={iconClassName || 'h-5 w-5 text-amber-400'} />
      ) : (
        <Moon className={iconClassName || 'h-5 w-5 text-blue-800'} />
      )}
    </button>
  );
}
