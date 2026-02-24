'use client';

import { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';

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
  onSelectItem?: (id: string) => Promise<MonthlyPurchaseData[]>;
}

export function StudentEnrollmentGraph({
  title,
  options,
  barColor,
  placeholder,
  onSelectItem,
}: StudentEnrollmentGraphProps) {
  const [selectedId, setSelectedId] = useState<string>(options[0]?.id || '');
  const [enrollmentData, setEnrollmentData] = useState<MonthlyPurchaseData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch enrollment data when selection changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedId || !onSelectItem) return;

      setLoading(true);
      try {
        const data = await onSelectItem(selectedId);
        setEnrollmentData(data);
      } catch {
        setEnrollmentData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedId, onSelectItem]);

  // Set initial selection when options change
  useEffect(() => {
    if (options.length > 0 && !selectedId) {
      setSelectedId(options[0]?.id || '');
    }
  }, [options, selectedId]);

  const selectedOption = options.find((opt) => opt.id === selectedId);
  const dataToShow = onSelectItem ? enrollmentData : selectedOption?.enrollmentData || [];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer max-w-[200px] truncate"
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

      {loading ? (
        <div className="h-75 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : selectedOption && dataToShow.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataToShow}>
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
      ) : options.length === 0 ? (
        <div className="h-75 flex items-center justify-center text-slate-500">
          No {placeholder.toLowerCase().replace('select a ', '')}s available
        </div>
      ) : (
        <div className="h-75 flex items-center justify-center text-slate-500">
          {selectedOption
            ? 'No enrollment data available'
            : `Select a ${placeholder.toLowerCase().replace('select a ', '')} to view data`}
        </div>
      )}
    </div>
  );
}
