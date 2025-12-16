'use client';

import React from 'react';
import Link from 'next/link';
import { NavLinksProps } from './NavLinks';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

export default function NavLink(props: NavLinksProps) {
  if (props.innerLinks && props.innerLinks.length > 0) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{props.name}</NavigationMenuTrigger>
            <NavigationMenuContent
              className="bg-[#885afd33] backdrop-blur-lg rounded-lg p-4"
              style={{ width: '190px' }}
            >
              {props.innerLinks.map((link) => (
                <NavigationMenuLink
                  key={link.href}
                  asChild
                  className="flex flex-col justify-center"
                >
                  <Link href={link.href || '/'}>
                    <span>
                      {link.icon ? <link.icon className="inline mr-2 size-4" /> : null}
                      {link.name}
                    </span>
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={props.href || '/'}>
              {props.icon ? <props.icon className="inline mr-2 size-4" /> : null}
              {props.name}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
