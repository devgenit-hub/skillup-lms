'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Search, Loader2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
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

export default function SearchBar() {
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

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSuggestions([]);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const displayItems = searchQuery.trim().length >= 2 ? suggestions : trendingItems;
  const showDropdown = isFocused && (displayItems.length > 0 || isLoading);
  const isSearchMode = searchQuery.trim().length >= 2;

  return (
    <div ref={wrapperRef} className="relative h-full">
      <InputGroup className="h-full bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:border-vibrant-blue/30">
        <InputGroupInput
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Search courses, classes..."
          className="bg-transparent border-none focus:ring-0 text-sm lg:text-base placeholder:text-muted-foreground"
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <button
            onClick={handleSearchClick}
            className="p-2 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            type="button"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
            )}
          </button>
        </InputGroupAddon>
      </InputGroup>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card backdrop-blur-xl border border-border rounded-2xl shadow-xl max-h-96 overflow-y-auto z-50 scrollbar-thin">
          {!isSearchMode && displayItems.length > 0 && (
            <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <TrendingUp className="size-3.5" />
              <span>Trending Now</span>
            </div>
          )}
          {isSearchMode && isLoading && suggestions.length === 0 && (
            <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
          {isSearchMode && !isLoading && suggestions.length === 0 && (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No results found for &quot;{searchQuery}&quot;
            </div>
          )}
          {displayItems.length > 0 && (
            <ul>
              {displayItems.map((result, index) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 border-b last:border-b-0 border-border/50 ${
                    index === selectedIndex
                      ? 'bg-vibrant-blue/10 border-vibrant-blue/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted relative border border-border/50">
                      <Image
                        src={result.image || '/Card/cover.png'}
                        alt={result.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate mb-1.5">{result.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            result.type === 'course'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                          }`}
                        >
                          {result.type === 'course' ? 'Course' : 'Webinar'}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            result.feeType?.toUpperCase() === 'FREE'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
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
