'use client';

import { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import type { CourseProps } from '@/components/props/CourseProps';
import { toast } from 'sonner';
import { ImageUpload } from './ImageUpload';
import { RichTextEditor } from './RichTextEditor';
import CategoryAutocomplete from './CategoryAutocomplete';
import { STORAGE_BUCKETS, uploadFile } from '@/lib/supabase/storage';

interface EditCourseFormProps {
  course: CourseProps;
  onSave: (updatedCourse: CourseProps) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function EditCourseForm({
  course,
  onSave,
  onCancel,
  isSaving = false,
}: EditCourseFormProps) {
  const [formData, setFormData] = useState({
    title: course.title || '',
    description: course.description || '',
    batchNo: course.batchNo || '',
    heroImage: course.heroImage || '',
    courseType: course.courseType || ('live' as 'live' | 'record'),
    level: course.level || ('beginner' as 'beginner' | 'intermediate' | 'advanced'),
    feeType: course.feeType || ('free' as 'free' | 'paid'),
    price: course.price?.toString() || '',
    assignedTeachers: course.assignedTeachers || ([] as string[]),
    category: course.category?.title || '',
    categoryId: course.category?.id || null,
    numClasses: course.numClasses?.toString() || '',
    aboutCourseAbout: course.aboutCourse?.about || '',
    aboutCourseDetails: course.aboutCourse?.details || '',
    classRoutinePdf: course.classRoutinePdf || '',
    introVideoLink: course.introVideoLink || '',
  });

  const [isPdfDragging, setIsPdfDragging] = useState(false);
  const [classRoutinePdfName, setClassRoutinePdfName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPdfDragging(true);
  };

  const handlePdfDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPdfDragging(false);
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
      setIsUploading(true);
      toast.loading('Uploading PDF...', { id: 'pdf-upload' });
      const fileUrl = await uploadFile(file, STORAGE_BUCKETS.CLASS_ROUTINES, 'routines');
      setFormData((prev) => ({
        ...prev,
        classRoutinePdf: fileUrl,
      }));
      setClassRoutinePdfName(file.name);
      toast.success('PDF uploaded successfully', { id: 'pdf-upload' });
    } catch {
      toast.error('Failed to upload PDF', { id: 'pdf-upload' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCourse: CourseProps & { categoryId?: string | null } = {
      ...course,
      title: formData.title,
      description: formData.description,
      batchNo: formData.batchNo,
      heroImage: formData.heroImage,
      courseType: formData.courseType,
      level: formData.level,
      feeType: formData.feeType,
      price: formData.feeType === 'paid' ? parseFloat(formData.price) : undefined,
      assignedTeachers: formData.assignedTeachers,
      numClasses: parseInt(formData.numClasses),
      classRoutinePdf: formData.classRoutinePdf,
      introVideoLink: formData.introVideoLink || null,
      courseInstructors: course.courseInstructors || [],
      aboutCourse: {
        about: formData.aboutCourseAbout,
        details: formData.aboutCourseDetails,
      },
      // Use the new category title from form, or keep existing category object if unchanged
      category: formData.category
        ? {
            id: formData.categoryId || '',
            title: formData.category,
            slug: '',
          }
        : course.category,
      // Pass the categoryId for the API update
      categoryId: formData.categoryId,
    };

    onSave(updatedCourse);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Course Title *
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
              Batch Number *
            </label>
            <input
              type="text"
              name="batchNo"
              value={formData.batchNo}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
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
            label="Hero Image *"
            variant="hero"
            onUploadStateChange={setIsUploading}
          />
        </div>
      </section>

      {/* Course Configuration Section */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Course Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course Type *</label>
            <select
              name="courseType"
              value={formData.courseType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
            >
              <option value="live">Live</option>
              <option value="record">Record</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Fee Type *</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {formData.feeType === 'paid' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Course Price (৳ BDT) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
            <CategoryAutocomplete
              value={formData.category}
              onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              onCategoryIdChange={(categoryId) => setFormData((prev) => ({ ...prev, categoryId }))}
              placeholder="e.g., Web Development"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Number of Classes *
            </label>
            <input
              type="number"
              name="numClasses"
              value={formData.numClasses}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* About Course Section */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          About Course
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Intro Video Link
            </label>
            <input
              type="url"
              name="introVideoLink"
              value={formData.introVideoLink}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              বিবরণ (Markdown) *
            </label>
            <RichTextEditor
              value={formData.aboutCourseDetails}
              onChange={(value) => setFormData((prev) => ({ ...prev, aboutCourseDetails: value }))}
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
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Class Routine
        </h3>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Class Routine PDF
          </label>
          <div className="relative">
            <input
              type="file"
              id="classRoutinePdfEdit"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.type !== 'application/pdf') {
                    toast.error('Please upload a PDF file');
                    return;
                  }
                  const fileUrl = URL.createObjectURL(file);
                  setFormData((prev) => ({
                    ...prev,
                    classRoutinePdf: fileUrl,
                  }));
                  setClassRoutinePdfName(file.name);
                  toast.success('PDF uploaded successfully');
                }
              }}
              className="hidden"
            />
            <div
              onDrop={handlePdfDrop}
              onDragOver={handlePdfDragOver}
              onDragLeave={handlePdfDragLeave}
              onClick={() => document.getElementById('classRoutinePdfEdit')?.click()}
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
                      }));
                      setClassRoutinePdfName('');
                      toast.success('PDF removed successfully');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
                    title="Remove PDF"
                  >
                    <X size={12} />
                  </button>

                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    {classRoutinePdfName || 'PDF selected'}
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
                        <span className="text-vibrant-blue">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PDF files only</p>
                    </>
                  )}
                </div>
              )}
            </div>
            {classRoutinePdfName && (
              <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                <span className="font-medium">Selected file:</span>
                <span className="text-slate-800 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                  {classRoutinePdfName}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || isUploading}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
