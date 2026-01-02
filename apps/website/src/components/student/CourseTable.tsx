'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

type Course = {
  id: string;
  name: string;
  type: string;
  totalVideo: number;
  progress: number;
};

const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'totalVideo',
    header: 'Total Lessons',
  },
  // Progress column - Hidden for future implementation
  // {
  //   accessorKey: 'progress',
  //   header: 'Progress',
  //   cell: ({ row }) => {
  //     const progress = row.getValue('progress') as number;
  //     return (
  //       <div className="w-full">
  //         <div className="flex items-center gap-2">
  //           <div className="h-2 w-full bg-gray-200 rounded-full">
  //             <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
  //           </div>
  //           <span className="text-sm text-gray-600">{progress}%</span>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
];

export function CourseTable() {
  const router = useRouter();
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await apiClient.getMyEnrollments();
        if (response.data?.enrollments) {
          const courses = response.data.enrollments.map((enrollment) => {
            // Calculate total lessons from curriculum modules
            const totalLessons =
              enrollment.course.curriculumModules?.reduce(
                (sum, module) => sum + (module._count?.classes || 0),
                0
              ) || 0;

            return {
              id: enrollment.courseId,
              name: enrollment.course.title,
              type: enrollment.course.category?.title || 'General',
              totalVideo: totalLessons,
              progress: enrollment.progress,
            };
          });
          setData(courses);
        }
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-vibrant-blue" />
      </div>
    );
  }

  return (
    <div className="rounded-md h-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/student/class/${row.original.id}`);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No courses found. Enroll in a course to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
