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

type Course = {
  name: string;
  type: string;
  totalVideo: number;
  progress: number;
};

const data: Course[] = [
  {
    name: 'React Fundamentals',
    type: 'Frontend',
    totalVideo: 25,
    progress: 75,
  },
  {
    name: 'Node.js Basics',
    type: 'Backend',
    totalVideo: 30,
    progress: 40,
  },
  {
    name: 'React Fundamentals',
    type: 'Frontend',
    totalVideo: 25,
    progress: 75,
  },
  {
    name: 'Node.js Basics',
    type: 'Backend',
    totalVideo: 30,
    progress: 40,
  },
];

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
    header: 'Total Video',
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      const progress = row.getValue('progress') as number;
      return (
        <div className="w-full">
          <div className="flex items-center gap-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
        </div>
      );
    },
  },
];

export function CourseTable() {
  const route = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md h-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                  route.push(`/student/class/${row.id}`);
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
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
