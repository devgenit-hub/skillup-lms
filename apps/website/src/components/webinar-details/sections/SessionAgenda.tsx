import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MdAccessTime } from 'react-icons/md';

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  speakerName?: string;
}

interface SessionAgendaProps {
  agenda: AgendaItem[];
}

export default function SessionAgenda({ agenda }: SessionAgendaProps) {
  const [curId, setCurId] = useState<string | null>(null);

  if (!agenda || agenda.length === 0) return null;

  return (
    <div id="agenda" className="container mx-auto mt-20 scroll-m-20">
      <h1 className="font-bold text-2xl mb-6">সেশন এজেন্ডা</h1>
      <p className="text-foreground/70 mb-4">ওয়েবিনার সময়সূচী এবং বিষয়বস্তুর বিবরণ</p>
      <Accordion type="single" collapsible className="flex flex-col gap-4">
        {agenda.map((item, index) => {
          const id = `item-${index}`;
          return (
            <AccordionItem
              key={id}
              value={id}
              className={`shadow-md ${
                id == curId ? 'bg-vibrant-blue text-white' : 'bg-vibrant-blue/10 '
              } border-vibrant-blue/20 border dark:border-chart-1/20 rounded-lg px-4 cursor-pointer!`}
            >
              <AccordionTrigger
                onClick={() => {
                  setCurId(id === curId ? null : id);
                }}
              >
                <div className="flex gap-4 items-start font-semibold text-left">
                  <MdAccessTime className="text-xl mt-1 shrink-0" />
                  <div>
                    <div className="text-sm opacity-80">{item.time}</div>
                    <h1 className="text-lg font-extrabold">{item.title}</h1>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-8">
                  <p>{item.description}</p>
                  {item.speakerName && (
                    <p className="mt-2 font-semibold">স্পিকার: {item.speakerName}</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
