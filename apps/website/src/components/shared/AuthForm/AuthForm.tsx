'use client';

import React, { useState } from 'react';
import { AuthFormProps } from './AuthFormProps';
import FormInput from './FormInput';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from '@/providers/locale-provider';

export default function AuthForm(props: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { t } = useLocale();
  const pageText = t('auth');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (props.isTermsChecked) {
        const repeatPassword = formData.get('repeatPassword') as string;
        if (password !== repeatPassword) {
          toast.error(pageText['toast_passwordMismatch']);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(pageText['toast_emailAlreadyRegistered']);
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success(pageText['toast_accountCreated']);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error(pageText['toast_invalidCredentials']);
          } else if (error.message.includes('Email not confirmed')) {
            toast.error(pageText['toast_emailNotConfirmed']);
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success(pageText['toast_loginSuccess']);

        // Wait a bit for auth state to propagate before redirecting
        await new Promise((resolve) => setTimeout(resolve, 500));

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          window.location.href = decodeURIComponent(redirectUrl);
        } else {
          router.push('/student/dashboard');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || pageText['toast_somethingWrong']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      // Get redirect parameter to pass through OAuth callback
      const redirectUrl = searchParams.get('redirect');
      const callbackUrl = redirectUrl
        ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`
        : `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        toast.error(error.message);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || pageText['toast_somethingWrong']);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {props.inputs &&
          props.inputs.map((inputProps, index) => <FormInput key={index} {...inputProps} />)}
        {props.isForgotPassword && (
          <Link
            href="#"
            className="text-vibrant-blue hover:text-vibrant-blue/80 text-sm font-medium mt-1 transition-colors duration-200 w-fit"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        )}
        {props.isTermsChecked && (
          <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2 cursor-pointer select-none">
            <Input type="checkbox" className="w-4 h-4 rounded accent-vibrant-blue" required />
            <span>
              <Link href={'#'} className="text-vibrant-blue hover:underline transition-colors">
                শর্তাবলী
              </Link>{' '}
              ও{' '}
              <Link href={'#'} className="text-vibrant-blue hover:underline transition-colors">
                নীতি
              </Link>{' '}
              মেনে চলতে সম্মত
            </span>
          </label>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 mt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-6 text-[16px] bg-vibrant-blue font-semibold text-white rounded-xl hover:bg-vibrant-blue/90 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'অপেক্ষা করুন...' : props.submitButtonText || 'প্রবেশ করুন'}
        </Button>

        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <span className="text-gray-400 dark:text-gray-500 text-sm">অথবা</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        <Button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          variant={'outline'}
          className="w-full rounded-xl py-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Image src={`/icons/google_logo.png`} alt="Google Logo" width={18} height={18} />
          <span className="text-[16px] font-medium">Google</span>
        </Button>

        {props.bottomLinkText && props.bottomLinkTo && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {props.bottomSubText}{' '}
            <Link
              href={props.bottomLinkTo}
              className="text-vibrant-blue font-semibold hover:underline transition-all duration-200"
            >
              {props.bottomLinkText}
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
