'use client';

import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '@/providers/locale-provider';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Loader2, TrendingUp, Search } from 'lucide-react';
import Image from 'next/image';

type SearchResult = {
  id: string;
  title: string;
  type: 'course' | 'webinar';
  category?: string | null;
  image?: string | null;
  feeType?: 'free' | 'paid';
  price?: number;
  count?: number;
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
  const [trendingItems, setTrendingItems] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await apiClient.searchTrending({ limit: 6 });
        if (response?.data) {
          setTrendingItems(response.data as SearchResult[]);
        }
      } catch {
        /* ignore */
      }
    };
    loadTrending();
  }, []);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.searchTrending({ search: searchQuery, limit: 8 });
        if (!controller.signal.aborted && response?.data) {
          setSuggestions(response.data as SearchResult[]);
          setSelectedIndex(-1);
        }
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.type === 'course' ? `/course/${result.id}` : `/webinar/${result.id}`);
      setSearchQuery('');
      setSuggestions([]);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = searchQuery.trim().length >= 2 ? suggestions : trendingItems;
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = items[selectedIndex];
      if (selected) handleSelect(selected);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayItems = searchQuery.trim().length >= 2 ? suggestions : trendingItems;
  const showDropdown = isFocused && (displayItems.length > 0 || isLoading);
  const isSearchMode = searchQuery.trim().length >= 2;

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

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {!isSearchMode && displayItems.length > 0 && (
            <div className="px-3 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="size-3" />
              <span>Trending</span>
            </div>
          )}
          {isSearchMode && isLoading && suggestions.length === 0 && (
            <div className="px-3 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Search className="size-3" />
              <span>Searching...</span>
            </div>
          )}
          {isSearchMode && !isLoading && suggestions.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">No results found</div>
          )}
          {displayItems.length > 0 && (
            <ul>
              {displayItems.map((result, index) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                    index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-muted relative">
                      <Image
                        src={result.image || '/Card/cover.png'}
                        alt={result.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{result.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            result.type === 'course'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}
                        >
                          {result.type === 'course' ? 'Course' : 'Webinar'}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            result.feeType?.toUpperCase() === 'FREE'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}
                        >
                          {result.feeType?.toUpperCase() === 'FREE' ? 'Free' : `৳${result.price}`}
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
