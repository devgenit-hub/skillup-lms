'use client';
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export default function MobileMenuButton({ isOpen, onClick, ariaLabel }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-xl bg-card backdrop-blur-xl shadow-md border border-border hover:bg-muted transition-all duration-300 active:scale-95"
      aria-label={ariaLabel}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-foreground" />
      ) : (
        <Menu className="w-6 h-6 text-foreground" />
      )}
    </button>
  );
}
