import React from 'react';
import Image from 'next/image';
import { FaArrowDown } from 'react-icons/fa6';

interface Resource {
  fileUrl: string;
  fileName: string;
}

interface ResourcesProps {
  resources: Resource[];
}

export default function Resources({ resources }: ResourcesProps) {
  if (!resources || resources.length === 0) return null;

  return (
    <div id="resources" className="mt-20 scroll-m-20">
      <h1 className="font-bold text-2xl mb-4 text-black dark:text-white">
        ওয়েবিনার রিসোর্স & ম্যাটেরিয়াল
      </h1>

      <div className="relative rounded-3xl overflow-hidden shadow-md border bg-vibrant-blue/10 border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 p-6">
        <div className="relative w-full aspect-2/1">
          <Image
            src="/CourseDetails/Resources.png"
            alt="Webinar Resources & Materials"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-foreground/80 font-semibold">ওয়েবিনার শেষে আপনি পাবেন:</p>
          <ul className="list-disc list-inside space-y-1 text-foreground/70">
            <li>সেশনের সকল স্লাইড এবং প্রেজেন্টেশন ম্যাটেরিয়াল</li>
            <li>রেকর্ডেড ভিডিও (প্রিমিয়াম সদস্যদের জন্য)</li>
            <li>অতিরিক্ত রিসোর্স এবং রিডিং ম্যাটেরিয়াল</li>
            <li>সার্টিফিকেট অফ অ্যাটেনডেন্স</li>
          </ul>

          <p className="text-foreground/80 font-semibold mt-8">উপলব্ধ রিসোর্স:</p>
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-foreground/5 dark:border-white text-sm flex items-center justify-center gap-2 w-full"
            >
              ডাউনলোড {resource.fileName} <FaArrowDown className="text-lg" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
