'use client';

import Link from 'next/link';
import { useLocale } from '../../providers/locale-provider';
import { LanguageToggle } from '../../components/utils/language-toggle';
import { ThemeToggle } from '../../components/utils/theme-toggle';

export default function Home() {
  const { t } = useLocale();
  const pageText = t('homepage');

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 items-center justify-center">
      <div className="absolute top-4 right-4 flex gap-4">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <h1 className="text-4xl font-sans">{pageText['welcome']}</h1>

      <div className="mt-8 flex gap-4">
        <Link
          href={'demo'}
          className="p-6 px-8 bg-background-main text-primary-foreground rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all border border-border flex items-center gap-2"
        >
          {pageText['seeDemo']}
        </Link>

        <button className="p-6 px-8 bg-primary text-primary-foreground rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
          {pageText['subscribe']}
        </button>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-background-main text-foreground rounded-lg border border-border hover:bg-secondary transition-all">
          {pageText['login']}
        </button>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
          {pageText['signup']}
        </button>
      </div>
    </div>
  );
}
