'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Video, Calendar, Users, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { WebinarProps } from '@/components/props/WebinarProps';
import WebinarDetailsModal from '@/components/ui/WebinarDetailsModal';
import { useLocale } from '@/providers/locale-provider';

export default function WebinarsPage() {
  const { t } = useLocale();
  const pageText = t('superuser');
  const tableText = t('table');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data - replace with actual data from API
  const webinars: WebinarProps[] = [
    {
      id: '1',
      title: 'Modern JavaScript Techniques',
      category: 'frontend',
      image: '/test_images/webinar1.jpg',
      scheduleDateTime: '2025-01-15T10:00:00',
      duration: 60,
      feeType: 'free',
      platform: 'zoom',
      status: 'upcoming',
      registeredUsers: 45,
      sessionHighlights: '- ES6+ Features\n- Async/Await\n- Modules',
      aboutWebinar: 'Learn the latest in JS.',
      speakers: [],
      sessionAgenda: [],
      resources: [],
      liveLink: 'https://zoom.us/j/123456789',
    },
    {
      id: '2',
      title: 'Building Scalable APIs',
      category: 'backend',
      image: '/test_images/webinar2.jpg',
      scheduleDateTime: '2025-01-20T14:00:00',
      duration: 90,
      feeType: 'paid',
      price: 49.99,
      platform: 'youtube',
      status: 'upcoming',
      registeredUsers: 78,
      sessionHighlights: '- REST vs GraphQL\n- Database Design\n- Caching',
      aboutWebinar: 'Master API development.',
      speakers: [],
      sessionAgenda: [],
      resources: [],
    },
  ];

  const handleWebinarClick = (webinar: WebinarProps) => {
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWebinar(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'live':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-slate-100 text-slate-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return '🎥';
      case 'facebook':
        return '📘';
      case 'youtube':
        return '▶️';
      default:
        return '🎥';
    }
  };

  const filteredWebinars = webinars.filter((webinar) =>
    webinar.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title={pageText['webinar_title']} description={pageText['webinar_subtitle']} />
        <Link
          href="/superuser/webinars/create"
          className="flex items-center gap-2 px-6 py-3 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium"
        >
          <PlusCircle size={20} />
          {pageText['create_webinar']}
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
              <Video size={24} className="text-vibrant-blue" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{pageText['total_webinars']}</p>
              <p className="text-2xl font-bold text-slate-900">{webinars.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
              <Calendar size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{pageText['upcoming']}</p>
              <p className="text-2xl font-bold text-slate-900">
                {webinars.filter((w) => w.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center">
              <Users size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{pageText['total_registrations']}</p>
              <p className="text-2xl font-bold text-slate-900">
                {webinars.reduce((acc, w) => acc + (w.registeredUsers || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={pageText['search_webinars']}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Webinars List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{pageText['all_webinars']}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {pageText['webinar']}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {pageText['category']}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {pageText['schedule']}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {pageText['platform']}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {pageText['registrations']}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {pageText['fee_type']}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {tableText['status']}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWebinars.map((webinar) => (
                <tr
                  key={webinar.id}
                  onClick={() => handleWebinarClick(webinar)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{webinar.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                      {webinar.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(webinar.scheduleDateTime).toLocaleString('bn-BD', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                      {getPlatformIcon(webinar.platform)}
                      <span className="capitalize">{webinar.platform}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{webinar.registeredUsers}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        webinar.feeType === 'free'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {webinar.feeType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        webinar.status
                      )}`}
                    >
                      {webinar.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredWebinars.length === 0 && webinars.length > 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No webinars found matching &ldquo;{searchQuery}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {webinars.length === 0 && (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-4">No webinars found</p>
            <Link
              href="/superuser/webinars/create"
              className="inline-flex items-center gap-2 px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors font-medium"
            >
              <PlusCircle size={18} />
              Create Your First Webinar
            </Link>
          </div>
        )}
      </div>

      {selectedWebinar && (
        <WebinarDetailsModal
          webinar={selectedWebinar}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
