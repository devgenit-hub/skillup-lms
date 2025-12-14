'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import React from 'react';

export default function NavButton() {
  return (
    <Button
      asChild
      className="bg-vibrant-blue hover:bg-dark-blue text-white rounded-full py-3 px-6 w-full"
    >
      <Link href="/auth/login">লগ ইন / সাইন আপ</Link>
    </Button>
  );
}
