'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Locale, WebsiteTranslations, CommonTranslations } from '@repo/locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <K extends keyof WebsiteTranslations>(namespace: K) => WebsiteTranslations[K];
  c: <K extends keyof CommonTranslations>(namespace: K) => CommonTranslations[K];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('airdreads-locale');
      return stored === 'en' || stored === 'bn' ? stored : 'en';
    }
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('airdreads-locale', newLocale);
    document.cookie = `airdreads-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = <K extends keyof WebsiteTranslations>(namespace: K): WebsiteTranslations[K] => {
    return translations[locale].website[namespace];
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
