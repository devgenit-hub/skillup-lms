import { AboutCourse } from '../course-details/types/AboutCourse';

export interface CourseInstructor {
  name: string;
  image: string;
  designation: string;
}

export interface Curriculum {
  title: string;
  details: string;
}

export interface CourseProps {
  id: string;
  title: string;
  batchNo: string;
  heroImage: string;
  courseType: 'live' | 'record';
  level: 'beginner' | 'intermediate' | 'advanced';
  feeType: 'free' | 'paid';
  price?: number;
  type: string;
  instructorId: string | null;
  assignedTeachers: string[]; // Array of teacher IDs
  category: 'webdev' | 'frontend' | 'backend' | 'mobiledev' | 'devOps' | 'ui-ux' | 'others';
  numClasses: number;
  courseInstructors: CourseInstructor[];
  status: 'Active' | 'Deactive';
  aboutCourse: AboutCourse;
  curriculum: Curriculum[];
  classRoutinePdf?: string;
  numOfStudents?: number | null;
}
