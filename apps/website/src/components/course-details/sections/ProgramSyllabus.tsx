import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IoBookOutline } from 'react-icons/io5';
import { MdOndemandVideo, MdOutlineFilePresent } from 'react-icons/md';

interface ProgramSyllabusProps {
  curriculum?: Array<{
    id: string;
    title: string;
    details: string | null;
    order: number;
    classesCount: number;
    materialsCount: number;
  }>;
}

export default function ProgramSyllabus({ curriculum }: ProgramSyllabusProps) {
  if (!curriculum || curriculum.length === 0) {
    return null;
  }

  return (
    <div id="curriculum" className="container mx-auto mt-20 scroll-m-20">
      <h1 className="font-bold text-2xl mb-6">প্রোগ্রামের পাঠ্যসূচি</h1>
      <Accordion collapsible className="flex flex-col gap-4">
        {curriculum.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="shadow-md transition-colors duration-300 ease-in-out data-[state=open]:bg-vibrant-blue data-[state=open]:text-white data-[state=closed]:bg-vibrant-blue/10 border-vibrant-blue/20 border dark:border-chart-1/20 rounded-lg px-4 hover:shadow-lg"
          >
            <AccordionTrigger>
              <span className="flex gap-4 items-center font-semibold">
                <IoBookOutline className="text-lg" />
                {module.title}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {module.details && <p className="mb-4 text-sm opacity-90">{module.details}</p>}
              <div className="flex items-center gap-6 text-sm mt-2">
                <div className="flex items-center gap-2">
                  <MdOndemandVideo className="text-lg" />
                  <span>{module.classesCount} টি ভিডিও</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineFilePresent className="text-lg" />
                  <span>{module.materialsCount} টি রিসোর্স</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
