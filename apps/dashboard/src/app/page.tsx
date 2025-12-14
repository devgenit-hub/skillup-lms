'use client';

import Link from 'next/link';
import { ShieldAlert, UserCog } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { useLocale } from '@/providers/locale-provider';

export default function Home() {
  const { t } = useLocale();
  const pageText = t('homepage');

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">{pageText['title']}</h1>
          <p className="text-slate-500 mt-2">{pageText['subtitle']}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl w-full">
          {/* Superuser Selection Card */}
          <Link href="/login?id=superuser" className="group">
            <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl flex flex-col items-center transition-all group-hover:border-vibrant-blue group-hover:shadow-md cursor-pointer h-full">
              <div className="bg-light-blue p-4 rounded-full text-dark-blue mb-4">
                <ShieldAlert size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{pageText['superuser_title']}</h2>
              <p className="text-center text-slate-500 mt-2">{pageText['superuser_desc']}</p>
              <span className="mt-6 text-vibrant-blue font-medium group-hover:underline">
                {pageText['superuser_action']}
              </span>
            </div>
          </Link>

          {/* Teacher Selection Card */}
          <Link href="/login?id=teacher" className="group">
            <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl flex flex-col items-center transition-all group-hover:border-emerald-500 group-hover:shadow-md cursor-pointer h-full">
              <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-4">
                <UserCog size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{pageText['teacher_title']}</h2>
              <p className="text-center text-slate-500 mt-2">{pageText['teacher_desc']}</p>
              <span className="mt-6 text-emerald-600 font-medium group-hover:underline">
                {pageText['teacher_action']}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
