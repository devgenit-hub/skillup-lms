import React from 'react';
import { AboutCourseProps } from '../types/AboutCourseProps';
import RichTextDisplay from '@/components/ui/RichTextDisplay';

export default function CourseDetails({ AboutCourse }: AboutCourseProps) {
  return (
    <div id="details" className="mt-20 scroll-m-20">
      <RichTextDisplay
        className="w-full wrap-break-word whitespace-break-spaces whitespace-pre-wrap"
        content={AboutCourse.details}
      />
    </div>
  );
}
