import { create } from 'zustand';

export interface TeacherCourse {
  id: string;
  title: string;
  published: boolean;
  feeType: 'FREE' | 'PAID';
  price: number | null;
  _count: {
    enrollments: number;
    curriculumModules: number;
  };
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  specialization: string | null;
}

interface TeacherStore {
  profile: TeacherProfile | null;
  courses: TeacherCourse[];
  loading: boolean;
  setProfile: (profile: TeacherProfile) => void;
  setCourses: (courses: TeacherCourse[]) => void;
  setLoading: (loading: boolean) => void;
  clearTeacher: () => void;
}

export const useTeacherStore = create<TeacherStore>((set) => ({
  profile: null,
  courses: [],
  loading: true,

  setProfile: (profile) => set({ profile }),
  setCourses: (courses) => set({ courses }),
  setLoading: (loading) => set({ loading }),
  clearTeacher: () => set({ profile: null, courses: [], loading: false }),
}));
