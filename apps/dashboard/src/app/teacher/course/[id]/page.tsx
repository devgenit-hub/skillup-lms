'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { courses } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Video,
  FileText,
  Trash2,
  Edit2,
  UploadCloud,
  File as FileIcon,
  MonitorPlay,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { Curriculum } from '@/components/props/CourseProps';
import { useLocale } from '@/providers/locale-provider';

// Extended types for local state management since the original props don't have these fields yet
interface ClassItem {
  id: string;
  title: string;
  videoUrl?: string | undefined;
}

interface MaterialItem {
  id: string;
  title: string;
  file?: File | null; // blob file
}

interface ExtendedModule extends Curriculum {
  id: string;
  classes: ClassItem[];
  materials: MaterialItem[];
  isOpen: boolean;
}

export default function CourseManagementPage() {
  const { t } = useLocale();
  const pageText = t('teacher');
  const courseText = t('course_manage');
  const buttonText = t('buttons');

  const { id } = useParams();
  const router = useRouter();
  const courseData = courses.find((c) => c.id === id);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  // Form state for modal
  const [modalModuleName, setModalModuleName] = useState('');
  const [modalVideoLessons, setModalVideoLessons] = useState<{ title: string; url: string }[]>([
    { title: '', url: '' },
  ]);
  const [modalMaterials, setModalMaterials] = useState<{ title: string; file: File | null }[]>([
    { title: '', file: null },
  ]);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Initialize state with dummy data extension
  const [modules, setModules] = useState<ExtendedModule[]>(() => {
    if (!courseData?.curriculum) return [];
    return courseData.curriculum.map((item, index) => ({
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
      isOpen: index === 0, // Open first module by default
    }));
  });

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800">{pageText['course_not_found']}</h2>
        <Button
          onClick={() => router.push('/teacher')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {buttonText['back']}
        </Button>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, isOpen: !m.isOpen } : m)));
  };

  const openAddModuleModal = () => {
    setEditingModuleId(null);
    setModalModuleName('');
    setModalVideoLessons([{ title: '', url: '' }]);
    setModalMaterials([{ title: '', file: null }]);
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      // Update existing module
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
      // Create new module
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

    closeModal();
  };

  const addModule = () => {
    openAddModuleModal();
  };

  const deleteModule = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;
    if (confirm(`${courseText['confirm_delete']} "${module.title}"?`)) {
      setModules(modules.filter((m) => m.id !== moduleId));
    }
  };

  const addClass = (moduleId: string) => {
    openEditModuleModal(moduleId);
  };

  const _editClass = (moduleId: string, _classId: string) => {
    openEditModuleModal(moduleId);
  };

  const addMaterial = (moduleId: string) => {
    openEditModuleModal(moduleId);
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingModuleId ? courseText['edit_module'] : courseText['add_module']}
              </h2>
              <button
                onClick={closeModal}
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
                  {courseText['module_name']} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalModuleName}
                  onChange={(e) => setModalModuleName(e.target.value)}
                  placeholder={courseText['module_name']}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Video Lessons Section */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Video size={20} className="text-emerald-600" />
                    {courseText['video_lessons']}
                  </h3>
                  <button
                    onClick={addVideoLesson}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> {courseText['add_video']}
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
                            onClick={() => removeVideoLesson(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateVideoLesson(index, 'title', e.target.value)}
                        placeholder={courseText['lesson_title']}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <input
                        type="url"
                        value={lesson.url}
                        onChange={(e) => updateVideoLesson(index, 'url', e.target.value)}
                        placeholder={courseText['video_url']}
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
                    {courseText['materials']}
                  </h3>
                  <button
                    onClick={addMaterialField}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> {courseText['add_material']}
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
                            onClick={() => removeMaterial(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={material.title}
                        onChange={(e) => updateMaterialTitle(index, e.target.value)}
                        placeholder={courseText['material_title']}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[index] = el;
                          }}
                          type="file"
                          onChange={(e) => handleFileSelect(index, e.target.files?.[0] ?? null)}
                          accept=".pdf,.ppt,.pptx,.doc,.docx"
                          className="hidden"
                          id={`file-${index}`}
                        />
                        <label
                          htmlFor={`file-${index}`}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-2 text-sm"
                        >
                          <UploadCloud size={16} className="text-slate-400" />
                          <span className="text-slate-600">
                            {material.file ? material.file.name : courseText['choose_file']}
                          </span>
                        </label>
                        {material.file && (
                          <button
                            onClick={() => handleFileSelect(index, null)}
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
              <Button
                onClick={closeModal}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                {buttonText['cancel']}
              </Button>
              <Button
                onClick={saveModule}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {editingModuleId ? buttonText['update'] : courseText['add_module']}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/teacher" className="hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/teacher/courses" className="hover:text-emerald-600 transition-colors">
              Courses
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">
              {courseData.title}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{courseData.title}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {courseData.batchNo} • {courseData.level} • {modules.length} Modules
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">
                Preview Course
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Modules Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{pageText['course_curriculum']}</h2>
              <Button
                onClick={addModule}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
              >
                <Plus size={18} /> {courseText['add_module']}
              </Button>
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
                    onClick={() => toggleModule(module.id)}
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
                          openEditModuleModal(module.id);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteModule(module.id);
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
                            <Video size={16} className="text-emerald-600" /> Video Lessons
                          </h4>
                        </div>

                        <div className="space-y-2">
                          {module.classes.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                              <p className="text-sm text-slate-500">No video lessons added yet.</p>
                              <button
                                onClick={() => addClass(module.id)}
                                className="text-sm text-emerald-600 font-medium mt-1 hover:underline"
                              >
                                Upload a video
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
                                    <p className="text-sm font-medium text-slate-900">
                                      {cls.title}
                                    </p>
                                    {cls.videoUrl && (
                                      <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {cls.videoUrl}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                  <button
                                    onClick={() => deleteClass(module.id, cls.id)}
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
                            <FileText size={16} className="text-blue-600" /> Study Materials
                          </h4>
                        </div>

                        <div className="space-y-2">
                          {module.materials.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                              <p className="text-sm text-slate-500">No materials uploaded yet.</p>
                              <button
                                onClick={() => addMaterial(module.id)}
                                className="text-sm text-blue-600 font-medium mt-1 hover:underline"
                              >
                                Upload PDF or PPTX
                              </button>
                            </div>
                          ) : (
                            module.materials.map((mat) => (
                              <div
                                key={mat.id}
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-200 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-red-50 text-red-600 
                                    `}
                                  >
                                    <FileIcon size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {mat.title}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => deleteMaterial(module.id, mat.id)}
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
                <h3 className="text-lg font-medium text-slate-900">
                  Start building your curriculum
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Create your first module to start adding video lessons and study materials for
                  your students.
                </p>
                <Button
                  onClick={addModule}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Create First Module
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Course Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Course Details</h3>

              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 relative">
                  <Image
                    src={courseData.heroImage}
                    alt={courseData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Level</p>
                    <p className="font-medium text-slate-900 capitalize">{courseData.level}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="font-medium text-slate-900 capitalize">{courseData.category}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Type</p>
                    <p className="font-medium text-slate-900 capitalize">{courseData.courseType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        courseData.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {courseData.status}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Instructor</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      {/* Placeholder for instructor image if available */}
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <span className="text-xs">IMG</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {courseData.instructorId ? 'Assigned Instructor' : 'Unassigned'}
                      </p>
                      <p className="text-xs text-slate-500">Course Lead</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
