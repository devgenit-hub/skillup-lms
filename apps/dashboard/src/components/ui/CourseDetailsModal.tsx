'use client';

import { useState, useRef } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  User,
  Check,
  Plus,
  Video,
  FileText,
  Trash2,
  UploadCloud,
  File as FileIcon,
  MonitorPlay,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Edit2,
  Facebook,
} from 'lucide-react';
import { CourseProps, Curriculum } from '../props/CourseProps';
import { TeacherProps } from '../props/TeacherProps';
import Image from 'next/image';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Ban } from 'lucide-react';
import EditCourseForm from './EditCourseForm';

// Extended types for curriculum management
interface ClassItem {
  id: string;
  title: string;
  videoUrl?: string | undefined;
}

interface MaterialItem {
  id: string;
  title: string;
  file?: File | null;
}

interface ExtendedModule extends Curriculum {
  id: string;
  classes: ClassItem[];
  materials: MaterialItem[];
  isOpen: boolean;
}

interface CourseDetailsModalProps {
  course: CourseProps;
  teachers: TeacherProps[];
  isOpen: boolean;
  onClose: () => void;
}

// AssignTeacherTab Component
interface AssignTeacherTabProps {
  availableTeachers: TeacherProps[];
  assignedTeachers: TeacherProps[];
  onAssignTeacher: (teacherId: string) => void;
  onUnassignTeacher: (teacherId: string) => void;
}

function AssignTeacherTab({
  availableTeachers,
  assignedTeachers,
  onAssignTeacher,
  onUnassignTeacher,
}: AssignTeacherTabProps) {
  return (
    <div className="grid grid-cols-2 gap-6 h-full divide-x-4">
      {/* Left: Available Teachers */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Teachers</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {availableTeachers.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No available teachers</p>
          ) : (
            availableTeachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => onAssignTeacher(teacher.id)}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-dark-blue hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    {teacher.image ? (
                      <Image src={teacher.image} alt={teacher.name} fill className="object-cover" />
                    ) : (
                      <User size={32} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{teacher.name}</h4>
                    <p className="text-sm text-slate-600">{teacher.designation}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Assigned Teachers */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Assigned Teachers</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pl-2">
          {assignedTeachers.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No assigned teachers</p>
          ) : (
            assignedTeachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => onUnassignTeacher(teacher.id)}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    {teacher.image ? (
                      <Image src={teacher.image} alt={teacher.name} fill className="object-cover" />
                    ) : (
                      <User size={32} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{teacher.name}</h4>
                    <p className="text-sm text-slate-600">{teacher.designation}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// FacebookGroupTab Component
interface FacebookGroupTabProps {
  fbGroupLink: string;
  setFbGroupLink: (link: string) => void;
  onSubmit: () => void;
}

function FacebookGroupTab({ fbGroupLink, setFbGroupLink, onSubmit }: FacebookGroupTabProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Facebook size={24} className="text-blue-600" />
        Facebook Private Group Link
      </h3>
      <div className="space-y-6">
        {/* Facebook Group Link */}
        <div>
          <label htmlFor="fbGroupLink" className="block text-sm font-medium text-slate-700 mb-2">
            Group Link
          </label>
          <input
            type="url"
            id="fbGroupLink"
            value={fbGroupLink}
            onChange={(e) => setFbGroupLink(e.target.value)}
            placeholder="https://www.facebook.com/groups/your-group"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">
            Enter the full URL of your Facebook private group
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!fbGroupLink.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Facebook size={18} />
          Save Facebook Group Link
        </button>
      </div>
    </div>
  );
}

// CouponTab Component
interface CouponTabProps {
  couponTag: string;
  setCouponTag: (value: string) => void;
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  discount: string;
  onDiscountChange: (value: string) => void;
  onSubmit: () => void;
}

function CouponTab({
  couponTag,
  setCouponTag,
  expiryDate,
  setExpiryDate,
  showCalendar,
  setShowCalendar,
  discount,
  onDiscountChange,
  onSubmit,
}: CouponTabProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Create Course Coupon</h3>
      <div className="space-y-6">
        {/* Coupon Tag */}
        <div>
          <label htmlFor="couponTag" className="block text-sm font-medium text-slate-700 mb-2">
            Coupon Tag
          </label>
          <input
            type="text"
            id="couponTag"
            value={couponTag}
            onChange={(e) => setCouponTag(e.target.value.toUpperCase())}
            placeholder="e.g., SUMMER2024"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none text-left flex items-center justify-between bg-white hover:border-slate-400 transition-colors"
            >
              <span className={expiryDate ? 'text-slate-900' : 'text-slate-400'}>
                {expiryDate
                  ? expiryDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Select expiry date'}
              </span>
              <CalendarIcon size={18} className="text-slate-400" />
            </button>
            {showCalendar && (
              <div className="absolute z-10 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                <DayPicker
                  mode="single"
                  selected={expiryDate}
                  onSelect={(date) => {
                    setExpiryDate(date);
                    setShowCalendar(false);
                  }}
                  disabled={{ before: new Date() }}
                  className="rdp-custom"
                />
              </div>
            )}
          </div>
        </div>

        {/* Discount Percentage */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-slate-700 mb-2">
            Discount Percentage (1-100)
          </label>
          <div className="relative">
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value)}
              min="1"
              max="100"
              placeholder="Enter discount percentage"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              %
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Enter a whole number between 1 and 100</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!couponTag || !expiryDate || !discount}
          className="w-full bg-dark-blue hover:bg-vibrant-blue text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Create Coupon
        </button>
      </div>
    </div>
  );
}

// CurriculumTab Component
interface CurriculumTabProps {
  modules: ExtendedModule[];
  isModuleModalOpen: boolean;
  editingModuleId: string | null;
  modalModuleName: string;
  setModalModuleName: (name: string) => void;
  modalVideoLessons: { title: string; url: string }[];
  modalMaterials: { title: string; file: File | null }[];
  fileInputRefs: React.MutableRefObject<{
    [key: number]: HTMLInputElement | null;
  }>;
  onOpenAddModuleModal: () => void;
  onOpenEditModuleModal: (moduleId: string) => void;
  onCloseModuleModal: () => void;
  onAddVideoLesson: () => void;
  onRemoveVideoLesson: (index: number) => void;
  onUpdateVideoLesson: (index: number, field: 'title' | 'url', value: string) => void;
  onAddMaterialField: () => void;
  onRemoveMaterial: (index: number) => void;
  onUpdateMaterialTitle: (index: number, title: string) => void;
  onHandleFileSelect: (index: number, file: File | null) => void;
  onSaveModule: () => void;
  onToggleModule: (moduleId: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onDeleteClass: (moduleId: string, classId: string) => void;
  onDeleteMaterial: (moduleId: string, materialId: string) => void;
}

function CurriculumTab({
  modules,
  isModuleModalOpen,
  editingModuleId,
  modalModuleName,
  setModalModuleName,
  modalVideoLessons,
  modalMaterials,
  fileInputRefs,
  onOpenAddModuleModal,
  onOpenEditModuleModal,
  onCloseModuleModal,
  onAddVideoLesson,
  onRemoveVideoLesson,
  onUpdateVideoLesson,
  onAddMaterialField,
  onRemoveMaterial,
  onUpdateMaterialTitle,
  onHandleFileSelect,
  onSaveModule,
  onToggleModule,
  onDeleteModule,
  onDeleteClass,
  onDeleteMaterial,
}: CurriculumTabProps) {
  return (
    <div className="space-y-6">
      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingModuleId ? 'Edit Module' : 'Add New Module'}
              </h2>
              <button
                onClick={onCloseModuleModal}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Module Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Module Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalModuleName}
                  onChange={(e) => setModalModuleName(e.target.value)}
                  placeholder="e.g., Introduction to React"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Video Lessons Section */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Video size={20} className="text-emerald-600" />
                    Video Lessons
                  </h3>
                  <button
                    onClick={onAddVideoLesson}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>

                <div className="space-y-3">
                  {modalVideoLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-slate-200 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Video {index + 1}
                        </span>
                        {modalVideoLessons.length > 1 && (
                          <button
                            onClick={() => onRemoveVideoLesson(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => onUpdateVideoLesson(index, 'title', e.target.value)}
                        placeholder="Lesson title"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <input
                        type="url"
                        value={lesson.url}
                        onChange={(e) => onUpdateVideoLesson(index, 'url', e.target.value)}
                        placeholder="Video URL (YouTube, Vimeo, etc.)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Materials Section */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Study Materials
                  </h3>
                  <button
                    onClick={onAddMaterialField}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>

                <div className="space-y-3">
                  {modalMaterials.map((material, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-slate-200 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Material {index + 1}
                        </span>
                        {modalMaterials.length > 1 && (
                          <button
                            onClick={() => onRemoveMaterial(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={material.title}
                        onChange={(e) => onUpdateMaterialTitle(index, e.target.value)}
                        placeholder="Material title"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[index] = el;
                          }}
                          type="file"
                          onChange={(e) => onHandleFileSelect(index, e.target.files?.[0] ?? null)}
                          accept=".pdf,.ppt,.pptx,.doc,.docx"
                          className="hidden"
                          id={`file-modal-${index}`}
                        />
                        <label
                          htmlFor={`file-modal-${index}`}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-2 text-sm"
                        >
                          <UploadCloud size={16} className="text-slate-400" />
                          <span className="text-slate-600">
                            {material.file ? material.file.name : 'Choose file...'}
                          </span>
                        </label>
                        {material.file && (
                          <button
                            onClick={() => onHandleFileSelect(index, null)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={onCloseModuleModal}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSaveModule}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {editingModuleId ? 'Update Module' : 'Save Module'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Curriculum Content */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
        <button
          onClick={onOpenAddModuleModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Add Module
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Module Header */}
            <div
              className={`p-4 flex items-center justify-between cursor-pointer ${
                module.isOpen ? 'bg-slate-50 border-b border-slate-100' : ''
              }`}
              onClick={() => onToggleModule(module.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <GripVertical size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Module {index + 1}: {module.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {module.classes.length} Classes • {module.materials.length} Resources
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditModuleModal(module.id);
                  }}
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteModule(module.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="text-slate-400">
                  {module.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Module Content */}
            {module.isOpen && (
              <div className="p-6 space-y-6">
                {/* Classes Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Video size={16} className="text-emerald-600" />
                      Video Lessons
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {module.classes.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No video lessons added yet.</p>
                        <button
                          onClick={() => onOpenEditModuleModal(module.id)}
                          className="text-sm text-emerald-600 font-medium mt-1 hover:underline"
                        >
                          Add video lessons
                        </button>
                      </div>
                    ) : (
                      module.classes.map((cls) => (
                        <div
                          key={cls.id}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-200 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                              <MonitorPlay size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900">{cls.title}</p>
                              {cls.videoUrl && (
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                  {cls.videoUrl}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={() => onDeleteClass(module.id, cls.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Materials Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      Study Materials
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {module.materials.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No materials uploaded yet.</p>
                        <button
                          onClick={() => onOpenEditModuleModal(module.id)}
                          className="text-sm text-blue-600 font-medium mt-1 hover:underline"
                        >
                          Upload materials
                        </button>
                      </div>
                    ) : (
                      module.materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-200 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 text-red-600">
                              <FileIcon size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{mat.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onDeleteMaterial(module.id, mat.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Start building your curriculum</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Create your first module to start adding video lessons and study materials for your
            students.
          </p>
          <button
            onClick={onOpenAddModuleModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create First Module
          </button>
        </div>
      )}
    </div>
  );
}

export default function CourseDetailsModal({
  course,
  teachers,
  isOpen,
  onClose,
}: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<
    'assign-teacher' | 'coupon' | 'edit' | 'curriculum' | 'facebook-group'
  >('assign-teacher');
  const [assignedTeacherIds, setAssignedTeacherIds] = useState<string[]>(
    course.assignedTeachers || []
  );

  // Facebook Group Link state
  const [fbGroupLink, setFbGroupLink] = useState('');

  // Coupon form state
  const [couponTag, setCouponTag] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [discount, setDiscount] = useState('');

  // Curriculum management state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [modalModuleName, setModalModuleName] = useState('');
  const [modalVideoLessons, setModalVideoLessons] = useState<{ title: string; url: string }[]>([
    { title: '', url: '' },
  ]);
  const [modalMaterials, setModalMaterials] = useState<{ title: string; file: File | null }[]>([
    { title: '', file: null },
  ]);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Initialize modules from course curriculum
  const [modules, setModules] = useState<ExtendedModule[]>(() => {
    if (!course?.curriculum) return [];
    return course.curriculum.map((item, index) => ({
      ...item,
      id: `mod-${index}`,
      classes: [
        {
          id: `cls-${index}-1`,
          title: 'Introduction to Module',
          videoUrl: '',
        },
      ],
      materials: [
        {
          id: `mat-${index}-1`,
          title: 'Module Slides',
          file: null,
        },
      ],
      isOpen: index === 0,
    }));
  });

  if (!isOpen) return null;

  const availableTeachers = teachers.filter((t) => !assignedTeacherIds.includes(t.id));
  const assignedTeachers = teachers.filter((t) => assignedTeacherIds.includes(t.id));

  const handleAssignTeacher = (teacherId: string) => {
    setAssignedTeacherIds([...assignedTeacherIds, teacherId]);
  };

  const handleUnassignTeacher = (teacherId: string) => {
    setAssignedTeacherIds(assignedTeacherIds.filter((id) => id !== teacherId));
  };

  const handleDiscountChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 100)) {
      setDiscount(value);
    }
  };

  const handleCouponSubmit = () => {
    // Handle coupon creation logic here

    // Reset form
    setCouponTag('');
    setExpiryDate(undefined);
    setDiscount('');
    setShowCalendar(false);
  };

  const handleFbGroupSubmit = () => {
    // Handle Facebook group link submission logic here

    alert('Facebook Group Link saved successfully!');
  };

  const handleSaveCourse = (_updatedCourse: CourseProps) => {
    // Handle save logic here (API call)
    alert('Course updated successfully!');
    onClose();
  };

  const handleCancelEdit = () => {
    setActiveTab('assign-teacher');
  };

  // Curriculum management functions
  const toggleModule = (moduleId: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, isOpen: !m.isOpen } : m)));
  };

  const openAddModuleModal = () => {
    setEditingModuleId(null);
    setModalModuleName('');
    setModalVideoLessons([{ title: '', url: '' }]);
    setModalMaterials([{ title: '', file: null }]);
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    setEditingModuleId(moduleId);
    setModalModuleName(module.title);
    setModalVideoLessons(
      module.classes.length > 0
        ? module.classes.map((c) => ({ title: c.title, url: c.videoUrl || '' }))
        : [{ title: '', url: '' }]
    );
    setModalMaterials(
      module.materials.length > 0
        ? module.materials.map((m) => ({
            title: m.title,
            file: m.file || null,
          }))
        : [{ title: '', file: null }]
    );
    setIsModuleModalOpen(true);
  };

  const closeModuleModal = () => {
    setIsModuleModalOpen(false);
    setEditingModuleId(null);
    setModalModuleName('');
    setModalVideoLessons([{ title: '', url: '' }]);
    setModalMaterials([{ title: '', file: null }]);
  };

  const addVideoLesson = () => {
    setModalVideoLessons([...modalVideoLessons, { title: '', url: '' }]);
  };

  const removeVideoLesson = (index: number) => {
    setModalVideoLessons(modalVideoLessons.filter((_, i) => i !== index));
  };

  const updateVideoLesson = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...modalVideoLessons];
    if (updated[index]) {
      updated[index][field] = value;
    }
    setModalVideoLessons(updated);
  };

  const addMaterialField = () => {
    setModalMaterials([...modalMaterials, { title: '', file: null }]);
  };

  const removeMaterial = (index: number) => {
    setModalMaterials(modalMaterials.filter((_, i) => i !== index));
  };

  const updateMaterialTitle = (index: number, title: string) => {
    const updated = [...modalMaterials];
    if (updated[index]) {
      updated[index].title = title;
    }
    setModalMaterials(updated);
  };

  const handleFileSelect = (index: number, file: File | null) => {
    const updated = [...modalMaterials];
    if (updated[index]) {
      updated[index].file = file;
      if (file && !updated[index].title) {
        updated[index].title = file.name;
      }
    }
    setModalMaterials(updated);
  };

  const saveModule = () => {
    if (!modalModuleName.trim()) {
      alert('Please enter a module name');
      return;
    }

    const classes: ClassItem[] = modalVideoLessons
      .filter((v) => v.title.trim() && v.url.trim())
      .map((v, i) => ({
        id: `cls-${Date.now()}-${i}`,
        title: v.title.trim(),
        videoUrl: v.url.trim(),
      }));

    const materials: MaterialItem[] = modalMaterials
      .filter((m) => m.title.trim() && m.file)
      .map((m, i) => ({
        id: `mat-${Date.now()}-${i}`,
        title: m.title.trim(),
        file: m.file,
      }));

    if (editingModuleId) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === editingModuleId
            ? {
                ...m,
                title: modalModuleName.trim(),
                classes,
                materials,
              }
            : m
        )
      );
    } else {
      const newModule: ExtendedModule = {
        id: `mod-${Date.now()}`,
        title: modalModuleName.trim(),
        details: 'Module description...',
        classes,
        materials,
        isOpen: true,
      };
      setModules([...modules, newModule]);
    }

    closeModuleModal();
  };

  const deleteModule = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;
    if (confirm(`Are you sure you want to delete "${module.title}"?`)) {
      setModules(modules.filter((m) => m.id !== moduleId));
    }
  };

  const deleteClass = (moduleId: string, classId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, classes: m.classes.filter((c) => c.id !== classId) } : m
      )
    );
  };

  const deleteMaterial = (moduleId: string, materialId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              materials: m.materials.filter((mat) => mat.id !== materialId),
            }
          : m
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{course.title}</h2>
            <p className="text-sm text-slate-500 mt-1">Course ID: {course.id}</p>
            <p className="text-sm text-slate-500 mt-1">
              Total Students: {course.numOfStudents ?? 0}
            </p>
            <button
              className={`mt-2 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                course.status === 'Active'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {course.status === 'Active' ? <Ban size={16} /> : <Check size={16} />}
              {course.status === 'Active' ? 'Deactivate Course' : 'Activate Course'}
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 mx-6">
            <button
              onClick={() => setActiveTab('assign-teacher')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'assign-teacher'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Assign Teacher
            </button>
            {course?.feeType === 'paid' && (
              <button
                onClick={() => setActiveTab('coupon')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'coupon'
                    ? 'bg-dark-blue text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Coupon
              </button>
            )}
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'curriculum'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Classroom
            </button>
            <button
              onClick={() => setActiveTab('facebook-group')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'facebook-group'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              FB Group
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'edit'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Edit Course
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'assign-teacher' && (
            <AssignTeacherTab
              availableTeachers={availableTeachers}
              assignedTeachers={assignedTeachers}
              onAssignTeacher={handleAssignTeacher}
              onUnassignTeacher={handleUnassignTeacher}
            />
          )}
          {activeTab === 'coupon' && (
            <CouponTab
              couponTag={couponTag}
              setCouponTag={setCouponTag}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              discount={discount}
              onDiscountChange={handleDiscountChange}
              onSubmit={handleCouponSubmit}
            />
          )}
          {activeTab === 'curriculum' && (
            <CurriculumTab
              modules={modules}
              isModuleModalOpen={isModuleModalOpen}
              editingModuleId={editingModuleId}
              modalModuleName={modalModuleName}
              setModalModuleName={setModalModuleName}
              modalVideoLessons={modalVideoLessons}
              modalMaterials={modalMaterials}
              fileInputRefs={fileInputRefs}
              onOpenAddModuleModal={openAddModuleModal}
              onOpenEditModuleModal={openEditModuleModal}
              onCloseModuleModal={closeModuleModal}
              onAddVideoLesson={addVideoLesson}
              onRemoveVideoLesson={removeVideoLesson}
              onUpdateVideoLesson={updateVideoLesson}
              onAddMaterialField={addMaterialField}
              onRemoveMaterial={removeMaterial}
              onUpdateMaterialTitle={updateMaterialTitle}
              onHandleFileSelect={handleFileSelect}
              onSaveModule={saveModule}
              onToggleModule={toggleModule}
              onDeleteModule={deleteModule}
              onDeleteClass={deleteClass}
              onDeleteMaterial={deleteMaterial}
            />
          )}
          {activeTab === 'facebook-group' && (
            <FacebookGroupTab
              fbGroupLink={fbGroupLink}
              setFbGroupLink={setFbGroupLink}
              onSubmit={handleFbGroupSubmit}
            />
          )}
          {activeTab === 'edit' && (
            <EditCourseForm course={course} onSave={handleSaveCourse} onCancel={handleCancelEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
