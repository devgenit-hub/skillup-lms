'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { CourseProps } from '../props/CourseProps';
import { TeacherProps } from '../props/TeacherProps';
import { apiClient } from '@/lib/api-client';
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase/storage';
import EditCourseForm from './EditCourseForm';
import { toast } from 'sonner';
import {
  AssignTeacherTab,
  FacebookGroupTab,
  CouponTab,
  CurriculumTab,
  ClassItem,
  MaterialItem,
  ExtendedModule,
  Coupon,
} from '../superuser/courses';

interface CourseDetailsModalProps {
  course: CourseProps;
  teachers: TeacherProps[];
  isOpen: boolean;
  onClose: () => void;
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
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [isSavingFbGroup, setIsSavingFbGroup] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [courseStatus, setCourseStatus] = useState(course.status);

  // Facebook Group Link state
  const [fbGroupLink, setFbGroupLink] = useState(course.facebookGroupLink || '');

  // Coupon form state
  const [couponTag, setCouponTag] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [discount, setDiscount] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [isTogglingCoupon, setIsTogglingCoupon] = useState<string | null>(null);
  const [isDeletingCoupon, setIsDeletingCoupon] = useState<string | null>(null);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Load coupons when coupon tab is active
  useEffect(() => {
    if (activeTab === 'coupon' && isOpen) {
      const loadCoupons = async () => {
        setIsLoadingCoupons(true);
        try {
          const response = await apiClient.getCourseCoupons(course.id);
          if (response.data && Array.isArray(response.data)) {
            setCoupons(response.data as Coupon[]);
          }
        } catch {
          // Silently fail - coupons will show as empty
        } finally {
          setIsLoadingCoupons(false);
        }
      };
      loadCoupons();
    }
  }, [activeTab, isOpen, course.id]);

  // Curriculum management state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [modalModuleName, setModalModuleName] = useState('');
  const [modalVideoLessons, setModalVideoLessons] = useState<{ title: string; url: string }[]>([
    { title: '', url: '' },
  ]);
  const [modalMaterials, setModalMaterials] = useState<
    { title: string; file: File | null; fileUrl?: string | null }[]
  >([{ title: '', file: null, fileUrl: null }]);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Curriculum modules state
  const [modules, setModules] = useState<ExtendedModule[]>([]);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false);
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: 'uploading' | 'success' | 'error';
  }>({});

  // Load curriculum from database when tab is active
  useEffect(() => {
    if (activeTab === 'curriculum' && isOpen) {
      const loadCurriculum = async () => {
        setIsLoadingCurriculum(true);
        try {
          const response = await apiClient.getCourseCurriculum(course.id);
          if (response.data?.modules && Array.isArray(response.data.modules)) {
            const loadedModules: ExtendedModule[] = response.data.modules.map((mod, index) => ({
              id: mod.id,
              title: mod.title,
              details: mod.details || '',
              classes:
                mod.classes?.map((cls) => ({
                  id: cls.id,
                  title: cls.title,
                  videoUrl: cls.videoUrl || '',
                })) || [],
              materials:
                mod.materials?.map((mat) => ({
                  id: mat.id,
                  title: mat.title,
                  fileUrl: mat.fileUrl || null,
                })) || [],
              isOpen: index === 0,
            }));
            setModules(loadedModules);
          }
        } catch {
          setModules([]);
        } finally {
          setIsLoadingCurriculum(false);
        }
      };
      loadCurriculum();
    }
  }, [activeTab, isOpen, course.id]);

  // Helper function to format modules for API
  const formatModulesForApi = (modulesToFormat: ExtendedModule[]) => {
    return modulesToFormat.map((mod) => ({
      id: mod.id.startsWith('mod-') ? undefined : mod.id,
      title: mod.title,
      details: mod.details || null,
      classes: mod.classes.map((cls) => ({
        id: cls.id.startsWith('cls-') ? undefined : cls.id,
        title: cls.title,
        videoUrl: cls.videoUrl || '',
      })),
      materials: mod.materials.map((mat) => ({
        id: mat.id.startsWith('mat-') ? undefined : mat.id,
        title: mat.title,
        fileUrl: mat.fileUrl || '',
      })),
    }));
  };

  if (!isOpen) return null;

  const availableTeachers = teachers.filter((t) => !assignedTeacherIds.includes(t.id));
  const assignedTeachers = teachers.filter((t) => assignedTeacherIds.includes(t.id));

  const handleAssignTeacher = async (teacherId: string) => {
    if (isAssigningTeacher) return;
    try {
      setIsAssigningTeacher(true);
      const newAssignedIds = [...assignedTeacherIds, teacherId];
      await apiClient.assignCourseTeachers(course.id, newAssignedIds);
      setAssignedTeacherIds(newAssignedIds);
      toast.success('Teacher assigned successfully!');
    } catch {
      toast.error('Failed to assign teacher. Please try again.');
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const handleUnassignTeacher = async (teacherId: string) => {
    if (isAssigningTeacher) return;
    try {
      setIsAssigningTeacher(true);
      const newAssignedIds = assignedTeacherIds.filter((id) => id !== teacherId);
      await apiClient.assignCourseTeachers(course.id, newAssignedIds);
      setAssignedTeacherIds(newAssignedIds);
      toast.success('Teacher unassigned successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unassign teacher';
      toast.error(errorMessage);
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const handleDiscountChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 100)) {
      setDiscount(value);
    }
  };

  const handleCouponSubmit = async () => {
    if (!couponTag || !expiryDate || !discount || isCreatingCoupon) return;
    try {
      setIsCreatingCoupon(true);

      if (editingCouponId) {
        // Update existing coupon
        const response = await apiClient.updateCourseCoupon(course.id, editingCouponId, {
          code: couponTag,
          title: couponTitle || undefined,
          discount: parseInt(discount),
          expiresAt: expiryDate.toISOString(),
        });
        if (response.data) {
          const updatedData = response.data as Coupon;
          setCoupons((prev) =>
            prev.map((c) => (c.id === editingCouponId ? { ...c, ...updatedData } : c))
          );
        }
        toast.success('Coupon updated successfully!');
        setEditingCouponId(null);
      } else {
        // Create new coupon
        const response = await apiClient.createCourseCoupon(course.id, {
          code: couponTag,
          title: couponTitle || undefined,
          discount: parseInt(discount),
          expiresAt: expiryDate.toISOString(),
        });
        toast.success('Coupon created successfully!');
        if (response.data) {
          setCoupons((prev) => [response.data as Coupon, ...prev]);
        }
      }

      setCouponTag('');
      setCouponTitle('');
      setExpiryDate(undefined);
      setDiscount('');
      setShowCalendar(false);
    } catch {
      toast.error('Failed to save coupon. Please try again.');
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (couponId: string) => {
    try {
      setIsTogglingCoupon(couponId);
      const response = await apiClient.toggleCourseCoupon(course.id, couponId);
      if (response.data) {
        // Use the response data to update local state
        const updatedCoupon = response.data as { isActive: boolean };
        setCoupons((prev) =>
          prev.map((c) => (c.id === couponId ? { ...c, isActive: updatedCoupon.isActive } : c))
        );
        toast.success(
          `Coupon ${updatedCoupon.isActive ? 'activated' : 'deactivated'} successfully!`
        );
      }
    } catch {
      toast.error('Failed to toggle coupon status.');
    } finally {
      setIsTogglingCoupon(null);
    }
  };

  const handleEditCoupon = (coupon: {
    id: string;
    code: string;
    title?: string | null;
    discount: number;
    expiresAt: string;
  }) => {
    // Populate form with existing coupon data for editing
    setCouponTag(coupon.code);
    setCouponTitle(coupon.title || '');
    setDiscount(coupon.discount.toString());
    setExpiryDate(new Date(coupon.expiresAt));
    setEditingCouponId(coupon.id);
  };

  const handleCancelEditCoupon = () => {
    setCouponTag('');
    setCouponTitle('');
    setDiscount('');
    setExpiryDate(undefined);
    setEditingCouponId(null);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      setIsDeletingCoupon(couponId);
      await apiClient.deleteCourseCoupon(course.id, couponId);
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      toast.success('Coupon deleted successfully!');
    } catch {
      toast.error('Failed to delete coupon.');
    } finally {
      setIsDeletingCoupon(null);
    }
  };

  const handleFbGroupSubmit = async () => {
    if (!fbGroupLink.trim() || isSavingFbGroup) return;
    try {
      setIsSavingFbGroup(true);
      // Get existing metadata from course
      const existingMetadata =
        (course as CourseProps & { metadata?: Record<string, unknown> }).metadata || {};
      await apiClient.updateCourse(course.id, {
        metadata: {
          ...existingMetadata,
          facebookGroupLink: fbGroupLink.trim(),
        },
      });
      toast.success('Facebook Group Link saved successfully!');
      course.facebookGroupLink = fbGroupLink.trim();
    } catch {
      toast.error('Failed to save Facebook group link. Please try again.');
    } finally {
      setIsSavingFbGroup(false);
    }
  };

  const handleSaveCourse = async (updatedCourse: CourseProps) => {
    if (isSavingCourse) return;
    try {
      setIsSavingCourse(true);

      const formCategoryId = (updatedCourse as CourseProps & { categoryId?: string | null })
        .categoryId;
      const categoryTitle = updatedCourse.category?.title;

      const response = await apiClient.updateCourse(course.id, {
        title: updatedCourse.title,
        description: updatedCourse.aboutCourse?.about || '',
        feeType: updatedCourse.feeType === 'paid' ? 'PAID' : 'FREE',
        price: updatedCourse.feeType === 'paid' ? updatedCourse.price || null : null,
        categoryId: formCategoryId || undefined,
        categoryTitle: !formCategoryId && categoryTitle ? categoryTitle : undefined,
      });

      // Add new category to store if created
      const result = response.data as { newCategory?: { id: string; title: string; slug: string } };
      if (result?.newCategory) {
        const { useCategoryStore } = await import('@/lib/zustand/category-store');
        const { addCategory } = useCategoryStore.getState();
        addCategory({ ...result.newCategory, courseCount: 1, webinarCount: 0 });
        toast.success(`Created new category: ${result.newCategory.title}`);
      }

      Object.assign(course, updatedCourse);
      course.status = courseStatus;

      toast.success('Course updated successfully!');
    } catch {
      toast.error('Failed to update course. Please try again.');
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleCancelEdit = () => {
    setActiveTab('assign-teacher');
  };

  const handleTogglePublish = async () => {
    if (isTogglingPublish) return;
    try {
      setIsTogglingPublish(true);
      const newPublishedStatus = courseStatus !== 'Active';
      await apiClient.updateCourse(course.id, {
        published: newPublishedStatus,
      });
      setCourseStatus(newPublishedStatus ? 'Active' : 'Deactive');
      toast.success(newPublishedStatus ? 'Course published!' : 'Course unpublished!');
    } catch {
      toast.error('Failed to update course status. Please try again.');
    } finally {
      setIsTogglingPublish(false);
    }
  };

  // Curriculum management functions
  const toggleModule = (moduleId: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, isOpen: !m.isOpen } : m)));
  };

  const openAddModuleModal = () => {
    setEditingModuleId(null);
    setModalModuleName('');
    setModalVideoLessons([{ title: '', url: '' }]);
    setModalMaterials([{ title: '', file: null, fileUrl: null }]);
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (moduleId: string) => {
    const moduleToEdit = modules.find((m) => m.id === moduleId);
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

  const saveModule = async () => {
    if (!modalModuleName.trim()) {
      toast.error('Please enter a module name');
      return;
    }

    setIsSavingModule(true);
    setUploadProgress({});

    const existingModule = editingModuleId ? modules.find((m) => m.id === editingModuleId) : null;

    const classes: ClassItem[] = modalVideoLessons
      .filter((v) => v.title.trim())
      .map((v, i) => {
        const existingClass = existingModule?.classes.find(
          (c) => c.title === v.title || c.videoUrl === v.url
        );
        return {
          id: existingClass?.id || `cls-${Date.now()}-${i}`,
          title: v.title.trim(),
          videoUrl: v.url.trim() || undefined,
        };
      });

    // Upload files to Supabase and create materials
    const materials: MaterialItem[] = [];
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
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
          toast.error(`Failed to upload ${m.file.name}: ${errorMessage}`);
        }
      }

      materials.push({
        id: existingMaterial?.id || `mat-${Date.now()}-${i}`,
        title: m.title.trim(),
        fileUrl,
      });
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

    let updatedModules: ExtendedModule[];
    if (editingModuleId) {
      // Editing: just update this module, keep other modules' open state
      updatedModules = modules.map((m) =>
        m.id === editingModuleId ? { ...m, title: modalModuleName.trim(), classes, materials } : m
      );
    } else {
      // Adding new: collapse all existing modules, new one is open
      const newModule: ExtendedModule = {
        id: `mod-${Date.now()}`,
        title: modalModuleName.trim(),
        details: '',
        classes,
        materials,
        isOpen: true,
      };
      updatedModules = [...modules.map((m) => ({ ...m, isOpen: false })), newModule];
    }

    try {
      await apiClient.updateCourseCurriculum(course.id, formatModulesForApi(updatedModules));

      if (filesToDelete.length > 0) {
        Promise.all(
          filesToDelete.map((fileUrl) =>
            deleteFile(fileUrl, STORAGE_BUCKETS.MATERIALS).catch(() => {})
          )
        ).catch(() => {});
      }

      setModules(updatedModules);
      toast.success('Module saved successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save module';
      toast.error(errorMessage);
    } finally {
      setIsSavingModule(false);
      setUploadProgress({});
    }
  };

  const deleteModule = async (moduleId: string) => {
    const moduleToDelete = modules.find((m) => m.id === moduleId);
    if (!moduleToDelete) return;
    if (!confirm(`Are you sure you want to delete "${moduleToDelete.title}"?`)) return;

    // Collect file URLs to delete
    const filesToDelete = moduleToDelete.materials
      .map((mat) => mat.fileUrl)
      .filter((url): url is string => !!url);

    const updatedModules = modules.filter((m) => m.id !== moduleId);
    try {
      await apiClient.updateCourseCurriculum(course.id, formatModulesForApi(updatedModules));

      if (filesToDelete.length > 0) {
        Promise.all(
          filesToDelete.map((fileUrl) =>
            deleteFile(fileUrl, STORAGE_BUCKETS.MATERIALS).catch(() => {})
          )
        ).catch(() => {});
      }

      setModules(updatedModules);
      toast.success('Module deleted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete module';
      toast.error(errorMessage);
    }
  };

  const deleteClass = async (moduleId: string, classId: string) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId ? { ...m, classes: m.classes.filter((c) => c.id !== classId) } : m
    );
    try {
      await apiClient.updateCourseCurriculum(course.id, formatModulesForApi(updatedModules));
      setModules(updatedModules);
      toast.success('Class deleted!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete class';
      toast.error(errorMessage);
    }
  };

  const deleteMaterial = async (moduleId: string, materialId: string) => {
    // Find the material to get its fileUrl for deletion
    const currModule = modules.find((m) => m.id === moduleId);
    const materialToDelete = currModule?.materials.find((mat) => mat.id === materialId);
    const fileUrlToDelete = materialToDelete?.fileUrl;

    const updatedModules = modules.map((m) =>
      m.id === moduleId
        ? { ...m, materials: m.materials.filter((mat) => mat.id !== materialId) }
        : m
    );
    try {
      await apiClient.updateCourseCurriculum(course.id, formatModulesForApi(updatedModules));

      if (fileUrlToDelete) {
        deleteFile(fileUrlToDelete, STORAGE_BUCKETS.MATERIALS).catch(() => {});
      }

      setModules(updatedModules);
      toast.success('Material deleted!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete material';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200">
          {/* Top row: Title, info, and close button */}
          <div className="flex items-start justify-between p-4 pb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate" title={course.title}>
                {course.title}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                <span className="truncate max-w-50" title={course.id}>
                  ID: {course.id}
                </span>
                <span className="shrink-0">Students: {course.numOfStudents ?? 0}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors ml-4 shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Bottom row: Tab buttons */}
          <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('assign-teacher')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
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
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
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
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'curriculum'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Classroom
            </button>
            <button
              onClick={() => setActiveTab('facebook-group')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'facebook-group'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              FB Group
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'edit'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Edit Course
            </button>
            <div className="flex-1" />
            <button
              onClick={handleTogglePublish}
              disabled={isTogglingPublish}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shrink-0 ${
                courseStatus === 'Active'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {isTogglingPublish ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {courseStatus === 'Active' ? 'Published' : 'Unpublished'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'assign-teacher' && (
            <AssignTeacherTab
              availableTeachers={availableTeachers}
              assignedTeachers={assignedTeachers}
              onAssignTeacher={handleAssignTeacher}
              onUnassignTeacher={handleUnassignTeacher}
              isAssigningTeacher={isAssigningTeacher}
            />
          )}
          {activeTab === 'coupon' && (
            <CouponTab
              couponTag={couponTag}
              setCouponTag={setCouponTag}
              couponTitle={couponTitle}
              setCouponTitle={setCouponTitle}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              discount={discount}
              onDiscountChange={handleDiscountChange}
              onSubmit={handleCouponSubmit}
              isSubmitting={isCreatingCoupon}
              coupons={coupons}
              isLoadingCoupons={isLoadingCoupons}
              onToggleCoupon={handleToggleCoupon}
              onDeleteCoupon={handleDeleteCoupon}
              onEditCoupon={handleEditCoupon}
              onCancelEdit={handleCancelEditCoupon}
              isTogglingCoupon={isTogglingCoupon}
              isDeletingCoupon={isDeletingCoupon}
              editingCouponId={editingCouponId}
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
              isLoading={isLoadingCurriculum}
              isSaving={isSavingModule}
              uploadProgress={uploadProgress}
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
              isLoading={isSavingFbGroup}
              savedLink={course.facebookGroupLink}
            />
          )}
          {activeTab === 'edit' && (
            <EditCourseForm
              course={course}
              onSave={handleSaveCourse}
              onCancel={handleCancelEdit}
              isSaving={isSavingCourse}
            />
          )}
        </div>
      </div>
    </div>
  );
}
