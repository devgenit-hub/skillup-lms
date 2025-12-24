'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DollarSign, Users, Video, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

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

export default function SuperuserDashboard() {
  const { t } = useLocale();
  const pageText = t('superuser');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title={pageText['dashboard_title']}
          description={pageText['dashboard_subtitle']}
        />
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <button className="w-full p-4 bg-white border border-slate-200 rounded-lg text-left font-medium text-slate-700 hover:border-vibrant-blue hover:text-vibrant-blue transition-colors">
            {pageText['create_course']}
          </button>
        </Link>
        <Link href="/superuser/teachers/create">
          <button className="w-full p-4 bg-white border border-slate-200 rounded-lg text-left font-medium text-slate-700 hover:border-vibrant-blue hover:text-vibrant-blue transition-colors">
            {pageText['create_teacher']}
          </button>
        </Link>
        <Link href="/superuser/webinars/create">
          <button className="w-full p-4 bg-white border border-slate-200 rounded-lg text-left font-medium text-slate-700 hover:border-vibrant-blue hover:text-vibrant-blue transition-colors">
            {pageText['create_webinar']}
          </button>
        </Link>
      </div>
    </div>
  );
}
