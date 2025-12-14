'use client';

import Link from 'next/link';
import './globals.css';
import React from 'react';
import { useLocale } from '@/providers/locale-provider';

interface ButtonProps {
  asChild?: boolean;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode | React.HTMLAttributeAnchorTarget;
}
const Button = ({ asChild, size, children }: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  const classes = `${baseClasses} ${size ? sizeClasses[size] : sizeClasses.md}`;
  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as { className?: string };
    return React.cloneElement(children, {
      className: `${childProps.className ? childProps.className + ' ' : ''}${classes}`,
    } as React.Attributes);
  }

  return <button className={classes}>{children}</button>;
};

function NotFoundContent() {
  const { t } = useLocale();
  const pageText = t('notfound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">{pageText['title']}</h1>
          <h2 className="text-3xl font-semibold text-foreground">{pageText['oops']}</h2>
        </div>

        <p className="text-lg text-muted-foreground">{pageText['message']}</p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link href="/">{pageText['back_home']}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/superuser">{pageText['back_dashboard']}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <html>
      <body className="antialiased">
        <NotFoundContent />
      </body>
    </html>
  );
}
