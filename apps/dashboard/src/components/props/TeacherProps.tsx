export interface TeacherProps {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  image?: string; // Legacy field for dummy data
  designation?: string;
  specialization?: string | null;
  bio?: string | null;
  assignedCourses?: number;
}
