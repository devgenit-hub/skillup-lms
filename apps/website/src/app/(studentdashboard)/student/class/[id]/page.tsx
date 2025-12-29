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
} from 'lucide-react';
import { ModuleData } from '@/components/student/types/ModuleDataProps';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaSquareFacebook } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

// Mock module data with curriculum structure
const modulesData: ModuleData[] = [
  {
    id: '1',
    title: 'Module 1: React Fundamentals',
    details: 'Learn the basics of React including components, JSX, and props',
    order: 0,
    progress: 75,
    classes: [
      {
        id: 'c1-1',
        title: 'Introduction to React',
        videoUrl: 'https://youtu.be/5LYy31dCZoQ',
        duration: 60,
        order: 0,
        isCompleted: true,
      },
      {
        id: 'c1-2',
        title: 'JSX and Components',
        videoUrl: 'https://youtu.be/24L7r7SoK_Y',
        duration: 45,
        order: 1,
        isCompleted: true,
      },
      {
        id: 'c1-3',
        title: 'Props and State Basics',
        videoUrl: 'https://youtu.be/HLVzEHGLF7Y',
        duration: 50,
        order: 2,
        isCompleted: false,
      },
    ],
    materials: [
      {
        id: 'm1-1',
        title: 'React Basics Slides',
        fileUrl: 'https://example.com/download',
        fileType: 'PDF',
        fileSize: 2621440, // 2.5 MB in bytes
        order: 0,
      },
      {
        id: 'm1-2',
        title: 'Exercise Solutions',
        fileUrl: 'https://example.com/download',
        fileType: 'ZIP',
        fileSize: 1258291, // 1.2 MB in bytes
        order: 1,
      },
    ],
  },
  {
    id: '2',
    title: 'Module 2: State Management',
    details: 'Deep dive into state management with useState, useReducer, and Context API',
    order: 1,
    progress: 50,
    classes: [
      {
        id: 'c2-1',
        title: 'useState Hook',
        videoUrl: 'https://youtu.be/O6P86uwfdR0',
        duration: 55,
        order: 0,
        isCompleted: true,
      },
      {
        id: 'c2-2',
        title: 'useReducer Pattern',
        videoUrl: 'https://youtu.be/kK_Wqx3RnHk',
        duration: 65,
        order: 1,
        isCompleted: false,
      },
      {
        id: 'c2-3',
        title: 'Context API',
        duration: 70,
        order: 2,
        isCompleted: false,
        isLocked: true,
      },
    ],
    materials: [
      {
        id: 'm2-1',
        title: 'State Management Guide',
        fileUrl: 'https://example.com/download',
        fileType: 'PDF',
        fileSize: 3145728, // 3 MB in bytes
        order: 0,
      },
    ],
  },
  {
    id: '3',
    title: 'Module 3: Advanced Hooks',
    details: 'Master advanced hooks like useEffect, useMemo, useCallback, and custom hooks',
    order: 2,
    progress: 0,
    classes: [
      {
        id: 'c3-1',
        title: 'useEffect Deep Dive',
        duration: 75,
        order: 0,
        isCompleted: false,
        isLocked: true,
      },
      {
        id: 'c3-2',
        title: 'Performance Optimization',
        duration: 60,
        order: 1,
        isCompleted: false,
        isLocked: true,
      },
      {
        id: 'c3-3',
        title: 'Custom Hooks',
        duration: 80,
        order: 2,
        isCompleted: false,
        isLocked: true,
      },
    ],
    materials: [
      {
        id: 'm3-1',
        title: 'Advanced Hooks Cheatsheet',
        fileType: 'PDF',
        fileSize: 1048576, // 1 MB in bytes
        order: 0,
      },
      {
        id: 'm3-2',
        title: 'Code Examples',
        fileType: 'ZIP',
        fileSize: 5242880, // 5 MB in bytes
        order: 1,
      },
    ],
  },
  {
    id: '4',
    title: 'Module 4: React Router & Navigation',
    details: 'Learn client-side routing and navigation in React applications',
    order: 3,
    progress: 0,
    classes: [
      {
        id: 'c4-1',
        title: 'React Router Setup',
        duration: 45,
        order: 0,
        isCompleted: false,
        isLocked: true,
      },
      {
        id: 'c4-2',
        title: 'Dynamic Routes',
        duration: 55,
        order: 1,
        isCompleted: false,
        isLocked: true,
      },
    ],
    materials: [],
  },
];

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'N/A';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
};

// Helper function to format duration
const formatDuration = (minutes?: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} mins`;
};

export default function Page() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1'])); // First module expanded by default

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

  const handlePlayVideo = (videoUrl?: string, isLocked?: boolean) => {
    if (isLocked) return;
    if (videoUrl) {
      const curPath = window.location.pathname;
      const vidIdArray = videoUrl?.split('/');

      const x = vidIdArray ? vidIdArray[vidIdArray.length - 1] || '' : '';
      window.location.assign(curPath + `/classroom/${x}`);
    }
  };

  const handleDownloadMaterial = (fileUrl?: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  // Calculate overall course progress
  const overallProgress = Math.round(
    modulesData.reduce((acc, module) => acc + (module.progress || 0), 0) / modulesData.length
  );

  return (
    <div className="min-h-screen pb-4">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Course Header */}
        <div className="relative">
          <div className="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-800 rounded-2xl lg:rounded-3xl p-6 lg:p-8 w-full shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="font-bold text-2xl lg:text-4xl text-white">React Mastery Course</h1>
                <p className="text-blue-100 text-sm lg:text-base">
                  Master React from fundamentals to advanced concepts
                </p>

                {/* Progress Bar */}
                <div className="pt-2">
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
                </div>
              </div>

              {/* Facebook Group Card */}
              <div className="bg-white p-4 rounded-xl shadow-2xl hover:shadow-vibrant-blue hover:scale-105 transition-all duration-300 lg:w-72">
                <div className="flex items-center gap-3">
                  <FaSquareFacebook className="text-vibrant-blue flex-shrink-0" size={40} />
                  <div className="flex-1 min-w-0">
                    <a
                      href="#"
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
                <span className="font-semibold text-white">Tuesday, 14 October 2025</span>
              </p>
            </div>
          </div>
        </div>

        {/* Course Curriculum - Module System */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Course Curriculum</h2>
            <div className="text-sm text-gray-600">{modulesData.length} Modules</div>
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
                  className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-4 lg:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 lg:gap-4 flex-1 text-left">
                      {/* Module Number Badge */}
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-base lg:text-lg">
                          {moduleIndex + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1">
                          {module.title}
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
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            {completedClasses}/{totalClasses} Completed
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
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
                    <div className="flex-shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Module Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50/50">
                      {/* Classes Section */}
                      {module.classes.length > 0 && (
                        <div className="p-4 lg:p-6 space-y-2">
                          <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Video className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            Video Lessons
                          </h4>
                          <div className="space-y-2">
                            {module.classes.map((classItem, classIndex) => (
                              <div
                                key={classItem.id}
                                className={cn(
                                  'flex items-center justify-between p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all',
                                  classItem.isLocked
                                    ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                    : classItem.isCompleted
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                )}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/* Status Icon */}
                                  <div className="flex-shrink-0">
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
                                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mt-0.5">
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
                                      handlePlayVideo(classItem.videoUrl, classItem.isLocked)
                                    }
                                    className="shrink-0 h-9 w-9 lg:h-10 lg:w-10 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-full"
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
                        <div className="p-4 lg:p-6 border-t border-gray-200 space-y-2">
                          <h4 className="text-sm lg:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                            Course Materials
                          </h4>
                          <div className="space-y-2">
                            {module.materials.map((material) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between p-3 lg:p-4 bg-white rounded-lg lg:rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
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
                                    <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mt-0.5">
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
                                    onClick={() => handleDownloadMaterial(material.fileUrl)}
                                    className="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 p-0 hover:bg-purple-100 hover:text-purple-600 rounded-full"
                                  >
                                    <Download className="h-4 w-4 lg:h-5 lg:w-5" />
                                    <span className="sr-only">Download file</span>
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
