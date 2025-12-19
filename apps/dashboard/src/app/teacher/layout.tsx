'use client';

// src/app/teacher/layout.js
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Home, Settings } from 'lucide-react';
import { ReactNode } from 'react';
import { useAuthStore } from '@/lib/zustand/auth-store';

// Different styling for Teacher sidebar (Emerald/Green theme)
export default function TeacherLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 px-3 bg-emerald-900 text-emerald-50 hidden md:flex md:flex-col shrink-0 h-screen sticky top-0">
        <Link
          href="/teacher"
          className="block p-6 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h1 className="text-xl font-bold">Teacher Portal</h1>
        </Link>
        <nav className="mt-6 flex-1 overflow-y-auto">
          <Link
            href="/teacher"
            className={`flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
              pathname === '/teacher'
                ? 'bg-emerald-800 text-white'
                : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span>My Dashboard</span>
          </Link>
          <Link
            href="/teacher/settings"
            className={`flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
              pathname === '/teacher/settings'
                ? 'bg-emerald-800 text-white'
                : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <div className="px-4 py-3 text-sm text-emerald-400 uppercase font-bold mt-6">
            My Courses
          </div>
          {/* In a real app, we would dynamically list courses here */}
          <Link
            href="/teacher/course/c1"
            className={`flex items-center space-x-3 px-4 py-2 mb-1 rounded-lg transition-colors text-sm truncate ${
              pathname.startsWith('/teacher/course')
                ? 'bg-emerald-800 text-white'
                : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
            }`}
          >
            <BookOpen size={18} />
            <span>Intro to React</span>
          </Link>
        </nav>

        <button
          className="px-4 py-2 mb-6 bg-red-700/50 text-white rounded-lg hover:bg-red-700/70 transition-colors w-full cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto bg-slate-50">
        <Link
          href="/teacher"
          className="md:hidden mb-8 pb-4 border-b text-emerald-900 block cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h1 className="text-xl font-bold">Teacher Portal</h1>
        </Link>
        {children}
      </main>
    </div>
  );
}
