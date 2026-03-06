import Image from 'next/image';
import React from 'react';
import { AuthFormHeaderProps } from './AuthFormHeaderProps';

export default function AuthFormHeader(props: AuthFormHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <Image
        src="/logodark.png"
        alt="SkillShikho Logo"
        width={120}
        height={40}
        className="mb-6 dark:invert-0 invert"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-vibrant-blue">{props.title}</h1>
    </div>
  );
}
