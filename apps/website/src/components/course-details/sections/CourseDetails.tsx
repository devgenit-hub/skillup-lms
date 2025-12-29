import React from 'react';
import { AboutCourseProps } from '../types/AboutCourseProps';
import RichTextDisplay from '@/components/ui/RichTextDisplay';

export default function CourseDetails({ AboutCourse }: AboutCourseProps) {
  return (
    <div id="details" className="mt-20 scroll-m-20">
      <RichTextDisplay content={AboutCourse.details} />
    </div>
  );
}
