'use client';
import {
  Play,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  FileText,
  Video,
  Clock,
  Loader2,
  GripVertical,
  OctagonX,
} from 'lucide-react';
import { ModuleData } from '@/components/student/types/ModuleDataProps';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { FaSquareFacebook } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { useParams, useRouter } from 'next/navigation';
import { YTPlayer } from '@/components/YTPlayer/YTPlayer';

interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  course: {
    id: string;
    title: string;
    description: string | null;
    introVideoLink: string | null;
    category: { id: string; title: string } | null;
    metadata: {
      level?: string;
      batchNo?: string;
      heroImage?: string | null;
      courseType: string;
      numClasses: number;
      aboutCourse: {
        about: string;
        details: string;
      };
      classRoutinePdf: string;
      courseInstructors?: Array<{
        name: string;
        designation: string;
        profileImage: string | null;
      }>;
      facebookGroupLink?: string | null;
    };
    curriculumModules: Array<{
      id: string;
      title: string;
      details: string | null;
      order: number;
      classes: Array<{
        id: string;
        title: string;
        videoUrl: string | null;
        duration: number | null;
        order: number;
      }>;
      materials: Array<{
        id: string;
        title: string;
        fileUrl: string | null;
        fileType: string | null;
        fileSize: number | null;
        order: number;
      }>;
    }>;
  };
}

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '--';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
};

// Helper function to format duration
const formatDuration = (minutes?: number): string => {
  if (!minutes) return '--';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} mins`;
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [ct, setCt] = useState<string | null>(null);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
      window.oncontextmenu = function () {
        return false;
      };
      document.oncontextmenu = function () {
        return false;
      };
    }

    return () => {};
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const response = await apiClient.getMyCourseDetails(courseId);
        setEnrollment(response.data);

        // Expand first module by default if available
        if (response.data.course.curriculumModules.length > 0) {
          const firstModuleId = response.data.course.curriculumModules[0]?.id;
          if (firstModuleId) {
            setExpandedModules(new Set([firstModuleId]));
          }
        }
      } catch (err: unknown) {
        console.error('Error fetching course data:', err);
        const errorMessage =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : 'Failed to load course data';
        setError(errorMessage || 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const modulesData: ModuleData[] =
    enrollment?.course.curriculumModules.map((module) => {
      // Calculate module progress based on completed classes
      const completedClasses = module.classes.filter((c) => c.videoUrl).length;
      const totalClasses = module.classes.length;
      const progress = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

      return {
        id: module.id,
        title: module.title,
        details: module.details || undefined,
        order: module.order,
        progress,
        classes: module.classes.map((classItem) => ({
          id: classItem.id,
          title: classItem.title,
          videoUrl: classItem.videoUrl || undefined,
          duration: classItem.duration || undefined,
          order: classItem.order,
          isCompleted: false, // TODO: Track completion from backend
          isLocked: !classItem.videoUrl, // Lock if no video URL
        })),
        materials: module.materials.map((material) => ({
          id: material.id,
          title: material.title,
          fileUrl: material.fileUrl || undefined,
          fileType: material.fileType || undefined,
          fileSize: material.fileSize || undefined,
          order: material.order,
        })),
      };
    }) || [];

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handlePlayVideo = (videoUrl?: string, isLocked?: boolean, title?: string) => {
    if (isLocked) return;
    if (videoUrl) {
      const vidIdArray = videoUrl?.split('/');

      const x = vidIdArray ? vidIdArray[vidIdArray.length - 1] || '' : '';
      setCurrentVideoId(x);
      setCt(title || null);
    }
  };

  // memo for video player
  const memoPlayer = useMemo(() => {
    if (currentVideoId.length > 0) {
      return (
        <div className="z-20 fixed top-0 left-0 right-0 bottom-0 bg-black/90 flex items-center justify-center">
          <Button
            aria-label="Close Video Player"
            className="z-500 bg-dark-blue/90 absolute top-10 left-10 ring-1 ring-vibrant-blue"
            size="icon"
            onClick={() => setCurrentVideoId('')}
          >
            <OctagonX color="#fef3fe" size={26} />
          </Button>
          {currentVideoId && <YTPlayer key={currentVideoId} videoId={currentVideoId} ct={ct} />}
        </div>
      );
    }
    return <></>;
  }, [currentVideoId, ct]);

  // Calculate overall course progress
  const _overallProgress = enrollment?.progress || 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-600 text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">Failed to Load Course</h2>
          <p className="text-gray-600">{error || 'Course not found or you are not enrolled.'}</p>
          <Button onClick={() => router.push('/student/courses')} className="mt-4">
            Back to My Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-4">
      {currentVideoId && memoPlayer}
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Course Header */}
        <div className="relative">
          <div className="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-800 rounded-2xl lg:rounded-3xl p-6 lg:p-8 w-full shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="font-bold text-2xl lg:text-4xl text-white">
                  {enrollment.course.title}
                </h1>
                <p className="text-blue-100 text-sm lg:text-base">
                  {enrollment.course.description || 'Master the concepts and build your skills'}
                </p>

                {/* Progress Bar - Hidden for future implementation */}
                {/* <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm font-medium text-white">
                      Course Progress
                    </span>
                    <span className="text-xs lg:text-sm font-bold text-white">
                      {overallProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-2.5 lg:h-3">
                    <div
                      className="bg-linear-to-r from-green-400 to-emerald-500 h-2.5 lg:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div> */}
              </div>

              {/* Facebook Group Card */}
              <div className="bg-white p-4 rounded-xl shadow-2xl hover:shadow-vibrant-blue hover:scale-105 transition-all duration-300 lg:w-72">
                <div className="flex items-center gap-3">
                  <FaSquareFacebook className="text-vibrant-blue shrink-0" size={40} />
                  <div className="flex-1 min-w-0">
                    <a
                      href={enrollment.course?.metadata?.facebookGroupLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm lg:text-base font-semibold text-vibrant-blue hover:underline truncate"
                    >
                      Join Study Group
                    </a>
                    <p className="text-xs text-gray-500">Connect with peers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Date */}
            <div className="mt-4 pt-4 border-t border-blue-400/30 text-right">
              <p className="text-xs lg:text-sm text-blue-100">
                Enrolled on{' '}
                <span className="font-semibold text-white">
                  {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Course Curriculum - Module System */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-200">
              Course Curriculum
            </h2>
            <div className="text-sm text-gray-500">{modulesData.length} Modules</div>
          </div>

          {/* Modules Accordion */}
          <div className="space-y-3">
            {modulesData.map((module, moduleIndex) => {
              const isExpanded = expandedModules.has(module.id);
              const completedClasses = module.classes.filter((c) => c.isCompleted).length;
              const totalClasses = module.classes.length;

              return (
                <div
                  key={module.id}
                  className="bg-white dark:bg-dark-blue/10 rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 lg:gap-4 flex-1 text-left">
                      {/* Module Number Badge */}
                      <div>
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                          <GripVertical size={20} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold mb-1">
                          Module {moduleIndex + 1} : {module.title}
                        </h3>
                        {module.details && (
                          <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-1">
                            {module.details}
                          </p>
                        )}

                        {/* Module Stats */}
                        <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            {totalClasses} {totalClasses === 1 ? 'Lesson' : 'Lessons'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            {module.materials.length}{' '}
                            {module.materials.length === 1 ? 'Material' : 'Materials'}
                          </span>
                          <span className="flex items-center gap-1" hidden>
                            <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            {completedClasses}/{totalClasses} Completed
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 lg:h-2" hidden>
                          <div
                            className={cn(
                              'h-1.5 lg:h-2 rounded-full transition-all duration-500',
                              module.progress === 100
                                ? 'bg-linear-to-r from-green-500 to-emerald-600'
                                : module.progress && module.progress > 0
                                  ? 'bg-linear-to-r from-blue-500 to-indigo-600'
                                  : 'bg-gray-300'
                            )}
                            style={{ width: `${module.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Module Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50/50 dark:bg-white/20">
                      {/* Classes Section */}
                      {module.classes.length > 0 && (
                        <div className="p-4 lg:p-5 space-y-2">
                          <h4 className="text-sm lg:text-base font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <Video className="w-4 h-4 text-blue-600" />
                            Video Lessons
                          </h4>
                          <div className="space-y-2">
                            {module.classes.map((classItem, classIndex) => (
                              <div
                                key={classItem.id}
                                className={cn(
                                  'flex items-center justify-between p-3  rounded-lg lg:rounded-xl transition-all',
                                  classItem.isLocked
                                    ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                    : classItem.isCompleted
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                )}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/* Status Icon */}
                                  <div className="shrink-0">
                                    {classItem.isLocked ? (
                                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                                      </div>
                                    ) : classItem.isCompleted ? (
                                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-sm lg:text-base">
                                          {classIndex + 1}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Class Info */}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm lg:text-base font-medium text-gray-900 truncate">
                                      {classItem.title}
                                    </h5>
                                    <div
                                      className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mt-0.5"
                                      hidden
                                    >
                                      <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                      <span>{formatDuration(classItem.duration)}</span>
                                      {classItem.isLocked && (
                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                          Locked
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Play Button */}
                                {!classItem.isLocked && classItem.videoUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handlePlayVideo(
                                        classItem.videoUrl,
                                        classItem.isLocked,
                                        classItem.title
                                      )
                                    }
                                    className="shrink-0 h-9 w-9 lg:h-10 lg:w-10 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-full cursor-pointer"
                                  >
                                    <Play className="h-4 w-4 lg:h-5 lg:w-5" color="black" />
                                    <span className="sr-only">Play video</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Materials Section */}
                      {module.materials.length > 0 && (
                        <div className="p-4 lg:p-5 border-t border-gray-200 space-y-2">
                          <h4 className="text-sm lg:text-base font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                            Course Materials
                          </h4>
                          <div className="space-y-2">
                            {module.materials.map((material) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between p-3  bg-white rounded-lg lg:rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer"
                                onClick={() =>
                                  material.fileUrl && window.open(material.fileUrl, '_blank')
                                }
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/* File Type Icon */}
                                  <div className="shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                                  </div>

                                  {/* Material Info */}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm lg:text-base font-medium text-gray-900 truncate">
                                      {material.title}
                                    </h5>
                                    <div
                                      className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mt-0.5"
                                      hidden
                                    >
                                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                                        {material.fileType || 'File'}
                                      </span>
                                      <span>{formatFileSize(material.fileSize)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Download Button */}
                                {material.fileUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(material.fileUrl, '_blank');
                                    }}
                                    className="shrink-0 h-9 w-9 lg:h-10 lg:w-10 p-0 hover:bg-purple-100 hover:text-purple-600 rounded-full cursor-pointer text-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/30"
                                    title="Open in new tab"
                                  >
                                    <Download className="h-4 w-4 lg:h-5 lg:w-5" />
                                    <span className="sr-only">Open file in new tab</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
