'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Locale, DashboardTranslations, CommonTranslations } from '@repo/locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <K extends keyof DashboardTranslations>(namespace: K) => DashboardTranslations[K];
  c: <K extends keyof CommonTranslations>(namespace: K) => CommonTranslations[K];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale = 'en' }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('skillup-dashboard-locale') as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    } else {
      // Save default locale
      localStorage.setItem('skillup-dashboard-locale', initialLocale);
      document.cookie = `skillup-dashboard-locale=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('skillup-dashboard-locale', newLocale);
    document.cookie = `skillup-dashboard-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = <K extends keyof DashboardTranslations>(namespace: K): DashboardTranslations[K] => {
    return translations[locale].dashboard[namespace];
  };

  const c = <K extends keyof CommonTranslations>(namespace: K): CommonTranslations[K] => {
    return translations[locale].common[namespace];
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, c }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
