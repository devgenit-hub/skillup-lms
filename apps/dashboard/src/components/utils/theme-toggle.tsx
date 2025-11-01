'use client';

import { useTheme } from '../../providers/theme-provider';

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative inline-flex h-8 w-16 items-center
        rounded-full border-2 border-border
        bg-muted transition-colors duration-300
        hover:bg-muted/80
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        dark:bg-primary
      "
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
        <svg
          className="h-4 w-4 text-foreground absolute inset-0 m-auto transition-opacity duration-200 dark:opacity-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        <svg
          className="h-4 w-4 text-foreground absolute inset-0 m-auto transition-opacity duration-200 opacity-0 dark:opacity-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </span>
    </button>
  );
}
