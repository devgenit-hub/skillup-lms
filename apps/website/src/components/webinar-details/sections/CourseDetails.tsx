import React from 'react';
import { AboutWebinarProps } from '../types/AboutCourseProps';
import RichTextDisplay from '@/components/ui/RichTextDisplay';

export default function WebinarDetails({ AboutWebinar }: AboutWebinarProps) {
  return (
    <div id="details" className="mt-20 scroll-m-20">
      <RichTextDisplay content={AboutWebinar.about} />
    </div>
  );
}
