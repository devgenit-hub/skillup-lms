import React from 'react';
import Markdown from 'react-markdown';
import { AboutCourseProps } from '../types/AboutCourseProps';

export default function CourseDetails({ AboutCourse }: AboutCourseProps) {
  return (
    <div className="mt-20">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-6 mb-3 text-black dark:text-white">{children}</h2>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-4 space-y-2 text-black dark:text-white">{children}</ul>
          ),
          li: ({ children }) => <li className="ml-4 leading-relaxed">{children}</li>,
          p: ({ children }) => (
            <p className="my-4 leading-relaxed text-black dark:text-white">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-black dark:text-white">{children}</strong>
          ),
        }}
      >
        {AboutCourse.about}
      </Markdown>
    </div>
  );
}
