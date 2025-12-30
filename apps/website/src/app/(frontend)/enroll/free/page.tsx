'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function FreeEnrollPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const type = searchParams.get('type') as 'course' | 'webinar' | null;
  const id = searchParams.get('id');

  useEffect(() => {
    const enrollFree = async () => {
      if (!type || !id) {
        setStatus('error');
        setErrorMessage('Invalid enrollment parameters');
        return;
      }

      try {
        const result = await apiClient.enrollFree({ itemType: type, itemId: id });

        if (result.success) {
          setStatus('success');
          setTimeout(() => {
            router.push(
              `/payment/success?itemType=${type}&itemId=${id}&message=${encodeURIComponent(
                type === 'course' ? 'এনরোলমেন্ট সফল হয়েছে!' : 'রেজিস্ট্রেশন সফল হয়েছে!'
              )}`
            );
          }, 1500);
        } else {
          throw new Error(result.message || 'Enrollment failed');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'এনরোলমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
        );
      }
    };

    enrollFree();
  }, [type, id, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">এনরোল হচ্ছে...</h1>
          <p className="text-muted-foreground">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">সফল!</h1>
          <p className="text-muted-foreground">রিডাইরেক্ট হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">এনরোলমেন্ট ব্যর্থ</h1>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <button
          onClick={() => router.back()}
          className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all"
        >
          পুনরায় চেষ্টা করুন
        </button>
      </div>
    </div>
  );
}
