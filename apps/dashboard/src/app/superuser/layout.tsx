'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, BookOpen, Users, Settings, Video, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/lib/zustand/auth-store';

const sidebarItems = [
  { label: 'Dashboard', href: '/superuser', icon: BarChart3 },
  { label: 'Courses', href: '/superuser/courses', icon: BookOpen },
  { label: 'Teachers', href: '/superuser/teachers', icon: Users },
  { label: 'Students', href: '/superuser/students', icon: GraduationCap },
  { label: 'Webinars', href: '/superuser/webinars', icon: Video },
  { label: 'Settings', href: '/superuser/settings', icon: Settings },
];

export default function SuperuserLayout({
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
      <aside className="w-64 bg-dark-blue text-white hidden md:flex md:flex-col shrink-0 h-screen sticky top-0">
        <Link
          href="/superuser"
          className="block p-6 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h1 className="text-xl font-bold">SuperAdmin</h1>
        </Link>
        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-vibrant-blue text-white'
                    : 'text-slate-300 hover:bg-vibrant-blue hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className="mx-4 mb-6 px-4 py-2 bg-red-700/50 text-white rounded-lg hover:bg-red-700/70 transition-colors w-[calc(100%-2rem)] cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="md:hidden mb-8 pb-4 border-b">
          <h1 className="text-xl font-bold text-slate-900">SuperAdmin Portal</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
