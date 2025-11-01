import enWebsite from './en/website.json';
import enDashboard from './en/dashboard.json';
import enCommon from './en/common.json';

export type WebsiteTranslations = typeof enWebsite;
export type DashboardTranslations = typeof enDashboard;
export type CommonTranslations = typeof enCommon;

export type Locale = 'en' | 'bn';

export type TranslationKey<T> = keyof T;
