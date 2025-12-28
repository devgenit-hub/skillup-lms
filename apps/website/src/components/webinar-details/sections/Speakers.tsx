import Image from 'next/image';
import React from 'react';

interface Speaker {
  name: string;
  image: string;
  designation: string;
}

interface SpeakersProps {
  speakers: Speaker[];
}

export default function Speakers({ speakers }: SpeakersProps) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div id="speakers" className="mt-20 container mx-auto scroll-m-20">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-2xl">ওয়েবিনার স্পিকারবৃন্দ</h1>
      </div>

      <div className="mt-4 p-5 bg-white text-foreground dark:bg-chart-1/10 not-dark:shadow-lg shadow-gray-300/20 dark:border dark:border-chart-1/20 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {speakers.map((speaker, idx) => (
          <div key={idx} className="flex flex-col justify-center items-center">
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
