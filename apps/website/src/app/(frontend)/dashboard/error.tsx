'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold">কিছু ভুল হয়েছে</h2>
        <p className="text-muted-foreground">
          আপনার সেশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>আবার চেষ্টা করুন</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/auth/login')}>
            লগইন পেজে যান
          </Button>
        </div>
      </div>
    </div>
  );
}
