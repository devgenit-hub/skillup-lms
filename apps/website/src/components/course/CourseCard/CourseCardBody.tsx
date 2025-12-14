'use client';

import React from 'react';
import { BookIcon, CircleUser } from 'lucide-react';

export default function CourseCardBody({
  category,
  title,
  studentsEnrolled,
  totalSessions,
}: {
  category: string;
  title: string;
  studentsEnrolled: string;
  totalSessions: string;
}) {
  return (
    <div className="flex flex-col px-3 py-2 h-full">
      <span className="text-sm  text-primary/50">{category}</span>
      <span className="text-xl font-bold">{title}</span>
      <div className="flex items-center justify-between pr-2 gap-2 text-sm mt-auto">
        <span className="flex items-center gap-1">
          <CircleUser className="size-4"></CircleUser>
          <span className="font-bold">{studentsEnrolled}</span> জন ভর্তি
        </span>
        <span className="inline-flex items-center">
          <BookIcon className="size-4"></BookIcon>
          <span className="font-bold">{totalSessions}</span>টি সেশন
        </span>
      </div>
    </div>
  );
}
