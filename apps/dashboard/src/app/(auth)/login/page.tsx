'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, UserCog, ArrowRight } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/zustand/auth-store';
import { UserRole } from '@repo/shared';

export default function LoginPage() {
  const [role, setRole] = useState('superuser');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginType = searchParams.get('id');
  const { t } = useLocale();
  const pageText = t('auth');
  const homepageText = t('homepage');
  const { refreshUser } = useAuthStore();

  useEffect(() => {
    if (loginType === 'teacher') setRole('teacher');
    else setRole('superuser');
  }, [loginType]);

  // Don't auto-redirect if user already logged in - let them choose to login as different role or continue

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      await refreshUser();
      const currentUser = useAuthStore.getState().user;

      if (
        !currentUser ||
        (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.INSTRUCTOR)
      ) {
        setError('Access denied. Admin or instructor role required.');
        await useAuthStore.getState().logout();
        return;
      }

      router.replace(currentUser.role === UserRole.ADMIN ? '/superuser' : '/teacher');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isSuper = role === 'superuser';
  const buttonClass = isSuper
    ? 'bg-dark-blue hover:bg-vibrant-blue'
    : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{pageText['welcome_back']}</h1>
        <p className="text-slate-500 mt-2">{pageText['signin_subtitle']}</p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setRole('superuser')}
          className={`flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all ${
            role === 'superuser'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldAlert size={16} className={role === 'superuser' ? 'text-vibrant-blue' : ''} />
          <span>{homepageText['superuser_title']}</span>
        </button>
        <button
          onClick={() => setRole('teacher')}
          className={`flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all ${
            role === 'teacher'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCog size={16} className={role === 'teacher' ? 'text-emerald-600' : ''} />
          <span>{homepageText['teacher_title']}</span>
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {pageText['email_label']}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all ${
              isSuper ? 'focus:ring-vibrant-blue' : 'focus:ring-emerald-600'
            }`}
            placeholder={pageText['email_placeholder']}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">
              {pageText['password_label']}
            </label>
            {/* <a
              href="#"
              className={`text-xs font-medium hover:underline ${
                isSuper ? 'text-vibrant-blue' : 'text-emerald-600'
              }`}
            >
              {pageText['forgot_password']}
            </a> */}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all ${
              isSuper ? 'focus:ring-vibrant-blue' : 'focus:ring-emerald-600'
            }`}
            placeholder={pageText['password_placeholder']}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${buttonClass} disabled:opacity-50`}
        >
          {loading ? 'Signing in...' : pageText['signin_button']}{' '}
          <ArrowRight size={18} className="ml-2" />
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        {pageText['no_account']}{' '}
        <Link
          href="/signup"
          className={`font-medium hover:underline ${
            isSuper ? 'text-vibrant-blue' : 'text-emerald-600'
          }`}
        >
          {pageText['signup_link']}
        </Link>
      </div>
    </div>
  );
}
