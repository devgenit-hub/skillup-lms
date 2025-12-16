'use client';
import { useState } from 'react';
import SearchBar from '../SearchBar';
import { LucideSearch, Menu, X } from 'lucide-react';
// import { NavProps } from './NavProps';
import { navLinks } from './NavLinks';
import NavLink from './NavLink';
import { ThemeToggle } from '../../utils/theme-toggle';
import NavButton from './NavButton';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/30 backdrop-blur-md shadow-sm text-primary py-3">
      <div className="container px-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-2xl font-bold bg-linear-to-r from-vibrant-blue via-indigo-500 to-purple-600 text-transparent bg-clip-text hover:scale-105 transition-transform cursor-pointer"
            >
              Skill Up
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop search */}
            <div className="hidden md:block">
              <SearchBar Icon={LucideSearch} />
            </div>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-4" aria-label="Primary">
              {navLinks.map((link, index) => (
                <NavLink key={index} {...link} />
              ))}
            </nav>

            {/* Theme toggle (visible on all breakpoints) */}
            <ThemeToggle />

            {/* Desktop action button */}
            <div className="hidden md:block">
              <NavButton />
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted/30"
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden mt-3 transition-all duration-200 ${
            mobileOpen ? 'block' : 'hidden'
          }`}
          role="menu"
          aria-hidden={!mobileOpen}
        >
          <div className="w-full bg-background/90 backdrop-blur-md shadow-md rounded-md p-4 flex flex-col gap-3">
            <SearchBar Icon={LucideSearch} />
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <NavLink key={index} {...link} />
              ))}
            </nav>

            <div>
              <NavButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
