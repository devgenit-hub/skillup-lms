import React from 'react';
import { LinksProps } from '../types/LinksProps';
import { AboutWebinarProps } from '../types/AboutCourseProps';
import WebinarDetails from './CourseDetails';
import Speakers from './Speakers';
import SessionAgenda from './SessionAgenda';
import Resources from './Resources';

const links: LinksProps[] = [
  { text: 'বিবরণ', link: '#details' },
  { text: 'স্পিকার', link: '#speakers' },
  { text: 'এজেন্ডা', link: '#agenda' },
  { text: 'রিসোর্স', link: '#resources' },
];

interface MainContentProps extends AboutWebinarProps {
  speakers?: Record<string, unknown>[];
  sessionAgenda?: Record<string, unknown>[];
  resources?: Record<string, unknown>[];
}

export default function MainContent({
  AboutWebinar,
  speakers,
  sessionAgenda,
  resources,
}: MainContentProps) {
  return (
    <div className="lg:col-span-2 z-30 relative">
      <ul className="absolute -top-14 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-fit max-w-[95%] lg:max-w-none py-2 sm:py-4 px-2 sm:px-4 md:px-16 bg-white dark:bg-dark-blue/10 backdrop-blur-xl border-2 border-border rounded-full flex justify-center items-center text-xs sm:text-base md:text-xl text-foreground overflow-x-auto">
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

      <WebinarDetails AboutWebinar={AboutWebinar} />
      {speakers && speakers.length > 0 && <Speakers speakers={speakers} />}
      {sessionAgenda && sessionAgenda.length > 0 && <SessionAgenda agenda={sessionAgenda} />}
      {resources && resources.length > 0 && <Resources resources={resources} />}
    </div>
  );
}
