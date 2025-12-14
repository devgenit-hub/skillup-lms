'use client';

import { Input } from '@/components/ui/input';

export default function SearchBar({
  name,
  placeholder,
  Icon,
}: {
  name?: string;
  placeholder?: string;
  Icon?: React.ElementType;
}) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 bottom-1/2 translate-y-1/2 text-foreground font-bold">
          <Icon className="size-4 font-black" />
        </span>
      )}
      <Input
        name={name}
        placeholder={placeholder || 'অনুসন্ধান'}
        className={`${Icon ? 'pl-8' : ''} placeholder:text-foreground my-auto`}
      />
    </div>
  );
}
