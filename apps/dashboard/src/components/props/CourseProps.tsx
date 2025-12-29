import { AboutCourse } from '../course-details/types/AboutCourse';

export interface CourseTeacher {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  bio?: string | null;
  specialization?: string | null;
}

export interface CourseInstructor {
  name: string;
  image: string;
  designation: string;
}

export interface CurriculumClass {
  id: string;
  title: string;
  videoUrl?: string | null;
}

export interface CurriculumMaterial {
  id: string;
  title: string;
  fileUrl?: string | null;
}

export interface Curriculum {
  id?: string;
  title: string;
  details: string;
  classes?: CurriculumClass[];
  materials?: CurriculumMaterial[];
}

export interface CourseProps {
  id: string;
  title: string;
  description?: string;
  batchNo: string;
  heroImage: string;
  courseType: 'live' | 'record';
  level: 'beginner' | 'intermediate' | 'advanced';
  feeType: 'free' | 'paid';
  price?: number;
  type: string;
  teachers: CourseTeacher[]; // Teachers from CourseTeacher junction table
  assignedTeachers: string[]; // Array of teacher IDs for form handling
  category?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  numClasses: number;
  courseInstructors: CourseInstructor[];
  status: 'Active' | 'Deactive';
  aboutCourse: AboutCourse;
  curriculum: Curriculum[];
  classRoutinePdf?: string;
  facebookGroupLink?: string;
  introVideoLink?: string | null;
  numOfStudents?: number | null;
}
