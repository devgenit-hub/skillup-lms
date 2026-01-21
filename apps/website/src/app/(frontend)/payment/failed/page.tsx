'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft, Clock, BanIcon } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemType = searchParams.get('itemType') || 'course';
  const itemId = searchParams.get('itemId') || '';
  const message = searchParams.get('message') || 'Payment could not be completed.';
  const reason = searchParams.get('reason') || 'cancelled';

  const statusMatch = reason.match(/payment_(\w+)/);
  const actualStatus = statusMatch?.[1]?.toUpperCase() ?? null;

  const isPending = actualStatus === 'PENDING' || reason === 'pending';
  const isCancelled = actualStatus === 'CANCELLED' || reason === 'cancelled';

  const getStatusConfig = () => {
    if (isPending) {
      return {
        icon: Clock,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        title: 'Payment Pending',
        statusText: 'Payment is PENDING',
        emoji: '⏳',
        description:
          'Your payment is still being processed. Please wait a few moments and check your account, or try completing the payment again.',
      };
    }
    if (isCancelled) {
      return {
        icon: BanIcon,
        iconColor: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        title: 'Payment Cancelled',
        statusText: 'Payment is CANCELLED',
        emoji: '🚫',
        description: 'You cancelled the payment process. You can try again anytime.',
      };
    }
    return {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-600 dark:text-red-400',
      title: 'Payment Failed',
      statusText: 'Payment is FAILED',
      emoji: '❌',
      description:
        'The payment could not be processed. Please try again or contact support if the issue persists.',
    };
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${config.bgColor}`}
          >
            <StatusIcon className={`w-14 h-14 ${config.iconColor}`} strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">{config.title}</h1>
        <p className="text-lg font-medium text-muted-foreground mb-4">{config.statusText}</p>

        {message && message !== config.statusText && (
          <p className="text-muted-foreground mb-6 text-sm">{message}</p>
        )}

        <div className={`border rounded-xl p-4 mb-6 ${config.bgColor} ${config.borderColor}`}>
          <p className={`text-sm ${config.textColor}`}>
            {config.emoji} {config.description}
          </p>
        </div>

        <div className="space-y-3">
          {itemId && (
            <button
              onClick={() =>
                router.push(
                  `/payment?${itemType === 'course' ? 'courseId' : 'webinarId'}=${itemId}`
                )
              }
              className="w-full bg-primary text-primary-foreground py-3.5 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          {itemId ? (
            <button
              onClick={() => {
                const targetPath =
                  itemType === 'course' ? `/course/${itemId}` : `/webinar/${itemId}`;
                router.push(targetPath);
              }}
              className="w-full bg-muted hover:bg-muted/80 text-foreground py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {itemType === 'course' ? 'Course' : 'Webinar'}
            </button>
          ) : (
            <button
              onClick={() => router.push(itemType === 'course' ? '/allcourse' : '/webinar')}
              className="w-full bg-muted hover:bg-muted/80 text-foreground py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to All {itemType === 'course' ? 'Courses' : 'Webinars'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
