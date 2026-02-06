import { GraduationCap, Info, LayoutDashboard, BookOpen, Video } from 'lucide-react';

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
    icon: LayoutDashboard,
  },
  {
    name: 'সকল কোর্স',
    href: '/allcourse',
    icon: BookOpen,
  },
  {
    name: 'ওয়েবিনার',
    href: '/webinar',
    icon: Video,
  },
  {
    name: 'অন্যান্য',
    icon: Info, // Added icon for parent
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
    ],
  },
];
