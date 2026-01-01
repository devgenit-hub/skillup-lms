'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from 'recharts';

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentMethod: string;
  transactionId: string | null;
  invoiceId: string | null;
  gatewayTransactionId: string | null;
  createdAt: string;
  paidAt: string | null;
  refundedAt: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  user: { id: string; name: string | null; email: string; avatarUrl: string | null };
  course: { id: string; title: string } | null;
  webinar: { id: string; title: string } | null;
}

// --- DATA PROCESSING HELPER ---
const processChartData = (transactions: Payment[]) => {
  // 1. Initialize structure
  const counts = { Courses: 0, Webinars: 0 };
  const earningsByMonth = Array(12).fill(0); // Index 0 = Jan, 11 = Dec
  let totalRevenue = 0;

  // 2. Loop through transactions
  transactions.forEach((txn) => {
    // Only count successful payments
    if (txn.status !== 'COMPLETED') return;

    // A. Count Types
    // Check metadata first, fallback to checking which object exists
    const type = txn.course ? 'course' : txn.webinar ? 'webinar' : null;

    if (type === 'course') {
      counts.Courses += 1;
    } else if (type === 'webinar') {
      counts.Webinars += 1;
    }

    // B. Calculate Earnings
    const amount = txn.amount || 0;
    totalRevenue += amount;

    // C. Aggregate by Month
    // Ensure paidAt exists, otherwise fallback to createdAt
    const dateStr = txn.paidAt || txn.createdAt;
    if (dateStr) {
      const date = new Date(dateStr);
      const monthIndex = date.getMonth(); // 0-11
      earningsByMonth[monthIndex] += amount;
    }
  });

  // 3. Format for Recharts
  const comparisonData = [
    { name: 'Courses', sold: counts.Courses, color: '#8884d8' }, // Purple
    { name: 'Webinars', sold: counts.Webinars, color: '#82ca9d' }, // Green
  ];

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const yearlyEarningsData = earningsByMonth.map((amount, index) => ({
    month: monthNames[index],
    earnings: amount,
  }));

  return { comparisonData, yearlyEarningsData, totalRevenue };
};

const RevenueDashboard = ({
  paymentList = [],
  handleState,
}: {
  paymentList: Payment[];
  handleState: () => void;
}) => {
  // Memoize the calculation so it doesn't re-run on every render
  const { comparisonData, yearlyEarningsData, totalRevenue } = useMemo(
    () => processChartData(paymentList),
    [paymentList]
  );

  return (
    <div className="p-6 bg-black/60 min-h-screen font-sans fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Sales Overview{' '}
              <button
                className="bg-red-500 text-red-50 rounded-full cursor-pointer px-4 py-2 text-sm"
                onClick={handleState}
              >
                Close
              </button>{' '}
            </h2>
            <p className="text-gray-300 text-sm mt-1">Real-time payment analysis</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-gray-500 text-sm font-medium mr-2">Total Revenue:</span>
            <span className="text-green-600 font-bold text-lg">
              ৳{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Comparison (Bar Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Purchases: Courses vs Webinars
            </h3>
            <div className="flex-1 min-h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="sold" radius={[8, 8, 0, 0]} barSize={80}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Yearly Earnings (Area Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Monthly Earnings</h3>
            <div className="flex-1 min-h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={yearlyEarningsData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(val) => `৳${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`৳${value}`, 'Earnings']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
