'use client';
import { useState, useEffect } from 'react';
import { LucideSearch, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import SearchBar from '../SearchBar';
// import { NavProps } from './NavProps';
import { navLinks } from './NavLinks';
import NavLink from './NavLink';
import { ThemeToggle } from '../../utils/theme-toggle';
import NavButton from './NavButton';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mobileOpen) {
      window.document.body.style.overflow = 'hidden';
    } else window.document.body.style.overflow = 'auto';

    return () => {
      window.document.body.style.overflow = 'auto';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/30 backdrop-blur-md shadow-sm text-primary py-3">
      <div className="container px-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4" onClick={() => window.location.assign('/')}>
            {mounted && resolvedTheme === 'dark' ? (
              <Image
                width={96}
                height={24}
                src={'/logodark.png'}
                alt="SkillShikho logo"
                priority
                loading="eager"
              />
            ) : (
              <Image
                width={96}
                height={24}
                src={'/logolight.png'}
                alt="SkillShikho logo"
                priority
                loading="eager"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <div className="hidden lg:block">
              <SearchBar Icon={LucideSearch} />
            </div>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-2" aria-label="Primary">
              {navLinks.map((link, index) => (
                <NavLink key={index} {...link} />
              ))}
            </nav>

            {/* Theme toggle (visible on all breakpoints) */}
            <ThemeToggle />

            {/* Desktop action button */}
            <div className="hidden lg:block">
              <NavButton onClick={() => setMobileOpen(false)} />
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted/30"
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
          className={`lg:hidden mt-3 transition-all duration-300 ease-in-out overflow-hidden h-screen ${
            mobileOpen
              ? 'max-h-screen opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
          }`}
          role="menu"
          aria-hidden={!mobileOpen}
        >
          <div className="w-full bg-background/90 backdrop-blur-md shadow-md rounded-md p-4 flex flex-col gap-3 h-full">
            <div
              className={`transition-all duration-300 delay-75 ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
            >
              <SearchBar Icon={LucideSearch} />
            </div>
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                  style={{ transitionDelay: `${100 + index * 50}ms` }}
                >
                  <NavLink {...link} handleClick={() => setMobileOpen(false)} />
                </div>
              ))}
              <div
                className={`transition-all duration-300 relative ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                style={{ transitionDelay: `${100 + navLinks.length * 50}ms` }}
              >
                <NavButton onClick={() => setMobileOpen(false)} />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
