import AuthFormHeader from '@/components/auth/AuthFormHeader';
import LeftImage from '@/components/auth/LeftImage';
import OTPInput from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function Page() {
  return (
    <div className="flex gap-10 px-16 py-4 h-fit justify-center bg-auth-background max-w-7xl mx-auto rounded-2xl my-24">
      <LeftImage src="/login.png" alt="Login Illutration" />
      <div className="flex flex-col justify-center w-1/2 h-fit">
        <AuthFormHeader
          title="OTP ভেরিফিকেশন"
          subTitle1="আপনার +88015******25 ইমেইলে একটি OTP পাঠানো হয়েছে।"
        />
        <div className="flex flex-col justify-center gap-10 w-full">
          <OTPInput />
          <span className="flex flex-col items-start gap-2">
            <span className="text-foreground/50">কোড আসেনি?</span>
            <span className="text-foreground underline">পুনরায় কোড পাঠান</span>
          </span>
          <br />
        </div>
        <div>
          <Button className="w-full tracking-wider py-5 text-[16px] bg-vibrant-blue font-semibold text-white hover:bg-dark-blue shadow-[0_5px_5px_0_rgba(0,0,0,0.25)] cursor-pointer">
            সাবমিট করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
