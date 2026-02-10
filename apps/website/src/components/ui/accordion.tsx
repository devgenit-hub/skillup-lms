'use client';

import * as React from 'react';
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

interface AccordionContextValue {
  openValue: string | null;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>({
  openValue: null,
  toggle: () => {},
});

/* ------------------------------------------------------------------ */
/*  Accordion (root)                                                  */
/* ------------------------------------------------------------------ */

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single';
  collapsible?: boolean;
  defaultValue?: string;
}

function Accordion({ className, defaultValue, children, ...props }: AccordionProps) {
  const [openValue, setOpenValue] = useState<string | null>(defaultValue ?? null);

  const toggle = useCallback(
    (value: string) => setOpenValue((prev) => (prev === value ? null : value)),
    []
  );

  return (
    <AccordionContext.Provider value={{ openValue, toggle }}>
      <div data-slot="accordion" className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  AccordionItem                                                     */
/* ------------------------------------------------------------------ */

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  isOpen: false,
});

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { openValue } = useContext(AccordionContext);
  const isOpen = openValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-slot="accordion-item"
        data-state={isOpen ? 'open' : 'closed'}
        className={cn('border-b last:border-b-0', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  AccordionTrigger                                                  */
/* ------------------------------------------------------------------ */

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Hide the default chevron icon */
  hideIcon?: boolean;
}

function AccordionTrigger({
  className,
  children,
  hideIcon = false,
  onClick,
  ...props
}: AccordionTriggerProps) {
  const { toggle } = useContext(AccordionContext);
  const { value, isOpen } = useContext(AccordionItemContext);

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none cursor-pointer disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={(e) => {
        toggle(value);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
      {!hideIcon && (
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  AccordionContent  (animated height)                               */
/* ------------------------------------------------------------------ */

function AccordionContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useContext(AccordionItemContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    measure();
  }, [isOpen, measure]);

  return (
    <div
      data-slot="accordion-content"
      data-state={isOpen ? 'open' : 'closed'}
      className="overflow-hidden transition-[height] duration-300 ease-in-out text-sm"
      style={{ height: isOpen ? height : 0 }}
      {...props}
    >
      <div ref={contentRef} className={cn('pb-4', className)}>
        {children}
      </div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
