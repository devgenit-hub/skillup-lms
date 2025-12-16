import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MdAccessTime } from 'react-icons/md';
import { AgendaItemProps } from '../types/SyllabusItemProps';

const agendaData: AgendaItemProps[] = [
  {
    id: 'item-1',
    time: '৮:০০ PM - ৮:১৫ PM',
    title: 'ওয়েলকাম ও ওভারভিউ',
    description:
      'ওয়েবিনারের শুরুতে স্বাগত বক্তব্য এবং আজকের সেশনে কী কী থাকছে তার একটি সংক্ষিপ্ত পরিচিতি। অংশগ্রহণকারীদের সাথে আইসব্রেকার সেশন ও নেটওয়ার্কিংয়ের সুযোগ।',
    speaker: 'মাসউদ জাভেদ',
  },
  {
    id: 'item-2',
    time: '৮:১৫ PM - ৯:০০ PM',
    title: 'মূল বিষয়বস্তু প্রেজেন্টেশন - পার্ট ১',
    description:
      'মূল বিষয়ের উপর গভীর আলোচনা। বাস্তব জীবনের উদাহরণ, কেস স্টাডি ও সমাধানের পদ্ধতি। ইন্টারেক্টিভ প্রশ্ন উত্তর সেশন।',
    speaker: 'আয়েশা আক্তার',
  },
  {
    id: 'item-3',
    time: '৯:০০ PM - ৯:১৫ PM',
    title: 'চায়ের বিরতি ও নেটওয়ার্কিং',
    description:
      'একটি ছোট বিরতি যেখানে অংশগ্রহণকারীরা একে অপরের সাথে যোগাযোগ করতে পারবেন। প্রশ্ন জিজ্ঞাসার সুযোগ ও নিজেদের অভিজ্ঞতা শেয়ার করার প্ল্যাটফর্ম।',
  },
  {
    id: 'item-4',
    time: '৯:১৫ PM - ১০:০০ PM',
    title: 'মূল বিষয়বস্তু প্রেজেন্টেশন - পার্ট ২',
    description:
      'বিষয়ের আরো গভীর আলোচনা। অ্যাডভান্স টেকনিক ও বাস্তবায়নের জন্য টিপস। লাইভ ডেমো এবং হ্যান্ডস-অন প্র্যাক্টিস।',
    speaker: 'তানভীর হাসান',
  },
  {
    id: 'item-5',
    time: '১০:০০ PM - ১০:১৫ PM',
    title: 'Q&A ও ক্লোজিং সেশন',
    description:
      'অংশগ্রহণকারীদের প্রশ্নের উত্তর দেওয়া হবে। সার্টিফিকেট বিতরণ এবং আগামী ওয়েবিনার সম্পর্কে ঘোষণা। স্পেশাল গিফট ও রিসোর্স শেয়ার।',
  },
];

export default function SessionAgenda() {
  const [curId, setCurId] = useState<string | null>(null);
  return (
    <div id="agenda" className="container mx-auto mt-20 scroll-m-20">
      <h1 className="font-bold text-2xl mb-6">সেশন এজেন্ডা</h1>
      <p className="text-foreground/70 mb-4">ওয়েবিনার সময়সূচী এবং বিষয়বস্তুর বিবরণ</p>
      {/* Accordion section */}
      <Accordion type="single" collapsible className="flex flex-col gap-4">
        {agendaData.map(({ id, time, title, description, speaker }) => (
          <AccordionItem
            key={id}
            value={id}
            className={`shadow-md ${
              id == curId ? 'bg-vibrant-blue text-white' : 'bg-vibrant-blue/10 '
            } border-vibrant-blue/20 border dark:border-chart-1/20 rounded-lg px-4`}
          >
            <AccordionTrigger
              onClick={() => {
                if (id === curId) {
                  setCurId(null);
                } else {
                  setCurId(id);
                }
              }}
            >
              <div className="flex gap-4 items-start font-semibold text-left">
                <MdAccessTime className="text-xl mt-1 shrink-0" />
                <div>
                  <div className="text-sm opacity-80">{time}</div>
                  <div>{title}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-8">
                <p>{description}</p>
                {speaker && <p className="mt-2 font-semibold">স্পিকার: {speaker}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
