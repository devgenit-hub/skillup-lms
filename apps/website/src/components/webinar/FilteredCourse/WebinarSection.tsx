'use client';

import { WebinarCard } from '../WebinarCard/WebinarCard';
import PaginationSection from './PaginationSection';
import { useAppStore } from '@/lib/zustand/app-store';
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { WebinarCard as WebinarCardType } from '@/lib/zustand/app-store';

interface WebinarSectionProps {
  filters?: {
    category?: string;
    status?: string;
    feeType?: string;
    search?: string;
  };
}

export default function WebinarSection({ filters }: WebinarSectionProps) {
  const { webinars: initialWebinars, webinarsLoading: initialLoading } = useAppStore();
  const [displayWebinars, setDisplayWebinars] = useState<WebinarCardType[]>(initialWebinars);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasFilters, setHasFilters] = useState(false);
  const pageSize = 9;

  // Check if filters are applied
  useEffect(() => {
    const filtersApplied =
      Boolean(filters?.category) ||
      Boolean(filters?.status) ||
      Boolean(filters?.feeType) ||
      Boolean(filters?.search);
    setHasFilters(filtersApplied);
  }, [filters]);

  // Fetch webinars when filters or page changes
  const fetchWebinars = useCallback(async () => {
    // If no filters and page 1, use initial data from store
    if (!hasFilters && currentPage === 1) {
      setDisplayWebinars(initialWebinars);
      setTotalPages(Math.ceil(initialWebinars.length / pageSize));
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.getPublicWebinars({
        page: currentPage,
        limit: pageSize,
        search: filters?.search,
        category: filters?.category,
        status: filters?.status,
        feeType: filters?.feeType,
      });

      if (response.status === 'success' && response.data) {
        const items = response.data as WebinarCardType[];
        const pagination = response.pagination;
        setDisplayWebinars(items);
        setTotalPages(pagination?.totalPages || 1);
      }
    } catch {
      setDisplayWebinars([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, hasFilters, initialWebinars, pageSize]);

  useEffect(() => {
    fetchWebinars();
  }, [fetchWebinars]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (hasFilters) {
      setCurrentPage(1);
    }
  }, [filters?.category, filters?.status, filters?.feeType, filters?.search, hasFilters]);

  const isLoading = initialLoading || loading;

  return (
    <section className="w-full flex flex-col items-center gap-12">
      {/* Webinar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 space-y-6 w-full">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-400">Loading webinars...</div>
        ) : displayWebinars.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">No webinars found</div>
        ) : (
          displayWebinars.map((webinar) => (
            <WebinarCard
              key={webinar.id}
              imageUrl={webinar.image || '/test_images/webinar_test_image.png'}
              category={webinar.category?.title}
              title={webinar.title}
              webinarId={webinar.id}
              endDate={webinar.scheduleDateTime}
              feeType={webinar.feeType}
              price={webinar.price}
              platform={webinar.platform}
              maxDiscount={webinar.maxDiscount}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && displayWebinars.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
