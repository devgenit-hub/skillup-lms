'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useLocale } from '@/providers/locale-provider';

export default function SearchBar({
  name,
  placeholder,
  Icon,
}: {
  name?: string;
  placeholder?: string;
  Icon?: React.ElementType;
}) {
  const { t } = useLocale();
  const pageText = t('search');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${isFocused ? 'w-64 md:w-80 not-lg:w-full' : 'w-48 md:w-64'} mx-auto`}
    >
      {Icon && (
        <span className="absolute left-3 bottom-1/2 translate-y-1/2 text-foreground font-bold pointer-events-none z-10">
          <Icon className="size-4 font-black" />
        </span>
      )}
      <Input
        name={name}
        placeholder={placeholder || pageText['placeholder']}
        className={`${Icon ? 'pl-8' : ''} placeholder:text-foreground my-auto transition-all duration-300`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
