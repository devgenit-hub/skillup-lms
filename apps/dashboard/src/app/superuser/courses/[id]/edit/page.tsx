'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import type { CourseInstructor, Curriculum } from '@/components/props/CourseProps';

interface Instructor {
  id: string;
  name: string | null;
  email: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  published: boolean;
  instructorId: string;
  metadata: Record<string, unknown>;
  instructor: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { t } = useLocale();
  const formText = t('forms');
  const buttonText = t('buttons');

  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructorId: '',
    published: false,
    batchNo: '',
    heroImage: '',
    courseType: 'live' as 'live' | 'record',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    feeType: 'free' as 'free' | 'paid',
    price: '',
    category: '',
    numClasses: '',
    aboutCourseAbout: '',
    aboutCourseDetails: '',
    classRoutinePdf: '',
    introVideoLink: '',
  });

  const [courseInstructors, setCourseInstructors] = useState<CourseInstructor[]>([
    { name: '', image: '', designation: '' },
  ]);

  const [curriculum, setCurriculum] = useState<Curriculum[]>([{ title: '', details: '' }]);

  const fetchInstructors = useCallback(async () => {
    try {
      const response = await apiClient.getTeachers();
      if (response.data && Array.isArray(response.data)) {
        setInstructors(response.data as Instructor[]);
      }
    } catch {
      toast.error('Failed to load instructors');
    }
  }, []);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await apiClient.getCourseById(courseId);
      if (response.data) {
        const course = response.data as CourseData;
        const metadata = (course.metadata || {}) as Record<string, unknown>;
        const aboutCourse = (metadata.aboutCourse || {}) as Record<string, unknown>;

        setFormData({
          title: course.title,
          description: course.description || '',
          instructorId: course.instructorId,
          published: course.published,
          batchNo: (metadata.batchNo as string) || '',
          heroImage: (metadata.heroImage as string) || '',
          courseType: (metadata.courseType as 'live' | 'record') || 'live',
          level: (metadata.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
          feeType: (metadata.feeType as 'free' | 'paid') || 'free',
          price: (metadata.price as number)?.toString() || '',
          category: (metadata.category as string) || '',
          numClasses: (metadata.numClasses as number)?.toString() || '',
          aboutCourseAbout: (aboutCourse.about as string) || '',
          aboutCourseDetails: (aboutCourse.details as string) || '',
          classRoutinePdf: (metadata.classRoutinePdf as string) || '',
          introVideoLink: (metadata.introVideoLink as string) || '',
        });

        if (metadata.courseInstructors && Array.isArray(metadata.courseInstructors)) {
          setCourseInstructors(metadata.courseInstructors as CourseInstructor[]);
        }

        if (metadata.curriculum && Array.isArray(metadata.curriculum)) {
          setCurriculum(metadata.curriculum as Curriculum[]);
        }
      }
    } catch {
      toast.error('Failed to load course');
    } finally {
      setFetchingCourse(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchInstructors();
    fetchCourse();
  }, [courseId, fetchInstructors, fetchCourse]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type ===
        '       d pa  ages/d  && pnpm prisma migrate dev --name add_intro_video_link_to_ccurse packages/db && pnpm prisma migrate dev --name add_intro_video_link_to_course'
          ? checked
          : value,
    }));
  };

  // These functions can be used later for advanced course editing
  // const addCourseInstructor = () => {
  //   setCourseInstructors([...courseInstructors, { name: '', image: '', designation: '' }]);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Course title is required');
      return;
    }

    if (!formData.instructorId) {
      toast.error('Please select an instructor');
      return;
    }

    try {
      setLoading(true);

      const metadata = {
        batchNo: formData.batchNo,
        heroImage: formData.heroImage,
        courseType: formData.courseType,
        level: formData.level,
        category: formData.category,
        numClasses: formData.numClasses ? parseInt(formData.numClasses) : undefined,
        aboutCourse: {
          about: formData.aboutCourseAbout,
          details: formData.aboutCourseDetails,
        },
        classRoutinePdf: formData.classRoutinePdf,
        courseInstructors: courseInstructors.filter(
          (instructor) => instructor.name && instructor.image && instructor.designation
        ),
        curriculum: curriculum.filter((item) => item.title && item.details),
      };

      await apiClient.updateCourse(courseId, {
        title: formData.title,
        description: formData.description || undefined,
        published: formData.published,
        introVideoLink: formData.introVideoLink || undefined,
        feeType: formData.feeType === 'paid' ? 'PAID' : 'FREE',
        price: formData.feeType === 'paid' ? parseFloat(formData.price) || null : null,
        metadata,
      });

      toast.success('Course updated successfully!');
      router.push('/superuser/courses');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCourse) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Course" description="Update course information and settings" />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
      >
        {/* Basic Information Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['basic_information']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['course_title']} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Instructor <span className="text-red-500">*</span>
              </label>
              <select
                name="instructorId"
                value={formData.instructorId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              >
                <option value="">Select an instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name || instructor.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-vibrant-blue border-slate-300 rounded focus:ring-vibrant-blue "
                />
                <span className="text-sm font-semibold text-slate-700">Publish Course</span>
              </label>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push('/superuser/courses')}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            disabled={loading}
          >
            {buttonText['cancel']}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Updating...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
