'use client';

import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-blue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">স্বাগতম, {user.name || user.email}!</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">আপনার প্রোফাইল</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">ইমেইল:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">নাম:</span> {user.name || 'N/A'}
              </p>
              <p>
                <span className="font-medium">ভূমিকা:</span> {user.role}
              </p>
              <p>
                <span className="font-medium">ইমেইল যাচাই:</span>{' '}
                {user.emailVerified ? '✓ হ্যাঁ' : '✗ না'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">দ্রুত লিংক</h2>
            <div className="space-y-2">
              <Link href="/courses" className="block text-vibrant-blue hover:underline">
                কোর্সসমূহ
              </Link>
              <Link
                href="/dashboard/enrollments"
                className="block text-vibrant-blue hover:underline"
              >
                আমার এনরোলমেন্ট
              </Link>
              <Link href="/dashboard/profile" className="block text-vibrant-blue hover:underline">
                প্রোফাইল সম্পাদনা
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
