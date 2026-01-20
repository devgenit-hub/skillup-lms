'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DollarSign, Users, Video, RefreshCw, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';
import { useApp } from '@/context/app-context';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { PurchaseGraph, MonthlyPurchaseData } from '@/components/superuser/PurchaseGraphs';
import {
  StudentEnrollmentGraph,
  CourseWebinarOption,
} from '@/components/superuser/StudentEnrollmentGraph';

interface DashboardStats {
  students: {
    total: number;
    active: number;
    suspended: number;
    monthlyGrowth: number;
  };
  courses: {
    total: number;
    published: number;
  };
  enrollments: {
    total: number;
    monthlyGrowth: number;
  };
  revenue: {
    total: number;
    monthly: number;
    monthlyGrowth: number;
  };
  webinars: {
    total: number;
    upcoming: number;
    registrations: number;
  };
}

interface AnalyticsItem {
  id: string;
  name: string;
}

export default function SuperuserDashboard() {
  const { refreshAll } = useApp();
  const { t } = useLocale();
  const pageText = t('superuser');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Purchase analytics data
  const [coursePurchaseData, setCoursePurchaseData] = useState<MonthlyPurchaseData[]>([]);
  const [webinarPurchaseData, setWebinarPurchaseData] = useState<MonthlyPurchaseData[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(true);

  // Enrollment analytics data
  const [courses, setCourses] = useState<CourseWebinarOption[]>([]);
  const [webinars, setWebinars] = useState<CourseWebinarOption[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiClient.getDashboardStats();
      if (response.data) {
        setStats(response.data as unknown as DashboardStats);
      }
    } catch {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

        // Initialize courses and webinars with empty enrollment data
        setCourses(
          data.courses.map((c) => ({
            id: c.id,
            name: c.name,
            enrollmentData: [],
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

  // Callback to fetch enrollment data for a specific item
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

  useEffect(() => {
    fetchStats();
    fetchPurchaseAnalytics();
    fetchItemsForAnalytics();
  }, [fetchPurchaseAnalytics, fetchItemsForAnalytics]);

  const formatCurrency = (amount: number) => {
    return Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };

  return (
    <div>
      <PageHeader
        title={pageText['dashboard_title']}
        description={pageText['dashboard_subtitle']}
        actionButton={
          <button
            onClick={async () => {
              setRefreshing(true);
              try {
                await Promise.all([
                  refreshAll(),
                  fetchStats(true),
                  fetchPurchaseAnalytics(),
                  fetchItemsForAnalytics(),
                ]);
              } finally {
                setRefreshing(false);
              }
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {loading ? (
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-200 rounded-full w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title={pageText['total_revenue']}
            value={formatCurrency(stats.revenue.total)}
            icon={DollarSign}
            description={`${stats.revenue.monthlyGrowth >= 0 ? '+' : ''}${stats.revenue.monthlyGrowth.toFixed(1)}% ${pageText['revenue_change']}`}
          />
          <Card
            title={pageText['active_students']}
            value={stats.students.active}
            icon={Users}
            description={`${stats.students.total} ${pageText['students_desc']}`}
          />
          <Card
            title={pageText['webinar_registrations']}
            value={stats.webinars?.registrations || 0}
            icon={Video}
            description={`${stats.webinars?.upcoming || 0} ${pageText['webinar_desc']}`}
          />
        </div>
      ) : null}

      <h2 className="text-xl font-bold text-slate-900 mb-4">{pageText['quick_actions']}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/superuser/courses/create">
          <button className="w-full p-6 min-h-25 bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl text-left font-semibold text-slate-800 hover:from-blue-100 hover:to-indigo-100 hover:border-vibrant-blue hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-vibrant-blue/10 p-2 rounded-lg group-hover:bg-vibrant-blue/20 transition-colors">
                <PlusCircle size={20} className="text-vibrant-blue" />
              </div>
              <span>{pageText['create_course']}</span>
            </div>
          </button>
        </Link>
        <Link href="/superuser/teachers/create">
          <button className="w-full p-6 min-h-25 bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl text-left font-semibold text-slate-800 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-500 hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <PlusCircle size={20} className="text-emerald-600" />
              </div>
              <span>{pageText['create_teacher']}</span>
            </div>
          </button>
        </Link>
        <Link href="/superuser/webinars/create">
          <button className="w-full p-6 min-h-25 bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl text-left font-semibold text-slate-800 hover:from-purple-100 hover:to-pink-100 hover:border-purple-500 hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Video size={20} className="text-purple-600" />
              </div>
              <span>{pageText['create_webinar']}</span>
            </div>
          </button>
        </Link>
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
    </div>
  );
}
