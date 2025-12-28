'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemType = searchParams.get('itemType') || 'course';
  const itemId = searchParams.get('itemId') || '';
  const message = searchParams.get('message') || 'Payment could not be completed.';
  const reason = searchParams.get('reason') || 'cancelled';

  const isCancelled = reason === 'cancelled';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${isCancelled ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}
          >
            {isCancelled ? (
              <AlertCircle className="w-14 h-14 text-yellow-500" strokeWidth={2.5} />
            ) : (
              <XCircle className="w-14 h-14 text-red-500" strokeWidth={2.5} />
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
        </h1>

        <p className="text-muted-foreground mb-6 text-sm">{message}</p>

        <div
          className={`border rounded-xl p-4 mb-6 ${isCancelled ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}
        >
          <p
            className={`text-sm ${isCancelled ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {isCancelled
              ? '⚠️ You cancelled the payment process. You can try again anytime.'
              : '❌ The payment could not be processed. Please try again or contact support if the issue persists.'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() =>
              router.push(`/payment?${itemType === 'course' ? 'courseId' : 'webinarId'}=${itemId}`)
            }
            className="w-full bg-primary text-primary-foreground py-3.5 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={() => router.push(`/${itemType}/${itemId}`)}
            className="w-full bg-muted hover:bg-muted/80 text-foreground py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {itemType === 'course' ? 'Course' : 'Webinar'}
          </button>
        </div>
      </div>
    </div>
  );
}
