'use client';

import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/providers/locale-provider';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import type { CourseCard, WebinarCard } from '@/lib/zustand/app-store';
import { Loader2 } from 'lucide-react';

type SearchResult = {
  id: string;
  title: string;
  type: 'course' | 'webinar';
  category?: string;
  image?: string | null;
};

export default function SearchBar({
  name,
  placeholder,
  Icon,
}: {
  name?: string;
  placeholder?: string;
  Icon?: React.ElementType;
}) {
  const { t } = useLocale();
  const pageText = t('search');
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const [coursesResponse, webinarsResponse] = await Promise.all([
        apiClient.getPublicCourses({ search: query, limit: 5 }),
        apiClient.getPublicWebinars({ search: query, limit: 5 }),
      ]);

      const courseResults: SearchResult[] =
        (coursesResponse.data as CourseCard[])?.map((course) => ({
          id: course.id,
          title: course.title,
          type: 'course' as const,
          category: course.category?.title,
          image: course.image,
        })) || [];

      const webinarResults: SearchResult[] =
        (webinarsResponse.data as WebinarCard[])?.map((webinar) => ({
          id: webinar.id,
          title: webinar.title,
          type: 'webinar' as const,
          category: webinar.category?.title,
          image: webinar.image,
        })) || [];

      setSuggestions([...courseResults, ...webinarResults]);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = useCallback(
    (result: SearchResult) => {
      const path = result.type === 'course' ? `/course/${result.id}` : `/webinar/${result.id}`;
      router.push(path);
      setSearchQuery('');
      setSuggestions([]);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSuggestions = isFocused && (suggestions.length > 0 || isLoading);

  return (
    <div
      ref={wrapperRef}
      className={`relative transition-all duration-300 ease-in-out ${isFocused ? 'w-64 md:w-80 not-lg:w-full' : 'w-48 md:w-64'} mx-auto`}
    >
      {Icon && (
        <span className="absolute left-3 bottom-1/2 translate-y-1/2 text-foreground font-bold pointer-events-none z-10">
          <Icon className="size-4 font-black" />
        </span>
      )}
      <Input
        ref={inputRef}
        name={name}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || pageText['placeholder']}
        className={`${Icon ? 'pl-8' : ''} ${isLoading ? 'pr-8' : ''} placeholder:text-foreground my-auto transition-all duration-300`}
        onFocus={() => setIsFocused(true)}
        autoComplete="off"
      />
      {isLoading && (
        <span className="absolute right-3 bottom-1/2 translate-y-1/2 text-foreground">
          <Loader2 className="size-4 animate-spin" />
        </span>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">No results found</div>
          ) : (
            <ul>
              {suggestions.map((result, index) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                    index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    {result.image && (
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{result.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            result.type === 'course'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}
                        >
                          {result.type === 'course' ? 'Course' : 'Webinar'}
                        </span>
                        {result.category && (
                          <span className="text-xs text-muted-foreground truncate">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
