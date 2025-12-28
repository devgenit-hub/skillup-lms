import Image from 'next/image';
import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

interface TeachersProps {
  teachers?: Array<{
    id: string;
    name: string;
    profileImage: string | null;
    specialization: string | null;
  }>;
}

export default function Teachers({ teachers }: TeachersProps) {
  // If no teachers data, show nothing or a message
  if (!teachers || teachers.length === 0) {
    return null;
  }

  return (
    <div id="teachers" className="mt-20 container mx-auto scroll-m-20">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-2xl">কোর্সের শিক্ষকবৃন্দ</h1>
        {teachers.length > 6 && (
          <a
            href="#"
            className="border border-vibrant-blue font-bold rounded-full px-6 py-1 hover:bg-vibrant-blue hover:text-white transition-colors ease-out text-sm flex items-center gap-2"
          >
            সকল শিক্ষক <MdArrowOutward className="text-lg" />
          </a>
        )}
      </div>

      <div className="mt-4 p-5 bg-white text-foreground dark:bg-chart-1/10 not-dark:shadow-lg shadow-gray-300/20 dark:border dark:border-chart-1/20 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.slice(0, 6).map((teacher) => (
          <div key={teacher.id} className="flex flex-col items-center gap-3">
            {/* Teacher Image - Square aspect ratio */}
            <div className="relative w-full max-w-[200px] aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-md">
              <Image
                src={teacher.profileImage || '/test_images/test_teacher.jpg'}
                alt={teacher.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Teacher Info */}
            <div className="text-center">
              <h2 className="font-semibold text-lg text-foreground">{teacher.name}</h2>
              {teacher.specialization && (
                <p className="text-sm mt-1 text-foreground/70">{teacher.specialization}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
