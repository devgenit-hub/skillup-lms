'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, UserCog } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';

export default function SignupPage() {
  const [role, setRole] = useState('superuser');
  const { t } = useLocale();
  const pageText = t('auth');
  const homepageText = t('homepage');

  const isSuper = role === 'superuser';
  const buttonClass = isSuper
    ? 'bg-dark-blue hover:bg-vibrant-blue'
    : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{pageText['signup_title']}</h1>
        <p className="text-slate-500 mt-2">{pageText['signup_subtitle']}</p>
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

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {pageText['fullname_label'].split(' ')[0]}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all focus:ring-vibrant-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {pageText['fullname_label'].split(' ').slice(1).join(' ') || 'Name'}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all focus:ring-vibrant-blue"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {pageText['email_label']}
          </label>
          <input
            type="email"
            placeholder={pageText['email_placeholder']}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all focus:ring-vibrant-blues"
            required
          />
        </div>

        {!isSuper && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {pageText['department_label']}
            </label>
            <select className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all focus:ring-emerald-600">
              <option>Computer Science</option>
              <option>Design</option>
              <option>Business</option>
            </select>
          </div>
        )}

        {isSuper && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {pageText['admin_code_label']}
            </label>
            <input
              type="password"
              placeholder={pageText['admin_code_placeholder']}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all focus:ring-vibrant-blue"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {pageText['password_label']}
          </label>
          <input
            type="password"
            placeholder={pageText['password_placeholder']}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all focus:ring-vibrant-blue"
            required
          />
        </div>

        <button
          type="button"
          className={`w-full py-2.5 text-white font-medium rounded-lg transition-colors ${buttonClass}`}
        >
          {pageText['signup_button']}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        {pageText['have_account']}{' '}
        <Link
          href="/login"
          className={`font-medium hover:underline ${
            isSuper ? 'text-vibrant-blue' : 'text-emerald-600'
          }`}
        >
          {pageText['signin_link']}
        </Link>
      </div>
    </div>
  );
}
