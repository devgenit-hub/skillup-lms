'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const itemType = searchParams.get('itemType') || 'course';
  const itemId = searchParams.get('itemId') || '';
  const message = searchParams.get('message') || 'Payment completed successfully!';

  useEffect(() => {
    if (!itemId) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const targetPath =
            itemType === 'course' ? `/student/class/${itemId}` : `/student/webinar/${itemId}`;
          router.push(targetPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [itemType, itemId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={2.5} />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-bounce" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">Payment Successful!</h1>

        <p className="text-muted-foreground mb-6 text-sm">{message}</p>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            ✨{' '}
            {itemType === 'course'
              ? 'You are now enrolled in this course!'
              : 'You are now registered for this webinar!'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 mb-6">
          <p className="text-xs text-muted-foreground">
            Redirecting to your {itemType} in{' '}
            <span className="font-bold text-foreground text-base">{countdown}</span> seconds...
          </p>
        </div>

        <button
          onClick={() => {
            const targetPath =
              itemType === 'course' ? `/student/class/${itemId}` : `/student/webinar/${itemId}`;
            router.push(targetPath);
          }}
          className="w-full bg-primary text-primary-foreground py-3.5 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Go to {itemType === 'course' ? 'Course' : 'Webinar'} Now →
        </button>
      </div>
    </div>
  );
}
