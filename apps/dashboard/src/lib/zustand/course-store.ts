import { create } from 'zustand';

export interface Course {
  id: string;
  title: string;
  published: boolean;
}

interface CourseStore {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  removeCourse: (id: string) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],

  setCourses: (courses) => {
    set({ courses });
  },

  addCourse: (course) => {
    set((state) => ({ courses: [...state.courses, course] }));
  },

  updateCourse: (id, data) => {
    set((state) => ({
      courses: state.courses.map((course) => (course.id === id ? { ...course, ...data } : course)),
    }));
  },

  removeCourse: (id) => {
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
    }));
  },
}));
