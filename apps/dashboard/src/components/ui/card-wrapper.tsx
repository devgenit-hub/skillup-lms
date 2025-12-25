import React from 'react';
import { cn } from '@/lib/utils';

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardWrapper({ children, className, ...props }: CardWrapperProps) {
  return (
    <div
      className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
