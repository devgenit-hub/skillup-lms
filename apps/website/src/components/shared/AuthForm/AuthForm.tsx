'use client';

import React from 'react';
import Form from 'next/form';
import { AuthFormProps } from './AuthFormProps';
import FormInput from './FormInput';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function AuthForm(props: AuthFormProps) {
  return (
    <Form action={''} className="flex flex-col gap-2 h-full">
      <div className="flex flex-col gap-2">
        {props.inputs &&
          props.inputs.map((inputProps, index) => <FormInput key={index} {...inputProps} />)}
        {props.isForgotPassword && (
          <span className="text-primary/50 text-sm underline mt-3">পাসওয়ার্ড ভুলে গেছেন?</span>
        )}
        <span className="text-primary/50 text-sm mt-3">
          {props.isTermsChecked && (
            <span>
              <Input type="checkbox" className="mr-2 w-4 h-4 align-middle" />
              <span>
                <Link href={'#'} className="underline">
                  শর্তাবলী
                </Link>{' '}
                ও{' '}
                <Link href={'#'} className="underline">
                  নীতি
                </Link>{' '}
                মেনে চলতে সম্মত
              </span>
            </span>
          )}
        </span>
      </div>
      <div className="flex flex-col items-center gap-5">
        <Button className="w-full tracking-wider py-5 text-[16px] bg-vibrant-blue font-semibold text-white hover:bg-dark-blue shadow-[0_5px_5px_0_rgba(0,0,0,0.25)] cursor-pointer">
          {props.submitButtonText || 'প্রবেশ করুন'}
        </Button>
        <span className="text-foreground/50">অথবা</span>
        <Button
          variant={'outline'}
          className="w-full rounded-full py-5 bg-foreground hover:bg-foreground/50 flex items-center justify-center gap-3 cursor-pointer "
        >
          <Image src={`/icons/google_logo.png`} alt="Google Logo" width={16} height={16} />
          <span className="text-[16px] text-white">Google</span>
        </Button>
      </div>
    </Form>
  );
}
