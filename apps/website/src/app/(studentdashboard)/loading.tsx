'use client';

import { useLocale } from '@/providers/locale-provider';

export default function Loading() {
  const { t } = useLocale();
  const pageText = t('student');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-vibrant-blue border-t-transparent"></div>
        <p className="text-sm text-foreground/70">{pageText.loading}</p>
      </div>
    </div>
  );
}
