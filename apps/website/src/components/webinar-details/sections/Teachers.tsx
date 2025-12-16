import Image from 'next/image';
import React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { SpeakerDataProps } from '../types/TeachersDataProps';

const speakersData: SpeakerDataProps[] = [
  {
    image:
      'https://t4.ftcdn.net/jpg/03/25/73/59/360_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg',
    name: 'মাসউদ জাভেদ',
    designation: 'Senior Software Engineer || Google',
  },
  {
    image:
      'https://t4.ftcdn.net/jpg/03/25/73/59/360_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg',
    name: 'আয়েশা আক্তার',
    designation: 'Tech Lead || Microsoft',
  },
  {
    image:
      'https://t4.ftcdn.net/jpg/03/25/73/59/360_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg',
    name: 'তানভীর হাসান',
    designation: 'Product Manager || Amazon',
  },
  {
    image:
      'https://t4.ftcdn.net/jpg/03/25/73/59/360_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg',
    name: 'রাহাত ইসলাম',
    designation: 'Full Stack Developer || Facebook',
  },
];

export default function Speakers() {
  return (
    <div id="speakers" className="mt-20 container mx-auto scroll-m-20">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-2xl">ওয়েবিনার স্পিকারবৃন্দ</h1>
        <a
          href="#"
          className="border border-vibrant-blue font-bold rounded-full px-6 py-1 hover:bg-vibrant-blue hover:text-white transition-colors ease-out text-sm flex items-center gap-2"
        >
          প্রোফাইল দেখুন <MdArrowOutward className="text-lg" />
        </a>
      </div>

      <div className="mt-4 p-5 bg-white text-foreground dark:bg-chart-1/10 not-dark:shadow-lg shadow-gray-300/20 dark:border dark:border-chart-1/20 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {speakersData.map((speaker, idx) => (
          <div key={idx} className="flex flex-col justify-center items-center">
            {/* Parent container for Image with relative and square size */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={speaker.image}
                alt={speaker.name}
                width={128}
                height={128}
                className="object-cover w-full aspect-square"
              />
            </div>

            <h1 className="mt-3 font-semibold text-lg text-foreground">{speaker.name}</h1>
            <p className="text-center text-xs mt-1 text-foreground/80">{speaker.designation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
