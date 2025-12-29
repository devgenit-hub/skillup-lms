'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Video,
  Calendar,
  Users,
  PlusCircle,
  Search,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { WebinarProps } from '@/components/props/WebinarProps';
import WebinarDetailsModal from '@/components/ui/WebinarDetailsModal';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function WebinarsPage() {
  const { t } = useLocale();
  const pageText = t('superuser');
  const tableText = t('table');

  const [webinars, setWebinars] = useState<WebinarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchWebinars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getWebinars({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
      });

      // Response is { status, data: webinars[], pagination: {...} }
      const webinarsData = response.data as unknown as WebinarProps[];
      const paginationData = (response as unknown as { pagination?: typeof pagination }).pagination;

      // Transform _count.registrations to registeredUsers
      const transformedWebinars = (webinarsData || []).map(
        (webinar: WebinarProps & { _count?: { registrations: number } }) => ({
          ...webinar,
          registeredUsers: webinar._count?.registrations || 0,
        })
      );
      setWebinars(transformedWebinars);
      setPagination(
        paginationData || {
          page: currentPage,
          limit: 10,
          total: 0,
          totalPages: 1,
        }
      );
    } catch {
      toast.error('Failed to load webinars');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchWebinars();
  }, [fetchWebinars]);

  const handleWebinarClick = (webinar: WebinarProps) => {
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWebinar(null);
  };

  const handleWebinarUpdated = () => {
    fetchWebinars();
  };

  const handleWebinarDeleted = () => {
    setIsModalOpen(false);
    setSelectedWebinar(null);
    fetchWebinars();
  };

  const handleTogglePublish = async (webinar: WebinarProps, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = webinar.status === 'upcoming' ? 'draft' : 'upcoming';

    try {
      setTogglingStatus(webinar.id);
      await apiClient.updateWebinar(webinar.id, { status: newStatus });
      toast.success(`Webinar ${newStatus === 'draft' ? 'unpublished' : 'published'}!`);
      fetchWebinars();
    } catch {
      toast.error('Failed to update webinar status');
    } finally {
      setTogglingStatus(null);
    }
  };

  const handleDeleteWebinar = async (webinar: WebinarProps, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this webinar? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(webinar.id);
      await apiClient.deleteWebinar(webinar.id);
      toast.success('Webinar deleted successfully!');
      fetchWebinars();
    } catch {
      toast.error('Failed to delete webinar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (webinar: WebinarProps, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
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

  const filteredWebinars = searchQuery
    ? webinars.filter((webinar) => webinar.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : webinars;

  const totalRegistrations = webinars.reduce((acc, w) => acc + (w.registeredUsers || 0), 0);
  const upcomingCount = webinars.filter((w) => w.status === 'upcoming').length;

  return (
    <div>
      <PageHeader
        title={pageText['webinar_title']}
        description={pageText['webinar_subtitle']}
        actionButton={
          <Link href="/superuser/webinars/create">
            <button className="bg-dark-blue hover:bg-vibrant-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer">
              <PlusCircle size={18} />
              {pageText['create_webinar']}
            </button>
          </Link>
        }
      />

      {/* Stats Overview */}
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
                  <div className="h-6 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{pageText['total_webinars']}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{pagination.total}</p>
              </div>
              <div className="bg-vibrant-blue/10 p-3 rounded-lg">
                <Video size={24} className="text-vibrant-blue" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{pageText['upcoming']}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{upcomingCount}</p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <Calendar size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  {pageText['total_registrations']}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalRegistrations}</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <Users size={24} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText['webinar']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText['category']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText['schedule']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText['platform']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText['registrations']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText['fee_type']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Fee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {tableText['status']}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12">
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin text-vibrant-blue" size={40} />
                    </div>
                  </td>
                </tr>
              ) : filteredWebinars.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12">
                    <div className="text-center">
                      <Video size={48} className="mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-600 mb-2">No webinars available</p>
                      <p className="text-sm text-slate-500">
                        Get started by creating your first webinar
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWebinars.map((webinar) => (
                  <tr
                    key={webinar.id}
                    onClick={() => handleWebinarClick(webinar)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{webinar.title}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                        {webinar.category?.title || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(webinar.scheduleDateTime).toLocaleString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                        {getPlatformIcon(webinar.platform)}
                        <span className="capitalize">{webinar.platform}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{webinar.registeredUsers}</td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {webinar.feeType === 'paid' && webinar.price ? (
                        <span className="font-medium text-slate-900">৳{webinar.price}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          webinar.status
                        )}`}
                      >
                        {webinar.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Edit */}
                        <button
                          onClick={(e) => handleEditClick(webinar, e)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View details"
                        >
                          <Pencil size={16} />
                        </button>
                        {/* Publish/Unpublish */}
                        <button
                          onClick={(e) => handleTogglePublish(webinar, e)}
                          disabled={togglingStatus === webinar.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            webinar.status === 'upcoming'
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          } disabled:opacity-50`}
                          title={webinar.status === 'upcoming' ? 'Unpublish' : 'Publish'}
                        >
                          {togglingStatus === webinar.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : webinar.status === 'upcoming' ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => handleDeleteWebinar(webinar, e)}
                          disabled={deletingId === webinar.id}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                          title="Delete webinar"
                        >
                          {deletingId === webinar.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
              webinars
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedWebinar && (
        <WebinarDetailsModal
          webinar={selectedWebinar}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onWebinarUpdated={handleWebinarUpdated}
          onWebinarDeleted={handleWebinarDeleted}
        />
      )}
    </div>
  );
}
