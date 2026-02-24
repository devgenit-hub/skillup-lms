'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Loader2 } from 'lucide-react';

interface RevenueDataPoint {
  month: string;
  amount: number;
}

export interface CourseRevenueOption {
  id: string;
  name: string;
}

interface CourseRevenueGraphProps {
  title: string;
  options: CourseRevenueOption[];
  barColor: string;
  placeholder: string;
  onSelectItem: (
    courseId: string,
    months: number
  ) => Promise<{ revenueData: RevenueDataPoint[]; totalRevenue: number }>;
}

const MONTH_OPTIONS = [
  { label: 'Last 3 Months', value: 3 },
  { label: 'Last 6 Months', value: 6 },
  { label: 'Last 12 Months', value: 12 },
];

export function CourseRevenueGraph({
  title,
  options,
  barColor,
  placeholder,
  onSelectItem,
}: CourseRevenueGraphProps) {
  const [selectedId, setSelectedId] = useState<string>(options[0]?.id || '');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      const result = await onSelectItem(selectedId, selectedMonths);
      setRevenueData(result.revenueData || []);
      setTotalRevenue(result.totalRevenue || 0);
    } catch {
      setRevenueData([]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  }, [selectedId, selectedMonths, onSelectItem]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set initial selection when options change
  useEffect(() => {
    if (options.length > 0 && !selectedId) {
      setSelectedId(options[0]?.id || '');
    }
  }, [options, selectedId]);

  const formatCurrency = (value: number) => {
    return `৳${value.toLocaleString('en-BD')}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {totalRevenue >= 0 && !loading && (
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Total: {formatCurrency(totalRevenue)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer truncate"
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
          <select
            value={selectedMonths}
            onChange={(e) => setSelectedMonths(Number(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-75 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : selectedId && revenueData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => `৳${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Revenue']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="amount" fill={barColor} radius={[8, 8, 0, 0]} name="Revenue (BDT)" />
          </BarChart>
        </ResponsiveContainer>
      ) : options.length === 0 ? (
        <div className="h-75 flex items-center justify-center text-slate-500">
          No courses available
        </div>
      ) : (
        <div className="h-75 flex items-center justify-center text-slate-500">
          {selectedId
            ? 'No revenue data available for this period'
            : `Select a ${placeholder.toLowerCase().replace('select a ', '')} to view revenue`}
        </div>
      )}
    </div>
  );
}
