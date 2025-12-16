import React from 'react';

type PingIndicatorProps = {
  bgClass?: string;
  sizeClasses?: string;
  dotSizeClasses?: string;
  className?: string;
};

export default function PingIndicator({
  bgClass = 'bg-destructive',
  sizeClasses = 'size-2',
  dotSizeClasses = 'size-2',
  className = '',
}: PingIndicatorProps) {
  return (
    <span className={`relative flex ${sizeClasses} ${className}`}>
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${bgClass} opacity-50 animate-ping`}
      />
      <span className={`relative inline-flex ${dotSizeClasses} rounded-full ${bgClass}`} />
    </span>
  );
}
