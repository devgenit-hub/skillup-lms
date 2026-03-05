'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function Navbar() {
  const pathname = usePathname();

  // Helper to check active state
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-white border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center -space-x-1">
          <div className="p-2">
            <Image
              className="h-fit object-cover"
              width={96}
              height={(96 * 9) / 16}
              fill={false}
              src={'/logolight.png'}
              alt="Skill শিখো logo"
            />
          </div>
          <sup className="text-xs font-bold text-slate-900">Admin</sup>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-dark-blue' : 'text-slate-500 hover:text-dark-blue'
            }`}
          >
            Home
          </Link>

          <div className="h-4 w-px bg-slate-200"></div>

          <Link href="/login">
            <button className="text-sm font-medium text-slate-600 hover:text-dark-blue transition-colors cursor-pointer">
              Log in
            </button>
          </Link>
          {/* 
          <Link href="/signup">
            <button className="text-sm font-medium bg-dark-blue text-white px-4 py-2 rounded-lg hover:bg-vibrant-blue transition-colors">
              Sign up
            </button>
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
