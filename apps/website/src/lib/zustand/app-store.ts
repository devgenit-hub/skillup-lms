import { create } from 'zustand';

export interface Category {
  id: string;
  title: string;
  slug: string;
  courseCount?: number;
  webinarCount?: number;
}

export interface CourseCard {
  id: string;
  title: string;
  image: string | null;
  feeType: 'free' | 'paid';
  price: number | null;
  category: Category | null;
  level: string | null;
  language: string | null;
  published: boolean;
  teachers: Array<{
    id: string;
    name: string | null;
    profileImage: string | null;
  }>;
  _count: {
    enrollments: number;
    curriculumModules: number;
  };
}

export interface WebinarCard {
  id: string;
  title: string;
  image: string | null;
  category: Category | null;
  scheduleDateTime: string;
  duration: number;
  feeType: 'free' | 'paid';
  price: number | null;
  status: 'draft' | 'upcoming' | 'live' | 'completed';
  _count: {
    registrations: number;
  };
}

interface AppState {
  courses: CourseCard[];
  webinars: WebinarCard[];
  categories: Category[];
  coursesLoading: boolean;
  webinarsLoading: boolean;
  categoriesLoading: boolean;
  initialDataFetched: boolean;

  setCourses: (courses: CourseCard[]) => void;
  setWebinars: (webinars: WebinarCard[]) => void;
  setCategories: (categories: Category[]) => void;
  setCoursesLoading: (loading: boolean) => void;
  setWebinarsLoading: (loading: boolean) => void;
  setCategoriesLoading: (loading: boolean) => void;
  setInitialDataFetched: (fetched: boolean) => void;

  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  courses: [],
  webinars: [],
  categories: [],
  coursesLoading: true,
  webinarsLoading: true,
  categoriesLoading: true,
  initialDataFetched: false,

  setCourses: (courses) => set({ courses, coursesLoading: false }),
  setWebinars: (webinars) => set({ webinars, webinarsLoading: false }),
  setCategories: (categories) => set({ categories, categoriesLoading: false }),
  setCoursesLoading: (coursesLoading) => set({ coursesLoading }),
  setWebinarsLoading: (webinarsLoading) => set({ webinarsLoading }),
  setCategoriesLoading: (categoriesLoading) => set({ categoriesLoading }),
  setInitialDataFetched: (initialDataFetched) => set({ initialDataFetched }),

  reset: () =>
    set({
      courses: [],
      webinars: [],
      categories: [],
      coursesLoading: true,
      webinarsLoading: true,
      categoriesLoading: true,
      initialDataFetched: false,
    }),
}));
