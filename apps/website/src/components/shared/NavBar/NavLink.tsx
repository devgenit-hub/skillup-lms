'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NavLinksProps } from './NavLinks';
import { ChevronDown } from 'lucide-react';

export default function NavLink(props: NavLinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = props.innerLinks && props.innerLinks.length > 0;

  // 1. RENDER PARENT WITH CHILDREN (Accordion)
  if (hasChildren) {
    return (
      <div className="w-full mb-1">
        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={`
            group flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 
            backdrop-blur-md
             ${
               isOpen
                 ? 'bg-dark-blue/10 text-light-blue'
                 : 'text-foreground hover:bg-white/5 hover:text-slate-500'
             }
          `}
        >
          <div className="flex items-center gap-3">
            {props.icon && <props.icon className="size-4 hidden" />}
            <span>{props.name}</span>
          </div>
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-light-blue' : 'text-slate-500'}`}
          />
        </button>

        {/* Expandable Content Container */}
        <div
          className={`
            grid transition-all duration-300 ease-in-out lg:absolute lg:overflow-hidden
           lg:bg-background rounded-md lg:border border-[#885afd33] ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}
          `}
        >
          <div className="overflow-hidden">
            {/* Inner Links List */}
            <div className="flex flex-col space-y-1 not-lg:pl-4 lg:p-2 not-lg:border-l border-[#885afd33] my-1">
              {props.innerLinks?.map((link) => (
                <Link
                  key={link.href || link.name}
                  href={link.href || '/'}
                  onClick={props.handleClick}
                  className="
                    flex items-center gap-3 rounded-md px-3 py-2 
                    text-sm text-foreground hover:text-black dark:hover:text-white hover:bg-white/5 
                    transition-colors
                  "
                >
                  {link.icon ? <link.icon className="size-4 lg:hidden" /> : null}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER SIMPLE LINK
  return (
    <Link
      href={props.href || '/'}
      onClick={props.handleClick}
      className="
        flex not-lg:w-full w-fit items-center gap-3 rounded-lg px-4 py-3 mb-1 text-sm font-medium text-foreground hover:bg-white/5 hover:text-slate-500 transition-colors
      "
    >
      {props.icon && <props.icon className="size-4 lg:hidden" />}
      <span className="text-nowrap whitespace-nowrap">{props.name}</span>
    </Link>
  );
}
