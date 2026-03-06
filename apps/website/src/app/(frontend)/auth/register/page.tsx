import AuthForm from '@/components/shared/AuthForm/AuthForm';
import React from 'react';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import { registerFields } from '@/components/auth/RegisterFields';

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-12 md:py-16">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/30 p-8 md:p-10">
        <AuthFormHeader title="অ্যাকাউন্ট তৈরি করুন" />
        <AuthForm
          inputs={registerFields}
          isTermsChecked={true}
          submitButtonText="নিবন্ধন করুন"
          bottomSubText="আগে থেকেই অ্যাকাউন্ট আছে?"
          bottomLinkText="লগ ইন"
          bottomLinkTo="/auth/login"
        />
      </div>
    </div>
  );
}
