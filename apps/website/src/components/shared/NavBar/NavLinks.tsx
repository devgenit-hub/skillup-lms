import { GraduationCap, Info } from 'lucide-react';
import React from 'react';

export interface NavLinksProps {
  icon?: React.ElementType;
  name: string;
  href?: string;
  innerLinks?: NavLinksProps[];
  handleClick?: () => void;
}

export const navLinks: NavLinksProps[] = [
  {
    name: 'হোম',
    href: '/',
  },
  {
    name: 'সকল কোর্স',
    href: '/allcourse',
  },
  {
    name: 'ওয়েবিনার',
    href: '/webinar',
  },
  {
    name: 'অন্যান্য',
    innerLinks: [
      {
        name: 'আমাদের সম্পর্কে',
        href: '/about',
        icon: Info,
      },
      {
        name: 'ক্যারিয়ার',
        href: '/career',
        icon: GraduationCap,
      },
      // {
      //   name: "ব্লগ",
      //   href: "/blog",
      //   icon: FaBlog,
      // },
    ],
  },
];
