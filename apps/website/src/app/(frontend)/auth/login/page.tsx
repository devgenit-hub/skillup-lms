'use client';

import { loginFields } from '@/components/auth/LoginFields';
import AuthForm from '@/components/shared/AuthForm/AuthForm';
import React, { useEffect } from 'react';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from '@/providers/locale-provider';
import { useAuthStore } from '@/lib/zustand/auth-store';
import { clearAuthCookies } from '@/app/(auth)/actions';
import { createClient } from '@/lib/supabase/client';

export default function Page() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const { t } = useLocale();
  const pageText = t('auth');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (confirmed === 'true') {
      toast.success(pageText['toast_emailConfirmed']);
    }
  }, [confirmed, pageText]);

  // Clear cookies if user lands on login page without being logged in
  useEffect(() => {
    if (!user) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // No session, make sure cookies are cleared
          clearAuthCookies();
        }
      });
    }
  }, [user]);
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-12 md:py-20">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/30 p-8 md:p-10">
        <AuthFormHeader title="অ্যাকাউন্টে প্রবেশ করুন" />
        <AuthForm
          inputs={loginFields}
          isForgotPassword={true}
          bottomSubText="অ্যাকাউন্ট নেই?"
          bottomLinkText="রেজিস্টার করুন"
          bottomLinkTo="/auth/register"
        />
      </div>
    </div>
  );
}
