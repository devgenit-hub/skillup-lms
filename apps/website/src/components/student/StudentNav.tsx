'use client';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ThemeToggle } from '../utils/theme-toggle';
import { useAuthStore } from '@/lib/zustand/auth-store';
import { redirect } from 'next/navigation';

export default function StudentNav() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    redirect('/auth/login');
    return null;
  }

  const imageUrl = user.avatarUrl || '/test_images/avatar1.png';
  const name = user.name || user.email.split('@')[0] || 'User';
  return (
    <div className="h-full bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border py-4 px-5 lg:px-8 flex justify-between items-center transition-all duration-300 hover:shadow-xl">
      <Link
        href="/"
        className="px-3 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer bg-linear-to-br from-vibrant-blue to-indigo-600"
      >
        <Image
          className="brightness-0 invert w-auto h-auto max-w-20"
          src="/logodark.png"
          alt="Skill শিখো Logo"
          width={96}
          height={22}
          loading="eager"
          priority={true}
        />
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Theme Toggle */}
        <ThemeToggle
          className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center bg-muted/60 hover:bg-muted/80 transition-all duration-300 hover:shadow-md"
          iconClassName="h-4 w-4 lg:h-5 lg:w-5 text-amber-400 dark:text-amber-400 light:text-blue-800"
        />

        {/* Notification Button */}
        <button
          className="relative p-2.5 lg:p-3 rounded-2xl hover:bg-muted/50 transition-all duration-300 group hover:shadow-md"
          aria-label="Notifications"
          hidden
        >
          <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-vibrant-blue transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Profile Section */}
        <Link href="/student/profile" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-vibrant-blue to-indigo-600 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm group-hover:ring-1 group-hover:ring-vibrant-blue/70 transition-all">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 32px, 36px"
                loading="eager"
                priority={true}
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
