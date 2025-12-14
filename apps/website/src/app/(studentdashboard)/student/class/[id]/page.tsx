'use client';
import { Play } from 'lucide-react';
import ClassTable from '../../../../../components/student/ClassTable';
import { ClassDataProps } from '@/components/student/types/ClassDataProps';
import { NavTypeProps } from '@/components/student/types/NavTypeProps';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { FaSquareFacebook } from 'react-icons/fa6';

const materialsData: ClassDataProps[] = [
  {
    id: 1,
    title: 'React Basics Slides',
    date: new Date().toISOString(),
    fileType: 'PDF',
    fileSize: '2.5 MB',
    downloadUrl: 'https://example.com/download',
  },
  {
    id: 2,
    title: 'Exercise Solutions',
    date: new Date().toISOString(),
    fileType: 'ZIP',
    fileSize: '1.2 MB',
    downloadUrl: 'https://example.com/download',
  },
  {
    id: 3,
    title: 'Course Resources Pack',
    date: new Date().toISOString(),
    fileType: 'ZIP',
    fileSize: '5.1 MB',
    downloadUrl: 'https://example.com/download',
  },
];

const liveClassColumns: ColumnDef<ClassDataProps>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'title',
    header: 'Class Title',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date');
      try {
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(date as string), 'MMMM d, yyyy')}
          </div>
        );
      } catch {
        return <div className="text-sm text-gray-600">Invalid date</div>;
      }
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue('duration')}</div>,
  },
  {
    accessorKey: 'instructor',
    header: 'Instructor',
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue('instructor')}</div>,
  },
];

const recordedClassColumns: ColumnDef<ClassDataProps>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'title',
    header: 'Class Title',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date');
      try {
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(date as string), 'MMMM d, yyyy')}
          </div>
        );
      } catch {
        return <div className="text-sm text-gray-600">Invalid date</div>;
      }
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue('duration')}</div>,
  },
  {
    accessorKey: 'instructor',
    header: 'Instructor',
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue('instructor')}</div>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const videoUrl = row.original.videoUrl;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (videoUrl) window.open(videoUrl, '_blank');
          }}
          disabled={!videoUrl}
          className="h-8 w-8 p-0"
        >
          <Play className="h-4 w-4" />
          <span className="sr-only">Play video</span>
        </Button>
      );
    },
  },
];

const materialsColumns: ColumnDef<ClassDataProps>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'title',
    header: 'File Name',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'fileType',
    header: 'Type',
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue('fileType')}</div>,
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue('fileSize')}</div>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const downloadUrl = row.original.downloadUrl;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (downloadUrl) window.open(downloadUrl, '_blank');
          }}
          disabled={!downloadUrl}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download file</span>
        </Button>
      );
    },
  },
];

const liveClassData: ClassDataProps[] = [
  {
    id: 1,
    title: 'Introduction to React',
    date: new Date().toISOString(),
    duration: '60 mins',
    instructor: 'John Doe',
  },
  {
    id: 2,
    title: 'State Management',
    date: new Date().toISOString(),
    duration: '90 mins',
    instructor: 'Jane Smith',
  },
  {
    id: 3,
    title: 'Hooks Deep Dive',
    date: new Date(Date.now() + 86400000).toISOString(),
    duration: '120 mins',
    instructor: 'Sarah Wilson',
  },
  {
    id: 4,
    title: 'Advanced Patterns',
    date: new Date(Date.now() + 172800000).toISOString(),
    duration: '90 mins',
    instructor: 'Mike Johnson',
  },
];

const recordedClassData: ClassDataProps[] = [
  {
    id: 1,
    title: 'Introduction to React',
    date: new Date(Date.now() - 172800000).toISOString(),
    duration: '60 mins',
    instructor: 'John Doe',
    videoUrl: 'https://youtu.be/7d16CpWp-ok',
  },
  {
    id: 2,
    title: 'State Management',
    date: new Date(Date.now() - 86400000).toISOString(),
    duration: '90 mins',
    instructor: 'Jane Smith',
    videoUrl: 'https://youtu.be/24L7r7SoK_Y',
  },
  {
    id: 3,
    title: 'Component Lifecycle',
    date: new Date(Date.now() - 259200000).toISOString(),
    duration: '75 mins',
    instructor: 'David Chen',
    videoUrl: 'https://youtu.be/HLVzEHGLF7Y',
  },
];

export default function Page() {
  const [activeNav, setActiveNav] = useState<NavTypeProps>('live');

  const getNavStyles = (type: NavTypeProps) => {
    const styles = {
      live: {
        bg: 'bg-red-50',
        text: 'text-red-600',
      },
      recorded: {
        bg: 'bg-green-50',
        text: 'text-green-600',
      },
      materials: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
      },
    };
    return styles[type];
  };

  const currentStyles = getNavStyles(activeNav);

  const getCurrentData = () => {
    switch (activeNav) {
      case 'live':
        return liveClassData;
      case 'recorded':
        return recordedClassData;
      case 'materials':
        return materialsData;
    }
  };

  const getCurrentColumns = () => {
    switch (activeNav) {
      case 'live':
        return liveClassColumns;
      case 'recorded':
        return recordedClassColumns;
      case 'materials':
        return materialsColumns;
    }
  };

  return (
    <div className="min-h-screen pb-4">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        <div className="relative">
          {/* Course Header */}
          <div className="bg-gradient-to-tr from-blue-400/60 to-80% to-indigo-800 rounded-2xl lg:rounded-3xl p-4 lg:p-8 w-full">
            <h1 className="font-bold text-xl lg:text-3xl text-white mb-2">React Mastery Course</h1>

            <div className="bg-white p-4 rounded-xl w-fit shadow-vibrant-blue shadow-2xl space-y-2 hover:bg-slate-100 transition-colors">
              <FaSquareFacebook className="text-vibrant-blue" size={32} />

              <a href="#" target="_blank" rel="noopener noreferrer">
                <span className="stext-sm lg:text-base font-medium text-vibrant-blue hover:underline">
                  Join our Facebook Study Group
                </span>
              </a>
            </div>

            <div className="text-right text-xs lg:text-sm text-white/80">
              <p className="font-medium">Enrolled on</p>
              <p>Tuesday, 14 October 2025</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 lg:absolute lg:-bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:mt-0">
            <div className="flex justify-center lg:justify-between items-center bg-white rounded-2xl lg:rounded-full p-1 lg:p-1.5 shadow-lg border border-gray-100 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveNav('live')}
                className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 rounded-xl lg:rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                  activeNav === 'live'
                    ? `${currentStyles.bg} ${currentStyles.text}`
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {activeNav === 'live' && (
                  <span className="relative flex h-2 w-2 lg:h-3 lg:w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50 animate-ping"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-red-500 translate-x-0.5 translate-y-0.5"></span>
                  </span>
                )}
                Live Class
              </button>

              <div className="w-px h-4 bg-gray-200"></div>

              <button
                onClick={() => setActiveNav('recorded')}
                className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 rounded-xl lg:rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                  activeNav === 'recorded'
                    ? `${currentStyles.bg} ${currentStyles.text}`
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {activeNav === 'recorded' && <Play className="h-2.5 w-2.5 lg:h-3 lg:w-3" />}
                Recorded Class
              </button>

              <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>

              <button
                onClick={() => setActiveNav('materials')}
                className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 rounded-xl lg:rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                  activeNav === 'materials'
                    ? `${currentStyles.bg} ${currentStyles.text}`
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Materials
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:mt-8">
          <ClassTable data={getCurrentData()} columns={getCurrentColumns()} />
        </div>
      </div>
    </div>
  );
}
