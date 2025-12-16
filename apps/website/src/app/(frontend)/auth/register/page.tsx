import AuthForm from '@/components/shared/AuthForm/AuthForm';
import React from 'react';
import LeftImage from '@/components/auth/LeftImage';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import { registerFields } from '@/components/auth/RegisterFields';

export default function Page() {
  return (
    <div className="flex w-full max-w-5xl h-fit justify-between bg-vibrant-blue/10 backdrop-blur-2xl mx-auto rounded-2xl my-12 relative overflow-hidden">
      <div className="absolute w-full h-full bg-gradient-to-br from-vibrant-blue/60 to-purple-200 dark:to-purple-900/60 blur -z-10"></div>
      <LeftImage src="/login.png" alt="Login Illutration" />
      <div className="flex flex-col justify-center h-fit py-10 px-6 mx-auto">
        <AuthFormHeader
          title="অ্যাকাউন্ট তৈরি করুন"
          subTitle1="আগে থেকেই অ্যাকাউন্ট আছে?"
          linkText="লগ ইন"
          linkTo="/auth/login"
        />
        <div className="flex flex-col gap-3 justify-center h-2/3">
          <AuthForm inputs={registerFields} isTermsChecked={true} submitButtonText="নিবন্ধন করুন" />
        </div>
      </div>
    </div>
  );
}
