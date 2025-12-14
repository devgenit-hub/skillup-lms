'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { stats } from '@/lib/dummy-data';
import { DollarSign, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';

export default function SuperuserDashboard() {
  const { t } = useLocale();
  const pageText = t('superuser');

  return (
    <div>
      <PageHeader
        title={pageText['dashboard_title']}
        description={pageText['dashboard_subtitle']}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title={pageText['total_revenue']}
          value={`${Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
          }).format(stats.totalRevenue)}`}
          icon={DollarSign}
          description={pageText['revenue_change']}
        />
        <Card
          title={pageText['active_students']}
          value={stats.activeStudents}
          icon={Users}
          description={pageText['students_desc']}
        />
        <Card
          title={pageText['webinar_registrations']}
          value={stats.webinarRegistrations}
          icon={Video}
          description={pageText['webinar_desc']}
        />
      </div>

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
