import { create } from 'zustand';

export interface Category {
  id: string;
  title: string;
  slug: string;
  courseCount?: number;
  webinarCount?: number;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategoryCounts: (
    categoryId: string,
    type: 'course' | 'webinar',
    increment: boolean
  ) => void;
  getCategoryByTitle: (title: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,

  setCategories: (categories) => {
    set({ categories, isLoading: false });
  },

  addCategory: (category) => {
    const exists = get().categories.find(
      (c) => c.title === category.title || c.slug === category.slug
    );
    if (!exists) {
      set((state) => ({ categories: [...state.categories, category] }));
    }
  },

  updateCategoryCounts: (categoryId, type, increment) => {
    set((state) => ({
      categories: state.categories.map((category) => {
        if (category.id === categoryId) {
          const field = type === 'course' ? 'courseCount' : 'webinarCount';
          const currentCount = category[field] || 0;
          return {
            ...category,
            [field]: increment ? currentCount + 1 : Math.max(0, currentCount - 1),
          };
        }
        return category;
      }),
    }));
  },

  getCategoryByTitle: (title) => {
    return get().categories.find((c) => c.title.toLowerCase() === title.toLowerCase());
  },
}));
