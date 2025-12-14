'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect, useState } from 'react';

export default function PaginationSection() {
  const [pageNo, setPageNo] = useState('১');

  useEffect(() => {
    setPageNo('২');
  }, []);
  return (
    <Pagination>
      <PaginationContent className="bg-background border border-foreground/20 rounded-full px-4 py-2 flex items-center gap-1 shadow-sm">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious href="#"></PaginationPrevious>
        </PaginationItem>

        {/* Page Numbers */}
        {['১', '২', '৩', '৪'].map((num) => (
          <PaginationItem key={num}>
            <PaginationLink
              href="#"
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-200 ${
                num === pageNo
                  ? 'bg-vibrant-blue hover:bg-vibrant-blue/80 border-none text-white'
                  : 'hover:bg-primary/10 text-secondary-foreground'
              }`}
            >
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis */}
        <PaginationItem>
          <PaginationEllipsis className="text-foreground" />
        </PaginationItem>

        {/* Last Page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-200 ${
              pageNo === '২'
                ? 'bg-vibrant-blue hover:bg-vibrant-blue/80 border-none text-white'
                : 'hover:bg-primary/10 text-secondary-foreground'
            }`}
          >
            ১৫
          </PaginationLink>
        </PaginationItem>

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            className="text-foreground text-sm hover:text-primary transition"
          ></PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
