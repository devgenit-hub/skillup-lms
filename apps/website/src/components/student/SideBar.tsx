'use client';
import { LayoutDashboard, LogOut, NotebookPen, BookText, UserPen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function SideBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  const menuItems = [
    {
      path: '/student/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/student/mycourse',
      icon: NotebookPen,
      label: 'My Courses',
    },
    {
      path: '/student/allcourse',
      icon: BookText,
      label: 'All Course',
    },
    {
      path: '/student/profile',
      icon: UserPen,
      label: 'Profile',
    },
  ];

  return (
    <nav
      className="h-full bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-5 lg:p-6 flex flex-col transition-all duration-300"
      aria-label="Student sidebar"
    >
      {/* Navigation Menu */}
      <ul className="w-full flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full transition-all duration-300 relative overflow-hidden ${
                  active
                    ? 'bg-gradient-to-r from-vibrant-blue to-indigo-600 text-white shadow-lg scale-[1.02]'
                    : 'text-foreground hover:bg-muted hover:shadow-md'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {/* Animated background on hover */}
                <div
                  className={`absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    active ? 'hidden' : ''
                  }`}
                ></div>

                <Icon
                  className={`relative z-10 transition-transform duration-300 ${
                    active ? '' : 'group-hover:scale-110'
                  }`}
                  size={16}
                />
                <span className="relative z-10 font-medium text-sm xl:text-base">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="mt-6 pt-6 border-t border-border">
        <Link
          href="/logout"
          className="group flex items-center gap-3 px-4 py-3.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl w-full transition-all duration-300 hover:shadow-md relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-100 dark:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative z-10 font-medium text-sm lg:text-base">Logout</span>
        </Link>
      </div>
    </nav>
  );
}
