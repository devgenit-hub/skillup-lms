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

        // Check for redirect parameter
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(decodeURIComponent(redirectUrl));
        } else {
          router.push('/student/dashboard');
        }
        router.refresh();
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 h-full">
      <div className="flex flex-col gap-2">
        {props.inputs &&
          props.inputs.map((inputProps, index) => <FormInput key={index} {...inputProps} />)}
        {props.isForgotPassword && (
          <span className="text-primary/50 text-sm underline mt-3 cursor-pointer">
            পাসওয়ার্ড ভুলে গেছেন?
          </span>
        )}
        <span className="text-primary/50 text-sm mt-3">
          {props.isTermsChecked && (
            <span>
              <Input type="checkbox" className="mr-2 w-4 h-4 align-middle" required />
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
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full tracking-wider py-5 text-[16px] bg-vibrant-blue font-semibold text-white hover:bg-dark-blue shadow-[0_5px_5px_0_rgba(0,0,0,0.25)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'অপেক্ষা করুন...' : props.submitButtonText || 'প্রবেশ করুন'}
        </Button>
        <span className="text-foreground/50">অথবা</span>
        <Button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          variant={'outline'}
          className="w-full rounded-full py-5 bg-foreground hover:bg-foreground/50 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src={`/icons/google_logo.png`} alt="Google Logo" width={16} height={16} />
          <span className="text-[16px] text-white">Google</span>
        </Button>
      </div>
    </form>
  );
}
