'use client';

import { useLocale } from '@/providers/locale-provider';
import Link from 'next/link';
import { ArrowLeft, Info, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLocale();
  const pageText = t('about');

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-vibrant-blue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main content card */}
        <div className="relative bg-card backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 md:p-12 transition-all duration-300 hover:shadow-vibrant-blue/20">
          {/* Icon header */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-vibrant-blue/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative p-6 rounded-full bg-linear-to-br from-vibrant-blue to-indigo-600 shadow-lg">
                <Info className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Title section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-b from-[#C3C0D8] via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text mb-4">
              {pageText['page_title']}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">{pageText['page_subtitle']}</p>
          </div>

          {/* Coming Soon section */}
          <div className="bg-linear-to-br from-muted/50 to-muted/30 rounded-2xl p-8 md:p-10 mb-8 border border-border/50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-vibrant-blue animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {pageText['comingSoon_title']}
              </h2>
              <Sparkles className="w-6 h-6 text-vibrant-blue animate-pulse" />
            </div>
            <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed">
              {pageText['comingSoon_description']}
            </p>
          </div>

          {/* Progress dots animation */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-vibrant-blue animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-vibrant-blue animate-bounce delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-vibrant-blue animate-bounce delay-200"></div>
          </div>

          {/* Back button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-vibrant-blue to-indigo-600 text-white font-semibold shadow-lg hover:shadow-vibrant-blue/50 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {pageText['backToHome']}
            </Link>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="mt-8 h-1 w-full bg-linear-to-r from-transparent via-vibrant-blue to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
