'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Loader2,
  Edit2,
  Trash2,
  Plus,
  GripVertical,
  MonitorPlay,
  File as FileIcon,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase/storage';

// Types for API response
interface CourseClass {
  id: string;
  title: string;
  videoUrl?: string | null;
  duration?: number | null;
}

interface CourseMaterial {
  id: string;
  title: string;
  fileUrl?: string | null;
  materialType?: string | null;
}

interface CurriculumModule {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  classes: CourseClass[];
  materials: CourseMaterial[];
}

interface CourseData {
  id: string;
  title: string;
  description?: string | null;
  introImageUrl?: string | null;
  introVideoLink?: string | null;
  category?: { id: string; title: string; slug: string } | null;
  level?: string | null;
  feeType: 'FREE' | 'PAID';
  price?: number | null;
  published: boolean;
  batchNo?: string | null;
  metadata?: {
    heroImage?: string;
    level?: string;
    category?: string;
    batchNo?: string;
    courseType?: string;
    [key: string]: unknown;
  };
  curriculumModules: CurriculumModule[];
  courseTeachers: Array<{
    teacher: {
      id: string;
      name: string;
      profileImage?: string | null;
    };
  }>;
  _count?: {
    enrollments?: number;
  };
}

export default function CourseManagementPage() {
  const { t } = useLocale();
  const pageText = t('teacher');
  const buttonText = t('buttons');

  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [isPublishing, setIsPublishing] = useState(false);

  // Module editing state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [modalModuleName, setModalModuleName] = useState('');
  const [modalVideoLessons, setModalVideoLessons] = useState<{ title: string; url: string }[]>([
    { title: '', url: '' },
  ]);
  const [modalMaterials, setModalMaterials] = useState<
    { title: string; file: File | null; fileUrl?: string | null }[]
  >([{ title: '', file: null, fileUrl: null }]);
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: 'uploading' | 'success' | 'error';
  }>({});
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getTeacherCourseById(id as string);
        const courseData = response.data as CourseData;
        setCourse(courseData);

        if (courseData.curriculumModules?.[0]) {
          setOpenModules(new Set([courseData.curriculumModules[0].id]));
        }
      } catch (err) {
        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as { response?: { status?: number; data?: { message?: string } } };
          if (error.response?.status === 403) {
            setError('You do not have access to this course.');
          } else {
            setError(error.response?.data?.message || 'Failed to load course details.');
          }
        } else {
          setError('Failed to load course details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handlePublishToggle = async () => {
    if (!course || isPublishing) return;

    try {
      setIsPublishing(true);
      await apiClient.updateCourse(course.id, {
        published: !course.published,
      });
      setCourse({ ...course, published: !course.published });
      toast.success(
        !course.published ? 'Course published successfully!' : 'Course unpublished successfully!'
      );
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update course status');
    } finally {
      setIsPublishing(false);
    }
  };

  // Module management functions
  const openAddModuleModal = () => {
    setEditingModuleId(null);
    setModalModuleName('');
    setModalVideoLessons([{ title: '', url: '' }]);
    setModalMaterials([{ title: '', file: null, fileUrl: null }]);
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (moduleId: string) => {
    const moduleToEdit = course?.curriculumModules.find((m) => m.id === moduleId);
    if (!moduleToEdit) return;

    setEditingModuleId(moduleId);
    setModalModuleName(moduleToEdit.title);
    setModalVideoLessons(
      moduleToEdit.classes.length > 0
        ? moduleToEdit.classes.map((c) => ({ title: c.title, url: c.videoUrl || '' }))
        : [{ title: '', url: '' }]
    );
    setModalMaterials(
      moduleToEdit.materials.length > 0
        ? moduleToEdit.materials.map((m) => ({
            title: m.title,
            file: null,
            fileUrl: m.fileUrl || null,
          }))
        : [{ title: '', file: null, fileUrl: null }]
    );
    setIsModuleModalOpen(true);
  };

  const closeModuleModal = () => {
    setIsModuleModalOpen(false);
    setEditingModuleId(null);
    setModalModuleName('');
    setModalVideoLessons([{ title: '', url: '' }]);
    setModalMaterials([{ title: '', file: null, fileUrl: null }]);
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
    setModalMaterials([...modalMaterials, { title: '', file: null, fileUrl: null }]);
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
      // If removing file, also clear fileUrl to prevent keeping old reference
      if (!file) {
        updated[index].fileUrl = null;
        // Clear the file input element
        if (fileInputRefs.current?.[index]) {
          fileInputRefs.current[index]!.value = '';
        }
      }
      // Auto-fill title from filename if empty
      if (file && !updated[index].title) {
        updated[index].title = file.name.split('.')[0] || file.name;
      }
    }
    setModalMaterials(updated);
  };

  const validateFile = (file: File): string | null => {
    const acceptedTypes = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.zip'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(ext)) {
      return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
    }
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return `File too large. Maximum size: 50MB`;
    }
    return null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file) return;
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      handleFileSelect(index, file);
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

  const saveModule = async () => {
    if (!course) return;
    if (!modalModuleName.trim()) {
      toast.error('Please enter a module name');
      return;
    }

    try {
      setIsSavingModule(true);
      setUploadProgress({});

      const existingModule = editingModuleId
        ? course.curriculumModules.find((m) => m.id === editingModuleId)
        : null;

      // Filter and map classes
      const classes = modalVideoLessons
        .filter((v) => v.title.trim() && v.url.trim())
        .map((v) => ({
          title: v.title.trim(),
          videoUrl: v.url.trim() || '',
        }));

      // Upload files to Supabase and create materials
      const materials: Array<{ title: string; fileUrl: string }> = [];
      const filesToDelete: string[] = []; // Track old files to delete

      for (let i = 0; i < modalMaterials.length; i++) {
        const m = modalMaterials[i];
        if (!m || !m.title.trim()) continue;

        const existingMaterial = existingModule?.materials.find((mat) => mat.title === m.title);
        let fileUrl = m.fileUrl || existingMaterial?.fileUrl || null;

        // Upload new file if provided
        if (m.file) {
          try {
            setUploadProgress((prev) => ({ ...prev, [i]: 'uploading' }));

            // If replacing an existing file, mark old file for deletion
            if (existingMaterial?.fileUrl && existingMaterial.fileUrl !== m.fileUrl) {
              filesToDelete.push(existingMaterial.fileUrl);
            }

            fileUrl = await uploadFile(m.file, STORAGE_BUCKETS.MATERIALS, `course-${course.id}`);
            setUploadProgress((prev) => ({ ...prev, [i]: 'success' }));
          } catch (uploadError) {
            setUploadProgress((prev) => ({ ...prev, [i]: 'error' }));
            const errorMessage =
              uploadError instanceof Error ? uploadError.message : 'Unknown error';
            toast.error(`Failed to upload ${m.file.name}: ${errorMessage}`);
            continue;
          }
        }

        if (fileUrl) {
          materials.push({
            title: m.title.trim(),
            fileUrl,
          });
        }
      }

      // Check for removed materials (materials that existed but are no longer in the modal)
      if (existingModule) {
        existingModule.materials.forEach((existingMat) => {
          const stillExists = materials.some((m) => m.fileUrl === existingMat.fileUrl);
          if (!stillExists && existingMat.fileUrl) {
            filesToDelete.push(existingMat.fileUrl);
          }
        });
      }

      // Prepare modules array
      const existingModules = course.curriculumModules || [];
      let updatedModules;

      if (editingModuleId) {
        // Update existing module
        updatedModules = existingModules.map((m) =>
          m.id === editingModuleId
            ? {
                title: modalModuleName.trim(),
                details: m.description || '',
                classes,
                materials,
              }
            : {
                title: m.title,
                details: m.description || '',
                classes: m.classes.map((c) => ({
                  title: c.title,
                  videoUrl: c.videoUrl || '',
                })),
                materials: m.materials.map((mat) => ({
                  title: mat.title,
                  fileUrl: mat.fileUrl || '',
                })),
              }
        );
      } else {
        // Add new module
        updatedModules = [
          ...existingModules.map((m) => ({
            title: m.title,
            details: m.description || '',
            classes: m.classes.map((c) => ({
              title: c.title,
              videoUrl: c.videoUrl || '',
            })),
            materials: m.materials.map((mat) => ({
              title: mat.title,
              fileUrl: mat.fileUrl || '',
            })),
          })),
          {
            title: modalModuleName.trim(),
            details: '',
            classes,
            materials,
          },
        ];
      }

      await apiClient.updateCourseCurriculum(course.id, updatedModules);

      if (filesToDelete.length > 0) {
        Promise.all(
          filesToDelete.map((fileUrl) =>
            deleteFile(fileUrl, STORAGE_BUCKETS.MATERIALS).catch(() => {})
          )
        ).catch(() => {});
      }

      // Refresh course data
      const response = await apiClient.getTeacherCourseById(course.id);
      setCourse(response.data as CourseData);

      toast.success(
        editingModuleId ? 'Module updated successfully!' : 'Module added successfully!'
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save module';
      toast.error(errorMessage);
    } finally {
      setIsSavingModule(false);
    }
  };
  const deleteModule = async (moduleId: string) => {
    if (!course) return;
    const moduleToDelete = course.curriculumModules.find((m) => m.id === moduleId);
    if (!moduleToDelete) return;

    if (!confirm(`Are you sure you want to delete "${moduleToDelete.title}"?`)) return;

    try {
      // Collect file URLs to delete
      const filesToDelete = moduleToDelete.materials
        .map((mat) => mat.fileUrl)
        .filter((url): url is string => !!url);

      const updatedModules = course.curriculumModules
        .filter((m) => m.id !== moduleId)
        .map((m) => ({
          title: m.title,
          details: m.description || '',
          classes: m.classes.map((c) => ({
            title: c.title,
            videoUrl: c.videoUrl || '',
          })),
          materials: m.materials.map((mat) => ({
            title: mat.title,
            fileUrl: mat.fileUrl || '',
          })),
        }));

      await apiClient.updateCourseCurriculum(course.id, updatedModules);

      if (filesToDelete.length > 0) {
        Promise.all(
          filesToDelete.map((fileUrl) =>
            deleteFile(fileUrl, STORAGE_BUCKETS.MATERIALS).catch(() => {})
          )
        ).catch(() => {});
      }

      // Refresh course data
      const response = await apiClient.getTeacherCourseById(course.id);
      setCourse(response.data as CourseData);

      toast.success('Module deleted successfully!');
    } catch {
      toast.error('Failed to delete module');
    }
  };

  const deleteClass = async (moduleId: string, classId: string) => {
    if (!course) return;
    if (!confirm('Are you sure you want to delete this video lesson?')) return;

    try {
      const updatedModules = course.curriculumModules.map((m) => {
        if (m.id === moduleId) {
          return {
            title: m.title,
            details: m.description || '',
            classes: m.classes
              .filter((c) => c.id !== classId)
              .map((c) => ({
                title: c.title,
                videoUrl: c.videoUrl || '',
              })),
            materials: m.materials.map((mat) => ({
              title: mat.title,
              fileUrl: mat.fileUrl || '',
            })),
          };
        }
        return {
          title: m.title,
          details: m.description || '',
          classes: m.classes.map((c) => ({
            title: c.title,
            videoUrl: c.videoUrl || '',
          })),
          materials: m.materials.map((mat) => ({
            title: mat.title,
            fileUrl: mat.fileUrl || '',
          })),
        };
      });

      await apiClient.updateCourseCurriculum(course.id, updatedModules);

      const response = await apiClient.getTeacherCourseById(course.id);
      setCourse(response.data as CourseData);

      toast.success('Video lesson deleted successfully!');
    } catch {
      toast.error('Failed to delete video lesson');
    }
  };

  const deleteMaterial = async (moduleId: string, materialId: string) => {
    if (!course) return;
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      // Find the material to get its fileUrl for deletion
      const targetModule = course.curriculumModules.find((m) => m.id === moduleId);
      const materialToDelete = targetModule?.materials.find((mat) => mat.id === materialId);
      const fileUrlToDelete = materialToDelete?.fileUrl;

      const updatedModules = course.curriculumModules.map((m) => {
        if (m.id === moduleId) {
          return {
            title: m.title,
            details: m.description || '',
            classes: m.classes.map((c) => ({
              title: c.title,
              videoUrl: c.videoUrl || '',
            })),
            materials: m.materials
              .filter((mat) => mat.id !== materialId)
              .map((mat) => ({
                title: mat.title,
                fileUrl: mat.fileUrl || '',
              })),
          };
        }
        return {
          title: m.title,
          details: m.description || '',
          classes: m.classes.map((c) => ({
            title: c.title,
            videoUrl: c.videoUrl || '',
          })),
          materials: m.materials.map((mat) => ({
            title: mat.title,
            fileUrl: mat.fileUrl || '',
          })),
        };
      });

      await apiClient.updateCourseCurriculum(course.id, updatedModules);

      if (fileUrlToDelete) {
        deleteFile(fileUrlToDelete, STORAGE_BUCKETS.MATERIALS).catch(() => {});
      }

      const response = await apiClient.getTeacherCourseById(course.id);
      setCourse(response.data as CourseData);

      toast.success('Material deleted successfully!');
    } catch {
      toast.error('Failed to delete material');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-600">Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Course not found'}</h2>
        <Button
          onClick={() => router.push('/teacher')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {buttonText['back'] || 'Back to Dashboard'}
        </Button>
      </div>
    );
  }

  const sortedModules = [...(course.curriculumModules || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm rounded-tr-2xl rounded-tl-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/teacher" className="hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-75">{course.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {(course.metadata?.batchNo || course.batchNo) &&
                  `${course.metadata?.batchNo || course.batchNo} • `}
                {(course.metadata?.level || course.level) &&
                  `${course.metadata?.level || course.level} • `}
                {sortedModules.length} Module{sortedModules.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePublishToggle}
                disabled={isPublishing}
                className={`${
                  course.published
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white`}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : course.published ? (
                  'Unpublish Course'
                ) : (
                  'Publish Course'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Curriculum View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {pageText['course_curriculum'] || 'Course Curriculum'}
              </h2>
              <button
                onClick={openAddModuleModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <Plus size={18} /> Add Module
              </button>
            </div>

            <div className="space-y-4">
              {sortedModules.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No curriculum yet</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    The curriculum for this course hasn&apos;t been created yet.
                  </p>
                </div>
              ) : (
                sortedModules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    {/* Module Header */}
                    <div
                      className={`p-4 flex items-center justify-between cursor-pointer ${
                        openModules.has(module.id) ? 'bg-slate-50 border-b border-slate-100' : ''
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
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteModule(module.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="text-slate-400">
                          {openModules.has(module.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Module Content */}
                    {openModules.has(module.id) && (
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
                                <p className="text-sm text-slate-500">
                                  No video lessons added yet.
                                </p>
                                <button
                                  onClick={() => openEditModuleModal(module.id)}
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
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                      onClick={() => deleteClass(module.id, cls.id)}
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
                                  {module.materials.length} file
                                  {module.materials.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {module.materials.length === 0 ? (
                              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-sm text-slate-500">No materials uploaded yet.</p>
                                <button
                                  onClick={() => openEditModuleModal(module.id)}
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
                                      <p className="text-sm font-medium text-slate-900">
                                        {mat.title}
                                      </p>
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
                                        <p className="text-xs text-slate-400 mt-0.5">
                                          No file attached
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                      onClick={() => deleteMaterial(module.id, mat.id)}
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
                ))
              )}
            </div>
          </div>

          {/* Right Column: Course Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Course Details</h3>

              <div className="space-y-4">
                {(course.metadata?.heroImage || course.introImageUrl) && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative shadow-sm">
                    <Image
                      src={course.metadata?.heroImage || course.introImageUrl || ''}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {course.description && (
                  <div className="pt-2">
                    <div
                      className="text-sm text-slate-600 line-clamp-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {(course.metadata?.level || course.level) && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Level</p>
                      <p className="font-medium text-slate-900 capitalize">
                        {course.metadata?.level || course.level}
                      </p>
                    </div>
                  )}
                  {course.category?.title && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Category</p>
                      <p className="font-medium text-slate-900 capitalize">
                        {course.category.title}
                      </p>
                    </div>
                  )}
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Type</p>
                    <p className="font-medium text-slate-900 capitalize">{course.feeType}</p>
                  </div>
                  {course.feeType === 'PAID' && course.price && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Price</p>
                      <p className="font-medium text-slate-900">৳{course.price}</p>
                    </div>
                  )}
                </div>

                {course.courseTeachers && course.courseTeachers.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide">
                      Instructor
                    </h4>
                    <div className="space-y-3">
                      {course.courseTeachers.map(({ teacher }) => (
                        <div key={teacher.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            {teacher.profileImage ? (
                              <Image
                                src={teacher.profileImage}
                                alt={teacher.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{teacher.name}</p>
                            <p className="text-xs text-slate-500">Course Instructor</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingModuleId ? 'Edit Module' : 'Add New Module'}
              </h2>
              <button
                onClick={closeModuleModal}
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
                  disabled={isSavingModule}
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
                    onClick={addVideoLesson}
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
                            onClick={() => removeVideoLesson(index)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateVideoLesson(index, 'title', e.target.value)}
                        placeholder="Lesson title"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <input
                        type="url"
                        value={lesson.url}
                        onChange={(e) => updateVideoLesson(index, 'url', e.target.value)}
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
                    onClick={addMaterialField}
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
                            onClick={() => removeMaterial(index)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            disabled={isSavingModule}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={material.title}
                        onChange={(e) => updateMaterialTitle(index, e.target.value)}
                        placeholder="Material title"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isSavingModule}
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
                          onChange={(e) => handleFileSelect(index, e.target.files?.[0] ?? null)}
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
                          id={`file-modal-${index}`}
                          disabled={isSavingModule}
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
                                handleFileSelect(index, null);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-full ml-2 pointer-events-auto"
                              title="Remove file"
                              disabled={isSavingModule}
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
                                handleFileSelect(index, null);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-full ml-2 pointer-events-auto"
                              title="Remove file"
                              disabled={isSavingModule}
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
                onClick={closeModuleModal}
                disabled={isSavingModule}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveModule}
                disabled={isSavingModule}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSavingModule ? (
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
    </div>
  );
}
