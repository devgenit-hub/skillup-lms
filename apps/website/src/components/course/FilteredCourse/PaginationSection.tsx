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

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Bangla digit converter
const toBanglaDigit = (num: number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((digit) => banglaDigits[parseInt(digit)] || digit)
    .join('');
};

export default function PaginationSection({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationSectionProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent className="bg-background border border-foreground/20 rounded-full px-4 py-2 flex items-center gap-1 shadow-sm">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis className="text-foreground" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-200 cursor-pointer ${
                  page === currentPage
                    ? 'bg-vibrant-blue hover:bg-vibrant-blue/80 border-none text-white'
                    : 'hover:bg-primary/10 text-secondary-foreground'
                }`}
              >
                {toBanglaDigit(page)}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={`text-foreground text-sm hover:text-primary transition ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
