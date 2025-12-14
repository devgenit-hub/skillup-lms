'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import type { CourseInstructor, Curriculum } from '@/components/props/CourseProps';
import { useLocale } from '@/providers/locale-provider';

export default function CreateCoursePage() {
  const { t } = useLocale();
  const formText = t('forms');
  const buttonText = t('buttons');

  const [formData, setFormData] = useState({
    title: '',
    batchNo: '',
    heroImage: '',
    courseType: 'live' as 'live' | 'record',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    feeType: 'free' as 'free' | 'paid',
    price: '',
    assignedTeachers: [] as string[],
    category: '',
    numClasses: '',
    aboutCourseAbout: '',
    aboutCourseDetails: '',
    classRoutinePdf: '',
  });

  const [courseInstructors, setCourseInstructors] = useState<CourseInstructor[]>([
    { name: '', image: '', designation: '' },
  ]);

  const [curriculum, setCurriculum] = useState<Curriculum[]>([{ title: '', details: '' }]);

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

  const addCourseInstructor = () => {
    setCourseInstructors([...courseInstructors, { name: '', image: '', designation: '' }]);
  };

  const removeCourseInstructor = (index: number) => {
    setCourseInstructors(courseInstructors.filter((_, i) => i !== index));
  };

  const updateCourseInstructor = (index: number, field: keyof CourseInstructor, value: string) => {
    const updated = [...courseInstructors];
    if (updated[index]) {
      updated[index][field] = value;
    }
    setCourseInstructors(updated);
  };

  const addCurriculum = () => {
    setCurriculum([...curriculum, { title: '', details: '' }]);
  };

  const removeCurriculum = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  const updateCurriculum = (index: number, field: keyof Curriculum, value: string) => {
    const updated = [...curriculum];
    if (updated[index]) {
      updated[index][field] = value;
    }
    setCurriculum(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      ...formData,
      price: formData.feeType === 'paid' ? parseFloat(formData.price) : undefined,
      numClasses: parseInt(formData.numClasses),
      courseInstructors: courseInstructors.filter(
        (instructor) => instructor.name && instructor.image && instructor.designation
      ),
      curriculum: curriculum.filter((item) => item.title && item.details),
      aboutCourse: {
        about: formData.aboutCourseAbout,
        details: formData.aboutCourseDetails,
      },
    };

    console.log('Course Data:', courseData);
    // Here you would typically send this to your API
    alert('Course created successfully! Check console for data.');
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['hero_image']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="heroImage"
                  name="heroImage"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // For now, create a local URL. In production, upload to server
                      const imageUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({ ...prev, heroImage: imageUrl }));
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="heroImage"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  {formData.heroImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={formData.heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 hover:opacity-100 font-medium">
                          {formText['click_to_change_image']}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-600 font-medium">
                        <span className="text-vibrant-blue">{formText['click_to_upload']}</span>
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      <p className="text-sm text-rose-500 font-bold mt-1">
                        {formText['recommended_aspect_ratio']}
                      </p>
                    </div>
                  )}
                </label>
              </div>
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
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., Web Development"
              />
              <select
                hidden
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="webdev">Web Development</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobiledev">Mobile Development</option>
                <option value="devOps">DevOps</option>
                <option value="ui-ux">UI/UX</option>
                <option value="others">Others</option>
              </select>
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
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{formText['course_instructors']}</h2>
            <button
              type="button"
              onClick={addCourseInstructor}
              className="flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
            >
              <PlusCircle size={18} />
              {formText['add_instructor']}
            </button>
          </div>

          <div className="space-y-4">
            {courseInstructors.map((instructor, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">Instructor {index + 1}</h3>
                  {courseInstructors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourseInstructor(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {formText['instructor_name']}
                    </label>
                    <input
                      type="text"
                      value={instructor.name}
                      onChange={(e) => updateCourseInstructor(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {formText['instructor_image_url']}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id={`instructorImage-${index}`}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            updateCourseInstructor(index, 'image', imageUrl);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`instructorImage-${index}`}
                        className="flex items-center justify-center w-full px-3 py-2 border border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                      >
                        {instructor.image ? (
                          <div className="flex items-center gap-2 w-full">
                            <img
                              src={instructor.image}
                              alt="Preview"
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-sm text-slate-600 truncate flex-1">
                              Image selected
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Upload size={16} />
                            <span>Choose image</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {formText['instructor_designation']}
                    </label>
                    <input
                      type="text"
                      value={instructor.designation}
                      onChange={(e) => updateCourseInstructor(index, 'designation', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                      placeholder="ব্যাকএন্ড ডেভেলপার"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <textarea
                name="aboutCourseDetails"
                value={formData.aboutCourseDetails}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
                placeholder="কোর্স সম্পর্কে বিস্তারিত বিবরণ মার্কডাউন ফরম্যাটে লিখুন..."
              />
              <p className="mt-1 text-xs text-slate-500">
                Supports Markdown formatting (e.g., **bold**, *italic*, lists)
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                কোর্স বিষয়বস্তু (Markdown) *
              </label>
              <textarea
                name="aboutCourseAbout"
                value={formData.aboutCourseAbout}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
                placeholder="মার্কডাউন তালিকা হিসেবে মূল তথ্য যোগ করুন: - পয়েন্ট ১ - পয়েন্ট ২ - পয়েন্ট ৩"
              />
              <p className="mt-1 text-xs text-slate-500">
                Use markdown lists for structured information
              </p>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{formText['curriculum']}</h2>
            <button
              type="button"
              onClick={addCurriculum}
              className="flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
            >
              <PlusCircle size={18} />
              {formText['add_curriculum_item']}
            </button>
          </div>

          <div className="space-y-4">
            {curriculum.map((item, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">Module {index + 1}</h3>
                  {curriculum.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCurriculum(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {formText['curriculum_title']}
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateCurriculum(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                      placeholder="e.g., Introduction to React Hooks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {formText['curriculum_details']}
                    </label>
                    <textarea
                      value={item.details}
                      onChange={(e) => updateCurriculum(index, 'details', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white resize-vertical"
                      placeholder="Brief description of what will be covered in this module..."
                    />
                  </div>
                </div>
              </div>
            ))}
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
                    }));
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="classRoutinePdf"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                {formData.classRoutinePdf ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{formText['pdf_selected']}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formText['click_to_change_file']}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-10 h-10 mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">
                      <span className="text-vibrant-blue">{formText['click_to_upload']}</span> PDF
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{formText['pdf_files_only']}</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            {buttonText['cancel']}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium"
          >
            {formText['create_course']}
          </button>
        </div>
      </form>
    </div>
  );
}
