'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyPurchaseData } from './PurchaseGraphs';

export interface CourseWebinarOption {
  id: string;
  name: string;
  enrollmentData: MonthlyPurchaseData[];
}

interface StudentEnrollmentGraphProps {
  title: string;
  options: CourseWebinarOption[];
  barColor: string;
  placeholder: string;
}

export function StudentEnrollmentGraph({
  title,
  options,
  barColor,
  placeholder,
}: StudentEnrollmentGraphProps) {
  const [selectedId, setSelectedId] = useState<string>(options[0]?.id || '');

  const selectedOption = options.find((opt) => opt.id === selectedId);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {selectedOption ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedOption.enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={{ stroke: '#cbd5e1' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="count" fill={barColor} radius={[8, 8, 0, 0]} name="Students Enrolled" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          Select a {placeholder.toLowerCase()} to view data
        </div>
      )}
    </div>
  );
}
