import React from 'react';
import { LinksProps } from '../types/LinksProps';
import { AboutCourseProps } from '../types/AboutCourseProps';
import CourseDetails from './CourseDetails';
import Teachers from './Teachers';
import ProgramSyllabus from './ProgramSyllabus';
import Prospectus from './Prospectus';
import FaQCards from './FaQCards';

const links: LinksProps[] = [
  { text: 'বিবরণ', link: '#details' },
  { text: 'শিক্ষক', link: '#teachers' },
  { text: 'পাঠ্যসূচি', link: '#curriculum' },
  { text: 'রুটিন', link: '#routine' },
];

interface MainContentProps extends AboutCourseProps {
  teachers?: Array<{
    id: string;
    name: string;
    profileImage: string | null;
    specialization: string | null;
  }>;
  curriculum?: Array<{
    id: string;
    title: string;
    details: string | null;
    order: number;
    classesCount: number;
    materialsCount: number;
  }>;
  classRoutinePdf?: string | null;
  contactNumbers?: string[];
  facebookGroupLink?: string | null;
  introVideoLink?: string | null;
}

export default function MainContent({
  AboutCourse,
  teachers,
  curriculum,
  classRoutinePdf,
  contactNumbers,
  facebookGroupLink,
  introVideoLink,
}: MainContentProps) {
  return (
    <div className="lg:col-span-2 z-30">
      <ul className="absolute -top-8 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-fit max-w-[95%] lg:max-w-none py-2 sm:py-4 px-2 sm:px-4 md:px-16 bg-white dark:bg-dark-blue/10 backdrop-blur-xl border-2 border-border rounded-full flex justify-center items-center text-xs sm:text-base md:text-xl text-foreground overflow-x-auto">
        {links.map((link, i) => (
          <React.Fragment key={i}>
            <li className="shrink-0">
              <a
                href={link.link}
                className="px-2 sm:px-4 md:px-6 font-bold transition duration-200 hover:underline underline-offset-4 whitespace-nowrap"
              >
                {link.text}
              </a>
            </li>
            {/* Divider (except after last item) */}
            {i < links.length - 1 && (
              <li className="shrink-0">
                <span className="h-4 sm:h-5 w-px bg-foreground/30 mx-1 sm:mx-2 block" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>

      <CourseDetails AboutCourse={AboutCourse} />
      <Teachers teachers={teachers} />
      <ProgramSyllabus curriculum={curriculum} />
      <Prospectus classRoutinePdf={classRoutinePdf} />
      <FaQCards
        contactNumbers={contactNumbers}
        facebookGroupLink={facebookGroupLink}
        introVideoLink={introVideoLink}
      />
    </div>
  );
}
