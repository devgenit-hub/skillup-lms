'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import CategoryAutocomplete from '@/components/ui/CategoryAutocomplete';
import { useCategoryStore } from '@/lib/zustand/category-store';
import { STORAGE_BUCKETS, uploadFile } from '@/lib/supabase/storage';

interface Instructor {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { t } = useLocale();
  const formText = t('forms');
  const buttonText = t('buttons');
  const { addCategory } = useCategoryStore();

  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    published: false,
    batchNo: '',
    heroImage: '',
    introVideoLink: '',
    courseType: 'live' as 'live' | 'record',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    feeType: 'free' as 'free' | 'paid',
    price: '',
    category: '',
    categoryId: null as string | null,
    numClasses: '',
    aboutCourseAbout: '',
    aboutCourseDetails: '',
    classRoutinePdf: '',
    classRoutinePdfName: '',
  });

  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>([]);
  const [isPdfDragging, setIsPdfDragging] = useState(false);

  // Ref to store latest category values (bypasses React state batching)
  const categoryDataRef = useRef({ category: '', categoryId: null as string | null });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await apiClient.getTeachers();
      if (response.data && Array.isArray(response.data)) {
        // Get users with INSTRUCTOR or ADMIN role
        const instructorUsers = response.data as Instructor[];
        setInstructors(instructorUsers);
      }
    } catch {
      toast.error('Failed to load instructors');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleTeacherToggle = (teacherId: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     assignedTeachers: prev.assignedTeachers.includes(teacherId)
  //       ? prev.assignedTeachers.filter((id) => id !== teacherId)
  //       : [...prev.assignedTeachers, teacherId],
  //   }));
  // };

  const handleInstructorToggle = (instructorId: string) => {
    setSelectedInstructorIds((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPdfDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    try {
      toast.loading('Uploading PDF...', { id: 'pdf-upload' });
      const fileUrl = await uploadFile(file, STORAGE_BUCKETS.CLASS_ROUTINES, 'routines');
      setFormData((prev) => ({
        ...prev,
        classRoutinePdf: fileUrl,
        classRoutinePdfName: file.name,
      }));
      toast.success('PDF uploaded successfully', { id: 'pdf-upload' });
    } catch {
      toast.error('Failed to upload PDF', { id: 'pdf-upload' });
    }
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPdfDragging(true);
  };

  const handlePdfDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPdfDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Course title is required');
      return;
    }

    if (selectedInstructorIds.length === 0) {
      toast.error('Please select at least one instructor');
      return;
    }

    try {
      setLoading(true);

      const currentCategory = categoryDataRef.current.category;
      const currentCategoryId = categoryDataRef.current.categoryId;

      const metadata = {
        batchNo: formData.batchNo,
        heroImage: formData.heroImage,
        courseType: formData.courseType,
        level: formData.level,
        numClasses: formData.numClasses ? parseInt(formData.numClasses) : undefined,
        aboutCourse: {
          about: formData.aboutCourseAbout,
          details: formData.aboutCourseDetails,
        },
        classRoutinePdf: formData.classRoutinePdf,
      };

      const response = await apiClient.createCourse({
        title: formData.title,
        description: formData.description || undefined,
        published: formData.published,
        introVideoLink: formData.introVideoLink || undefined,
        feeType: formData.feeType === 'paid' ? 'PAID' : 'FREE',
        price: formData.feeType === 'paid' ? parseFloat(formData.price) || null : null,
        categoryId: currentCategoryId || undefined,
        categoryTitle: !currentCategoryId && currentCategory ? currentCategory : undefined,
        metadata,
      });

      // Add new category to store if created
      const result = response.data as {
        course?: { category?: { id: string; title: string; slug: string } };
        newCategory?: { id: string; title: string; slug: string };
      };
      if (result.newCategory) {
        addCategory({ ...result.newCategory, courseCount: 1, webinarCount: 0 });
        toast.success(`Created new category: ${result.newCategory.title}`);
      }

      // Assign all selected teachers to the course via CourseTeacher table
      const courseData = result.course || response.data;
      if (courseData && selectedInstructorIds.length > 0) {
        const courseId = (courseData as { id: string }).id;
        await apiClient.assignCourseTeachers(courseId, selectedInstructorIds);
      }

      toast.success('Course created successfully!');
      router.push('/superuser/courses');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={formText['create_course_title']}
        description={formText['create_course_subtitle']}
      />

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
                placeholder="e.g., ফুল স্ট্যাক ওয়েব ডেভেলপমেন্ট কোর্স"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['batch_number']} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., ব্যাচ-০১"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="Brief description of the course..."
              />
            </div>

            <ImageUpload
              value={formData.heroImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, heroImage: url }))}
              bucket={STORAGE_BUCKETS.COURSES}
              label={formText['hero_image']}
              variant="hero"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Intro Video Link{' '}
                <span className="text-slate-500 text-xs">(YouTube or online video URL)</span>
              </label>
              <input
                type="url"
                name="introVideoLink"
                value={formData.introVideoLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
        </section>

        {/* Course Configuration Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['course_configuration']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['course_type']} <span className="text-red-500">*</span>
              </label>
              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="live">{formText['live']}</option>
                <option value="record">{formText['record']}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['level']} <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="beginner">{formText['beginner']}</option>
                <option value="intermediate">{formText['intermediate']}</option>
                <option value="advanced">{formText['advanced']}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['fee_type']} <span className="text-red-500">*</span>
              </label>
              <select
                name="feeType"
                value={formData.feeType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="free">{formText['free']}</option>
                <option value="paid">{formText['paid']}</option>
              </select>
            </div>

            {formData.feeType === 'paid' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {formText['price']} (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                  placeholder="৳ ৫০০০"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['category']} <span className="text-red-500">*</span>
              </label>
              <CategoryAutocomplete
                value={formData.category}
                onChange={(value) => {
                  categoryDataRef.current.category = value;
                  setFormData((prev) => ({ ...prev, category: value }));
                }}
                onCategoryIdChange={(categoryId) => {
                  categoryDataRef.current.categoryId = categoryId;
                  setFormData((prev) => ({ ...prev, categoryId }));
                }}
                placeholder="e.g., Web Development"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['num_classes']} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numClasses"
                value={formData.numClasses}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., 24"
              />
            </div>
          </div>
        </section>

        {/* Course Instructors Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Course Instructors <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Select one or more instructors for this course.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instructors.map((instructor) => (
              <label
                key={instructor.id}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedInstructorIds.includes(instructor.id)
                    ? 'border-vibrant-blue bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedInstructorIds.includes(instructor.id)}
                  onChange={() => handleInstructorToggle(instructor.id)}
                  className="appearance-none w-5 h-5 text-vibrant-blue bg-transparent border-2 border-slate-400 rounded focus:ring-2 focus:ring-vibrant-blue focus:ring-offset-2 cursor-pointer checked:bg-vibrant-blue checked:border-vibrant-blue transition-colors relative checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-sm checked:after:font-bold"
                />
                <div className="shrink-0">
                  {instructor.avatarUrl ? (
                    <Image
                      src={instructor.avatarUrl}
                      alt={instructor.name || 'Instructor'}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-vibrant-blue to-dark-blue flex items-center justify-center text-white font-bold text-lg">
                      {(instructor.name || instructor.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {instructor.name || 'No Name'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{instructor.email}</p>
                </div>
              </label>
            ))}
          </div>

          {selectedInstructorIds.length === 0 && (
            <p className="mt-3 text-sm text-red-500">Please select at least one instructor</p>
          )}
          {selectedInstructorIds.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                ✓ {selectedInstructorIds.length} instructor
                {selectedInstructorIds.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </section>

        {/* About Course Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['about_course']}
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                বিবরণ (Markdown) *
              </label>
              <RichTextEditor
                value={formData.aboutCourseDetails}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, aboutCourseDetails: value }))
                }
                placeholder="কোর্স সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                minHeight="150px"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                কোর্স বিষয়বস্তু (Markdown) *
              </label>
              <RichTextEditor
                value={formData.aboutCourseAbout}
                onChange={(value) => setFormData((prev) => ({ ...prev, aboutCourseAbout: value }))}
                placeholder="মূল তথ্য এবং কোর্সের বিষয়বস্তু লিখুন..."
                minHeight="150px"
              />
            </div>
          </div>
        </section>

        {/* Class Routine PDF Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['class_routine_pdf']}
          </h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {formText['class_routine_pdf']}
            </label>
            <div className="relative">
              <input
                type="file"
                id="classRoutinePdf"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({
                      ...prev,
                      classRoutinePdf: fileUrl,
                      classRoutinePdfName: file.name,
                    }));
                  }
                }}
                className="hidden"
              />
              <div
                onDrop={handlePdfDrop}
                onDragOver={handlePdfDragOver}
                onDragLeave={handlePdfDragLeave}
                onClick={() => document.getElementById('classRoutinePdf')?.click()}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  isPdfDragging
                    ? 'border-vibrant-blue bg-blue-50 scale-[1.02]'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {formData.classRoutinePdf ? (
                  <div className="relative group flex flex-col items-center justify-center">
                    {/* Floating delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({
                          ...prev,
                          classRoutinePdf: '',
                          classRoutinePdfName: '',
                        }));
                        toast.success('PDF removed successfully');
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
                      title="Remove PDF"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      {formData.classRoutinePdfName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Click or drag to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    {isPdfDragging ? (
                      <>
                        <div className="p-3 rounded-full bg-vibrant-blue mb-2">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-vibrant-blue font-semibold">Drop PDF here</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600 font-medium">
                          <span className="text-vibrant-blue">Click to upload</span> or drag and
                          drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PDF files only</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {formData.classRoutinePdfName && (
              <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                <span className="font-medium">Selected file:</span>
                <span className="text-slate-800 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                  {formData.classRoutinePdfName}
                </span>
              </p>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex items-center flex-col justify-end gap-8 pt-6 border-t border-slate-200">
          {/* Draft Note */}
          <div className="flex-1">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div className="text-sm">
                  <p className="text-red-500 font-medium mb-1">Creating as Draft</p>
                  <p className="text-blue-700">
                    These basic details will be saved as a draft. You can always publish the course
                    later using the <strong>publish eye button</strong> and edit all its contents
                    through the course management (Edit) panel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end w-full">
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
              {loading ? 'Creating...' : formText['create_course']}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
