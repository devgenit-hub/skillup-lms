'use client';

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

export interface MonthlyPurchaseData {
  month: string;
  count: number;
}

interface PurchaseGraphProps {
  title: string;
  data: MonthlyPurchaseData[];
  barColor: string;
  dataKey?: string;
}

export function PurchaseGraph({ title, data, barColor, dataKey = 'count' }: PurchaseGraphProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar dataKey={dataKey} fill={barColor} radius={[8, 8, 0, 0]} name="Purchases" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
