import type { CourseProps } from '../components/props/CourseProps';
import type { TeacherProps } from '../components/props/TeacherProps';
// src/lib/dummy-data.js
export const courses: CourseProps[] = [
  {
    id: 'c1',
    title: 'Intro to React',
    batchNo: 'BATCH-001',
    heroImage: '/CourseDetails/course1.jpg',
    courseType: 'live',
    level: 'beginner',
    feeType: 'paid',
    price: 4999,
    type: 'Development',
    teachers: [],
    assignedTeachers: ['t1'],
    category: {
      id: 'cat1',
      title: 'Frontend Development',
      slug: 'frontend',
    },
    numClasses: 24,
    courseInstructors: [],
    status: 'Active',
    aboutCourse: {
      about: 'Learn React from scratch',
      details: 'Comprehensive introduction to React development',
    },
    curriculum: [{ title: 'Introduction to React', details: 'Basic concepts' }],
  },
  {
    id: 'c2',
    title: 'Advanced UX Principles',
    batchNo: 'BATCH-002',
    heroImage: '/CourseDetails/course2.jpg',
    courseType: 'record',
    level: 'intermediate',
    feeType: 'paid',
    price: 5999,
    type: 'Design',
    teachers: [],
    assignedTeachers: ['t2'],
    category: {
      id: 'cat2',
      title: 'UI/UX Design',
      slug: 'ui-ux',
    },
    numClasses: 18,
    courseInstructors: [],
    status: 'Deactive',
    aboutCourse: {
      about: 'Master UX design principles',
      details: 'Advanced course on user experience design',
    },
    curriculum: [{ title: 'UX Fundamentals', details: 'Core concepts' }],
  },
  {
    id: 'c3',
    title: 'Next.js for Beginners',
    batchNo: 'BATCH-003',
    heroImage: '/CourseDetails/course3.jpg',
    courseType: 'live',
    level: 'beginner',
    feeType: 'free',
    type: 'Development',
    teachers: [],
    assignedTeachers: [],
    category: {
      id: 'cat3',
      title: 'Web Development',
      slug: 'webdev',
    },
    numClasses: 20,
    courseInstructors: [],
    status: 'Deactive',
    aboutCourse: {
      about: 'Learn Next.js framework',
      details: 'Complete guide to Next.js development',
    },
    curriculum: [{ title: 'Getting Started with Next.js', details: 'Setup and basics' }],
  },
];

export const teachers: TeacherProps[] = [
  {
    id: 't1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    profileImage: '/test_images/avatar3.png',
    designation: 'Senior React Developer',
    assignedCourses: 1,
  },
  {
    id: 't2',
    name: 'John Smith',
    email: 'john@example.com',
    profileImage: '/test_images/avatar2.png',
    designation: 'UX/UI Designer',
    assignedCourses: 1,
  },
  {
    id: 't3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    profileImage: '/test_images/avatar1.png',
    designation: 'Full Stack Developer',
    assignedCourses: 0,
  },
  {
    id: 't4',
    name: 'Bob Williams',
    email: 'bob@example.com',
    profileImage: null,
    designation: 'Backend Specialist',
    assignedCourses: 0,
  },
];

export const stats = {
  totalRevenue: 12500,
  activeStudents: 450,
  webinarRegistrations: 120,
};
// Simulate the currently logged in teacher for the Teacher View
export const currentTeacherId = 't2';
