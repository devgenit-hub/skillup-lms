import Image from 'next/image';
import React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { TeachersDataProps } from '../types/TeachersDataProps';

const teachersData: TeachersDataProps[] = [
  {
    image: '/test_images/test_teacher.jpg',
    name: 'মাসউদ জাভেদ',
    education: "বুয়েট'০৬ ব্যাচ  ||  পদার্থবিজ্ঞান",
  },
  {
    image: '/test_images/test_teacher.jpg',
    name: 'মাসউদ জাভেদ',
    education: "বুয়েট'০৬ ব্যাচ  ||  পদার্থবিজ্ঞান",
  },
  {
    image: '/test_images/test_teacher.jpg',
    name: 'মাসউদ জাভেদ',
    education: "বুয়েট'০৬ ব্যাচ  ||  পদার্থবিজ্ঞান",
  },
  {
    image: '/test_images/test_teacher.jpg',
    name: 'মাসউদ জাভেদ',
    education: "বুয়েট'০৬ ব্যাচ  ||  পদার্থবিজ্ঞান",
  },
  {
    image: '/test_images/test_teacher.jpg',
    name: 'মাসউদ জাভেদ',
    education: "বুয়েট'০৬ ব্যাচ  ||  পদার্থবিজ্ঞান",
  },
  {
    image: '/test_images/test_teacher.jpg',
    name: 'মাসউদ জাভেদ',
    education: "বুয়েট'০৬ ব্যাচ  ||  পদার্থবিজ্ঞান",
  },
];

export default function Teachers() {
  return (
    <div id="teachers" className="mt-20 container mx-auto scroll-m-20">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-2xl">কোর্সের শিক্ষকবৃন্দ</h1>
        <a
          href="#"
          className="border border-vibrant-blue font-bold rounded-full px-6 py-1 hover:bg-vibrant-blue hover:text-white transition-colors ease-out text-sm flex items-center gap-2"
        >
          সকল শিক্ষক <MdArrowOutward className="text-lg" />
        </a>
      </div>

      <div className="mt-4 p-5 bg-white text-foreground dark:bg-chart-1/10 not-dark:shadow-lg shadow-gray-300/20 dark:border dark:border-chart-1/20 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teachersData.map((teacher, idx) => (
          <div key={idx} className="flex flex-col justify-center items-center">
            {/* Parent container for Image with relative and square size */}
            <div className="relative w-full aspect-square  rounded-lg overflow-hidden">
              <Image
                src={teacher.image}
                alt={teacher.name}
                width={512}
                height={512}
                className="object-cover w-full aspect-square"
              />
            </div>

            <h1 className="mt-3 font-semibold text-lg text-foreground">{teacher.name}</h1>
            <p className="text-center text-xs mt-1 text-foreground/80">{teacher.education}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
