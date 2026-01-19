'use client';

import { IoClose } from 'react-icons/io5';
import { useAppStore } from '@/lib/zustand/app-store';
import {
  FeeType,
  CourseLevel,
  CourseType,
  FeeBanglaLabels,
  LevelBanglaLabels,
  CourseTypeBanglaLabels,
} from '@/lib/constants/enums';
import { CircleCheck } from 'lucide-react';
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSectionProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFilterChange: (filters: {
    category?: string;
    level?: string;
    feeType?: string;
    courseType?: string;
  }) => void;
  currentFilters: {
    category?: string;
    level?: string;
    feeType?: string;
    courseType?: string;
  };
}

export default function FilterSection({
  isOpen = true,
  onClose,
  onFilterChange,
  currentFilters,
}: FilterSectionProps) {
  const { categories } = useAppStore();

  const handleLevelChange = (level: string) => {
    const newLevel = currentFilters.level === level ? undefined : level;
    onFilterChange({
      ...currentFilters,
      level: newLevel,
    });
  };

  const handleCourseTypeChange = (courseType: string) => {
    const newCourseType = currentFilters.courseType === courseType ? undefined : courseType;
    onFilterChange({
      ...currentFilters,
      courseType: newCourseType,
    });
  };

  const handleFeeTypeChange = (feeType: string) => {
    const newFeeType = currentFilters.feeType === feeType ? undefined : feeType;
    onFilterChange({
      ...currentFilters,
      feeType: newFeeType,
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = 'auto';
    }

    return () => {
      window.document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Filter Content */}
      <aside
        className={`
          w-full not-md:px-4 rounded-2xl text-foreground bg-background py-6
          md:static md:transform-none md:opacity-100
          fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300
          ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          max-h-[80vh] overflow-y-auto
        `}
      >
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">ফিল্টার</h2>
          <button
            onClick={onClose}
            className="md:hidden text-foreground hover:opacity-70 transition-opacity"
            aria-label="Close filter"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="mb-6">
          <Select
            value={currentFilters.category || 'all'}
            onValueChange={(value) => {
              onFilterChange({
                ...currentFilters,
                category: value === 'all' ? undefined : value,
              });
            }}
          >
            <SelectTrigger className="w-full text-lg">
              <SelectValue placeholder="সব বিষয়" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-lg">
                সব বিষয়
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug} className="text-lg">
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm">টাইপ</h3>
          {Object.entries(CourseType).map(([key, value]) => (
            <label key={value} className="flex items-center gap-2 mb-2 text-lg cursor-pointer">
              <CircleCheck
                fill="#fff"
                color={currentFilters.courseType === value ? '#23cf2f' : '#afafafaa'}
                fillOpacity={currentFilters.courseType === value ? 1 : 0}
              />
              <input
                hidden
                type="checkbox"
                className="accent-blue-500"
                checked={currentFilters.courseType === value}
                onChange={() => handleCourseTypeChange(value)}
              />
              {CourseTypeBanglaLabels[key as keyof typeof CourseType]}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm">লেভেল</h3>
          {Object.entries(CourseLevel).map(([key, value]) => (
            <label key={value} className="flex items-center gap-2 mb-2 text-lg cursor-pointer">
              <CircleCheck
                fill="#fff"
                color={currentFilters.level === value ? '#23cf2f' : '#afafafaa'}
                fillOpacity={currentFilters.level === value ? 1 : 0}
              />
              <input
                hidden
                type="checkbox"
                className="accent-blue-500"
                checked={currentFilters.level === value}
                onChange={() => handleLevelChange(value)}
              />
              {LevelBanglaLabels[key as keyof typeof CourseLevel]}
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-sm">ফি টাইপ</h3>
          {Object.entries(FeeType).map(([key, value]) => (
            <label key={value} className="flex items-center gap-2 mb-2 text-lg cursor-pointer">
              <CircleCheck
                fill="#fff"
                color={currentFilters.feeType === value ? '#23cf2f' : '#afafafaa'}
                fillOpacity={currentFilters.feeType === value ? 1 : 0}
              />
              <input
                hidden
                type="checkbox"
                className="accent-blue-500"
                checked={currentFilters.feeType === value}
                onChange={() => handleFeeTypeChange(value)}
              />
              {FeeBanglaLabels[key as keyof typeof FeeType]}
            </label>
          ))}
        </div>
      </aside>
    </>
  );
}
