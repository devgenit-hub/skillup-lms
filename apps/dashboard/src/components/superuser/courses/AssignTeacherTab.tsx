'use client';

import { User, Check, Loader2 } from 'lucide-react';
import { TeacherProps } from '@/components/props/TeacherProps';
import Image from 'next/image';

interface AssignTeacherTabProps {
  availableTeachers: TeacherProps[];
  assignedTeachers: TeacherProps[];
  onAssignTeacher: (teacherId: string) => void;
  onUnassignTeacher: (teacherId: string) => void;
  isAssigningTeacher: boolean;
}

export function AssignTeacherTab({
  availableTeachers,
  assignedTeachers,
  onAssignTeacher,
  onUnassignTeacher,
  isAssigningTeacher,
}: AssignTeacherTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Available Teachers */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-slate-500" />
          Available Teachers ({availableTeachers.length})
        </h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {availableTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                {teacher.profileImage ? (
                  <Image
                    src={teacher.profileImage}
                    alt={teacher.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{teacher.name}</p>
                <p className="text-sm text-slate-500 truncate">{teacher.email}</p>
              </div>
              <button
                onClick={() => onAssignTeacher(teacher.id)}
                disabled={isAssigningTeacher}
                className="px-4 py-2 bg-dark-blue text-white rounded-lg hover:bg-dark-blue/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAssigningTeacher ? <Loader2 size={16} className="animate-spin" /> : null}
                Assign
              </button>
            </div>
          ))}
          {availableTeachers.length === 0 && (
            <p className="text-slate-500 text-center py-8">No available teachers</p>
          )}
        </div>
      </div>

      {/* Assigned Teachers */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Check size={20} className="text-green-600" />
          Assigned Teachers ({assignedTeachers.length})
        </h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {assignedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-green-200 shrink-0">
                {teacher.profileImage ? (
                  <Image
                    src={teacher.profileImage}
                    alt={teacher.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-green-600">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{teacher.name}</p>
                <p className="text-sm text-slate-500 truncate">{teacher.email}</p>
              </div>
              <button
                onClick={() => onUnassignTeacher(teacher.id)}
                disabled={isAssigningTeacher}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
          {assignedTeachers.length === 0 && (
            <p className="text-slate-500 text-center py-8">No teachers assigned yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
