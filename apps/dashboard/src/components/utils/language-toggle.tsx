'use client';

import { useLocale } from '../../providers/locale-provider';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const handleToggle = () => {
    setLocale(locale === 'en' ? 'bn' : 'en');
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 transition-colors dark:bg-gray-700"
      aria-label="Toggle language"
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          locale === 'bn' ? 'translate-x-9' : 'translate-x-1'
        }`}
      />
      <span className="absolute left-2 text-xs font-medium text-gray-700 dark:text-gray-300">
        EN
      </span>
      <span className="absolute right-2 text-xs font-medium text-gray-700 dark:text-gray-300">
        বাং
      </span>
    </button>
  );
}
