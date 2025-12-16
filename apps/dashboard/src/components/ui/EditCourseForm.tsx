'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import type { CourseInstructor, Curriculum, CourseProps } from '@/components/props/CourseProps';
import { teachers } from '@/lib/dummy-data';

interface EditCourseFormProps {
  course: CourseProps;
  onSave: (updatedCourse: CourseProps) => void;
  onCancel: () => void;
}

export default function EditCourseForm({ course, onSave, onCancel }: EditCourseFormProps) {
  const [formData, setFormData] = useState({
    title: course.title || '',
    batchNo: course.batchNo || '',
    heroImage: course.heroImage || '',
    courseType: course.courseType || ('live' as 'live' | 'record'),
    level: course.level || ('beginner' as 'beginner' | 'intermediate' | 'advanced'),
    feeType: course.feeType || ('free' as 'free' | 'paid'),
    price: course.price?.toString() || '',
    assignedTeachers: course.assignedTeachers || ([] as string[]),
    category: course.category || '',
    numClasses: course.numClasses?.toString() || '',
    aboutCourseAbout: course.aboutCourse?.about || '',
    aboutCourseDetails: course.aboutCourse?.details || '',
    classRoutinePdf: course.classRoutinePdf || '',
  });

  const [courseInstructors, setCourseInstructors] = useState<CourseInstructor[]>(
    course.courseInstructors || [{ name: '', image: '', designation: '' }]
  );

  const [curriculum, setCurriculum] = useState<Curriculum[]>(
    course.curriculum || [{ title: '', details: '' }]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeacherToggle = (teacherId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedTeachers: prev.assignedTeachers.includes(teacherId)
        ? prev.assignedTeachers.filter((id) => id !== teacherId)
        : [...prev.assignedTeachers, teacherId],
    }));
  };

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

    const updatedCourse: CourseProps = {
      ...course,
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hero Image *</label>
            <div className="relative">
              <input
                type="file"
                id="heroImageEdit"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({ ...prev, heroImage: imageUrl }));
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="heroImageEdit"
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
                        Click to change image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-600 font-medium">Click to upload</p>
                  </div>
                )}
              </label>
            </div>
          </div>
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
                Course Price (USD) *
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
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
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

      {/* Assign Teachers Section */}
      <section hidden>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Assign Teachers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => handleTeacherToggle(teacher.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.assignedTeachers.includes(teacher.id)
                  ? 'border-vibrant-blue bg-light-blue/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{teacher.name}</p>
                  <p className="text-sm text-slate-600">{teacher.email}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    formData.assignedTeachers.includes(teacher.id)
                      ? 'bg-vibrant-blue border-vibrant-blue'
                      : 'border-slate-300'
                  }`}
                >
                  {formData.assignedTeachers.includes(teacher.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Instructors Section */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Course Instructors</h3>
          <button
            type="button"
            onClick={addCourseInstructor}
            className="flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
          >
            <PlusCircle size={18} />
            Add Instructor
          </button>
        </div>

        <div className="space-y-4">
          {courseInstructors.map((instructor, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-slate-700">Instructor {index + 1}</h4>
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
                  <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={instructor.name}
                    onChange={(e) => updateCourseInstructor(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      id={`instructorImageEdit-${index}`}
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
                      htmlFor={`instructorImageEdit-${index}`}
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
                    Designation
                  </label>
                  <input
                    type="text"
                    value={instructor.designation}
                    placeholder="Backend Developer"
                    onChange={(e) => updateCourseInstructor(index, 'designation', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
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
              About (Markdown) *
            </label>
            <textarea
              name="aboutCourseAbout"
              value={formData.aboutCourseAbout}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Details (Markdown) *
            </label>
            <textarea
              name="aboutCourseDetails"
              value={formData.aboutCourseDetails}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
            />
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Course Curriculum</h3>
          <button
            type="button"
            onClick={addCurriculum}
            className="flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
          >
            <PlusCircle size={18} />
            Add Curriculum Item
          </button>
        </div>

        <div className="space-y-4">
          {curriculum.map((item, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-slate-700">Module {index + 1}</h4>
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
                  <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateCurriculum(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Details</label>
                  <textarea
                    value={item.details}
                    onChange={(e) => updateCurriculum(index, 'details', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white resize-vertical"
                  />
                </div>
              </div>
            </div>
          ))}
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
              htmlFor="classRoutinePdfEdit"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              {formData.classRoutinePdf ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">PDF selected</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-10 h-10 mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload PDF</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </section>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
