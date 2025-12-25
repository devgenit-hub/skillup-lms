'use client';

import { RefObject, useState, DragEvent } from 'react';
import {
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
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { ExtendedModule } from './types';

interface CurriculumTabProps {
  modules: ExtendedModule[];
  isModuleModalOpen: boolean;
  editingModuleId: string | null;
  modalModuleName: string;
  setModalModuleName: (value: string) => void;
  modalVideoLessons: { title: string; url: string }[];
  modalMaterials: { title: string; file: File | null; fileUrl?: string | null }[];
  fileInputRefs: RefObject<{ [key: number]: HTMLInputElement | null }>;
  isLoading: boolean;
  isSaving?: boolean;
  uploadProgress?: { [key: number]: 'uploading' | 'success' | 'error' };
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

const ACCEPTED_FILE_TYPES = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.zip'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function CurriculumTab({
  modules,
  isModuleModalOpen,
  editingModuleId,
  modalModuleName,
  setModalModuleName,
  modalVideoLessons,
  modalMaterials,
  fileInputRefs,
  isLoading,
  isSaving = false,
  uploadProgress = {},
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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(ext)) {
      return `Invalid file type. Accepted: ${ACCEPTED_FILE_TYPES.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file) return;
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }
      onHandleFileSelect(index, file);
    }
  };

  const getStatusIcon = (index: number) => {
    const status = uploadProgress[index];
    if (status === 'uploading') {
      return <Loader2 size={16} className="animate-spin text-blue-500" />;
    }
    if (status === 'success') {
      return <CheckCircle2 size={16} className="text-green-500" />;
    }
    if (status === 'error') {
      return <AlertCircle size={16} className="text-red-500" />;
    }
    return null;
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-dark-blue" />
        <span className="ml-3 text-slate-600">Loading curriculum...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
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
                  disabled={isSaving}
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
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
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
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
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
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>

                <div className="space-y-3">
                  {modalMaterials.map((material, index) => (
                    <div
                      key={index}
                      className={`bg-white p-4 rounded-lg border-2 space-y-3 transition-all duration-200 ${
                        dragOverIndex === index
                          ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                          : 'border-slate-200'
                      }`}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            Material {index + 1}
                          </span>
                          {getStatusIcon(index)}
                        </div>
                        {modalMaterials.length > 1 && (
                          <button
                            onClick={() => onRemoveMaterial(index)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            disabled={isSaving}
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
                        disabled={isSaving}
                      />

                      {/* Drag & Drop Zone */}
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                          dragOverIndex === index
                            ? 'border-blue-500 bg-blue-50'
                            : material.file || material.fileUrl
                              ? 'border-green-300 bg-green-50'
                              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          ref={(el) => {
                            if (fileInputRefs.current) {
                              fileInputRefs.current[index] = el;
                            }
                          }}
                          type="file"
                          onChange={(e) => onHandleFileSelect(index, e.target.files?.[0] ?? null)}
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
                          id={`file-modal-${index}`}
                          disabled={isSaving}
                        />

                        {material.file ? (
                          <div className="flex items-center justify-center gap-3 relative z-10">
                            <FileIcon size={24} className="text-green-600" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-slate-900 truncate max-w-50">
                                {material.file.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(material.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onHandleFileSelect(index, null);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-full ml-2 pointer-events-auto"
                              title="Remove file"
                              disabled={isSaving}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : material.fileUrl ? (
                          <div className="flex items-center justify-center gap-3 relative z-10">
                            <FileIcon size={24} className="text-blue-600" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-slate-900 truncate max-w-50">
                                {material.fileUrl.split('/').pop()}
                              </p>
                              <p className="text-xs text-green-600">Already uploaded</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onHandleFileSelect(index, null);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-full ml-2 pointer-events-auto"
                              title="Remove file"
                              disabled={isSaving}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="py-2 pointer-events-auto cursor-pointer"
                            onClick={() => fileInputRefs.current?.[index]?.click()}
                          >
                            <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600">
                              <span className="font-medium text-blue-600">Click to upload</span> or
                              drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              PDF, PPT, PPTX, DOC, DOCX, ZIP (max 50MB)
                            </p>
                          </div>
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
                disabled={isSaving}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onSaveModule}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading & Saving...
                  </>
                ) : editingModuleId ? (
                  'Update Module'
                ) : (
                  'Save Module'
                )}
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
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
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
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteModule(module.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
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
                          className="text-sm text-emerald-600 font-medium mt-1 hover:underline cursor-pointer"
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
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
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
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => onDeleteClass(module.id, cls.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
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
                      {module.materials.length > 0 && (
                        <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {module.materials.length} file{module.materials.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {module.materials.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No materials uploaded yet.</p>
                        <button
                          onClick={() => onOpenEditModuleModal(module.id)}
                          className="text-sm text-blue-600 font-medium mt-1 hover:underline cursor-pointer"
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
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 text-red-600 shrink-0">
                              <FileIcon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900">{mat.title}</p>
                              {mat.fileUrl ? (
                                <a
                                  href={mat.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline truncate block mt-0.5 cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View file ↗
                                </a>
                              ) : (
                                <p className="text-xs text-slate-400 mt-0.5">No file attached</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => onDeleteMaterial(module.id, mat.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
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
          <p className="text-slate-500 max-w-md mx-auto">
            Create your first module to start adding video lessons and study materials for your
            students.
          </p>
        </div>
      )}
    </div>
  );
}
