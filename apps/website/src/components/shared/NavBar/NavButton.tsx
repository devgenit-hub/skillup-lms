'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/zustand/auth-store';
import { useLocale } from '@/providers/locale-provider';

export default function NavButton({ onClick }: { onClick?: () => void }) {
  const user = useAuthStore((state) => state.user);
  const isVerified = useAuthStore((state) => state.isVerified);
  const logout = useAuthStore((state) => state.logout);
  const { t } = useLocale();
  const pageText = t('auth');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(pageText['toast_logoutSuccess']);
    } catch {
      toast.error(pageText['toast_logoutError']);
    }
  };

  // If we have a verified STUDENT user, show their profile
  if (isVerified && user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          className="rounded-full py-3 px-4 flex items-center gap-2"
        >
          <Link href="/student/dashboard">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user.name || user.email}</span>
          </Link>
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="rounded-full py-3 px-3"
          title="লগ আউট"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Default: show login button
  return (
    <Button
      asChild
      className="bg-vibrant-blue hover:bg-dark-blue text-white rounded-full py-3 px-6 w-full text-lg"
      onClick={onClick}
    >
      <Link href="/auth/login">লগ ইন / সাইন আপ</Link>
    </Button>
  );
}
