import Link from 'next/link';
import React from 'react';
import { AuthFormHeaderProps } from './AuthFormHeaderProps';

export default function AuthFormHeader(props: AuthFormHeaderProps) {
  return (
    <div>
      <span className="text-4xl">{props.title}</span>
      <span className="mt-2 mb-6 flex gap-2 ">
        <span className="font-light text-foreground/50">{props.subTitle1}</span>
        <Link href={props.linkTo || '/auth/login'} className="underline">
          {props.linkText}
        </Link>
      </span>
    </div>
  );
}
