'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { PurchaseGraph, MonthlyPurchaseData } from '@/components/superuser/PurchaseGraphs';
import {
  StudentEnrollmentGraph,
  CourseWebinarOption,
} from '@/components/superuser/StudentEnrollmentGraph';
import { CourseRevenueGraph, CourseRevenueOption } from '@/components/superuser/CourseRevenueGraph';
import { MonthlyEarningsGraph } from '@/components/superuser/MonthlyEarningsGraph';

interface AnalyticsItem {
  id: string;
  name: string;
}

export default function FinancePage() {
  const [refreshing, setRefreshing] = useState(false);

  // Purchase analytics data
  const [coursePurchaseData, setCoursePurchaseData] = useState<MonthlyPurchaseData[]>([]);
  const [webinarPurchaseData, setWebinarPurchaseData] = useState<MonthlyPurchaseData[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(true);

  // Enrollment analytics data
  const [courses, setCourses] = useState<CourseWebinarOption[]>([]);
  const [webinars, setWebinars] = useState<CourseWebinarOption[]>([]);
  const [revenueCoursesOptions, setRevenueCoursesOptions] = useState<CourseRevenueOption[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  const fetchPurchaseAnalytics = useCallback(async () => {
    try {
      setPurchaseLoading(true);
      const response = await apiClient.getPurchaseAnalytics();
      if (response.data) {
        const data = response.data as {
          coursePurchases: MonthlyPurchaseData[];
          webinarPurchases: MonthlyPurchaseData[];
        };
        setCoursePurchaseData(data.coursePurchases || []);
        setWebinarPurchaseData(data.webinarPurchases || []);
      }
    } catch {
      // Silently fail - graphs will show empty
    } finally {
      setPurchaseLoading(false);
    }
  }, []);

  const fetchItemsForAnalytics = useCallback(async () => {
    try {
      setItemsLoading(true);
      const response = await apiClient.getItemsForAnalytics();
      if (response.data) {
        const data = response.data as {
          courses: AnalyticsItem[];
          webinars: AnalyticsItem[];
        };

        setCourses(
          data.courses.map((c) => ({
            id: c.id,
            name: c.name,
            enrollmentData: [],
          }))
        );
        setRevenueCoursesOptions(
          data.courses.map((c) => ({
            id: c.id,
            name: c.name,
          }))
        );
        setWebinars(
          data.webinars.map((w) => ({
            id: w.id,
            name: w.name,
            enrollmentData: [],
          }))
        );
      }
    } catch {
      // Silently fail
    } finally {
      setItemsLoading(false);
    }
  }, []);

  const fetchEnrollmentData = useCallback(
    async (type: 'course' | 'webinar', id: string): Promise<MonthlyPurchaseData[]> => {
      try {
        const response = await apiClient.getEnrollmentAnalytics({ type, id });
        if (response.data) {
          const data = response.data as { enrollmentData: MonthlyPurchaseData[] };
          return data.enrollmentData || [];
        }
      } catch {
        // Silently fail
      }
      return [];
    },
    []
  );

  const fetchCourseRevenue = useCallback(
    async (
      courseId: string,
      months: number
    ): Promise<{ revenueData: { month: string; amount: number }[]; totalRevenue: number }> => {
      try {
        const response = await apiClient.getCourseRevenueAnalytics({ courseId, months });
        if (response.data) {
          const data = response.data as {
            revenueData: { month: string; amount: number }[];
            totalRevenue: number;
          };
          return { revenueData: data.revenueData || [], totalRevenue: data.totalRevenue || 0 };
        }
      } catch {
        // Silently fail
      }
      return { revenueData: [], totalRevenue: 0 };
    },
    []
  );

  const fetchMonthlyEarnings = useCallback(
    async (
      year: number
    ): Promise<{ earnings: { month: string; revenue: number }[]; total: number }> => {
      try {
        const response = await apiClient.getRevenueAnalytics({ period: 'monthly', year });
        if (response.data) {
          const rawData = response.data as Array<{ period: string; revenue: number }>;
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
          const earnings = rawData.map((item) => {
            const monthIndex = parseInt(item.period.split('-')[1] || '1') - 1;
            return {
              month: monthNames[monthIndex] || item.period,
              revenue: item.revenue,
            };
          });
          const total = earnings.reduce((sum, e) => sum + e.revenue, 0);
          return { earnings, total };
        }
      } catch {
        // Silently fail
      }
      return { earnings: [], total: 0 };
    },
    []
  );

  useEffect(() => {
    fetchPurchaseAnalytics();
    fetchItemsForAnalytics();
  }, [fetchPurchaseAnalytics, fetchItemsForAnalytics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchPurchaseAnalytics(), fetchItemsForAnalytics()]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Finance & Analytics"
        description="Track purchases, enrollments, and revenue across courses and webinars"
        actionButton={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">Monthly Earnings Overview</h2>
      <div className="grid grid-cols-1 gap-6">
        <MonthlyEarningsGraph onFetchData={fetchMonthlyEarnings} />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">Purchase Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {purchaseLoading ? (
          <>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse h-[380px]" />
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse h-[380px]" />
          </>
        ) : (
          <>
            <PurchaseGraph
              title="Course Purchases (Last 12 Months)"
              data={coursePurchaseData}
              barColor="#3b82f6"
            />
            <PurchaseGraph
              title="Webinar Purchases (Last 12 Months)"
              data={webinarPurchaseData}
              barColor="#8b5cf6"
            />
          </>
        )}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">Student Enrollment Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {itemsLoading ? (
          <>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse h-[380px]" />
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse h-[380px]" />
          </>
        ) : (
          <>
            <StudentEnrollmentGraph
              title="Course Student Enrollment"
              options={courses}
              barColor="#10b981"
              placeholder="Select a course"
              onSelectItem={(id) => fetchEnrollmentData('course', id)}
            />
            <StudentEnrollmentGraph
              title="Webinar Student Enrollment"
              options={webinars}
              barColor="#f59e0b"
              placeholder="Select a webinar"
              onSelectItem={(id) => fetchEnrollmentData('webinar', id)}
            />
          </>
        )}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">Course Revenue Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {itemsLoading ? (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse h-[380px]" />
        ) : (
          <CourseRevenueGraph
            title="Course Revenue"
            options={revenueCoursesOptions}
            barColor="#f02629"
            placeholder="Select a course"
            onSelectItem={fetchCourseRevenue}
          />
        )}
      </div>
    </div>
  );
}
