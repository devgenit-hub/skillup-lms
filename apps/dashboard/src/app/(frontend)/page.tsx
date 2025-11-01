'use client';

import { ThemeToggle } from '../../components/utils/theme-toggle';
import { LanguageToggle } from '../../components/utils/language-toggle';
import { useLocale } from '../../providers/locale-provider';
import { Button } from '@repo/ui/button';

export default function Home() {
  const { t } = useLocale();
  const pageText = t('homepage');
  const buttons = t('buttons');

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold">{pageText['welcome']}</h1>

        <div className="flex gap-4 justify-center">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="space-y-4 mt-12">
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
              {buttons['add']}
            </button>
            <button className="px-6 py-3 bg-background-main text-foreground rounded-lg border border-border hover:bg-secondary transition-all">
              {buttons['edit']}
            </button>
            <button className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all">
              {buttons['delete']}
            </button>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button
              appName="Dashboard"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-all font-medium"
            >
              {buttons['save']} (Shared UI)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
