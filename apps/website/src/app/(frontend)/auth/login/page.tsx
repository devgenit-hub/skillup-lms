'use client';

import { loginFields } from '@/components/auth/LoginFields';
import AuthForm from '@/components/shared/AuthForm/AuthForm';
import React, { useEffect } from 'react';
import LeftImage from '@/components/auth/LeftImage';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from '@/providers/locale-provider';

export default function Page() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const { t } = useLocale();
  const pageText = t('auth');

  useEffect(() => {
    if (confirmed === 'true') {
      toast.success(pageText['toast_emailConfirmed']);
    }
  }, [confirmed, pageText]);
  return (
    <div className="flex w-full max-w-5xl h-fit justify-between bg-vibrant-blue/10 backdrop-blur-2xl mx-auto rounded-2xl my-24 relative overflow-hidden">
      <div className="absolute w-full h-full bg-linear-to-br from-vibrant-blue/60 to-purple-200 dark:to-purple-900/60 blur -z-10"></div>

      <LeftImage src="/login.png" alt="Login Illutration" />
      <div className="flex flex-col justify-center h-fit py-10 px-6 mx-auto">
        <AuthFormHeader
          title="অ্যাকাউন্টে প্রবেশ করুন"
          subTitle1="অ্যাকাউন্ট নেই?"
          linkText="রেজিস্টার করুন"
          linkTo="/auth/register"
        />
        <div className="flex flex-col gap-3 justify-center h-2/3">
          <AuthForm inputs={loginFields} isForgotPassword={true} />
        </div>
      </div>
    </div>
  );
}
