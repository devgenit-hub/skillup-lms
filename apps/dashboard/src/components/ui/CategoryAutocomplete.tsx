'use client';

import { useState, useRef, useEffect } from 'react';
import { useCategoryStore } from '@/lib/zustand/category-store';
import { ChevronDown, X } from 'lucide-react';

interface CategoryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCategoryIdChange?: (categoryId: string | null) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function CategoryAutocomplete({
  value,
  onChange,
  onCategoryIdChange,
  placeholder = 'e.g., Web Development, UI/UX',
  required = false,
  className = '',
}: CategoryAutocompleteProps) {
  const { categories } = useCategoryStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter categories based on input
  useEffect(() => {
    if (value) {
      const filtered = categories.filter((cat) =>
        cat.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [value, categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (!isOpen) {
      setIsOpen(true);
    }

    // Check if exact match exists
    const exactMatch = categories.find((cat) => cat.title.toLowerCase() === newValue.toLowerCase());
    if (exactMatch && onCategoryIdChange) {
      onCategoryIdChange(exactMatch.id);
    } else if (onCategoryIdChange) {
      onCategoryIdChange(null);
    }
  };

  const handleSelectCategory = (categoryTitle: string, categoryId: string) => {
    onChange(categoryTitle);
    if (onCategoryIdChange) {
      onCategoryIdChange(categoryId);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    if (onCategoryIdChange) {
      onCategoryIdChange(null);
    }
    setIsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputFocus = () => {
    if (value || categories.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-2 pr-20 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white ${className}`}
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-auto">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Clear"
              tabIndex={-1}
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleDropdown}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Toggle dropdown"
            tabIndex={-1}
          >
            <ChevronDown
              size={16}
              className={`text-gray-400 hover:text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {isOpen && filteredCategories.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectCategory(category.title, category.id);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center justify-between group"
            >
              <span className="font-medium text-slate-700 group-hover:text-vibrant-blue">
                {category.title}
              </span>
              <span className="text-xs text-slate-400">
                {category.courseCount || 0} courses, {category.webinarCount || 0} webinars
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredCategories.length === 0 && value && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg"
        >
          <div className="px-4 py-3 text-sm text-slate-500">
            <p className="font-medium mb-1">No matching categories found</p>
            <p className="text-xs">Type to create a new category: &quot;{value}&quot;</p>
          </div>
        </div>
      )}
    </div>
  );
}
