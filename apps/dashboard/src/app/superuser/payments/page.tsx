'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import {
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Gift,
  DollarSign,
  Trash2,
  Video,
  BookOpen,
  ChartLine,
} from 'lucide-react';
import { toast } from 'sonner';
import { PaginationControls } from '@/components/utils';
import { useCourseStore } from '@/lib/zustand/course-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RevenueDashboard from '@/components/Revenue/RevenueDashboard';

interface Webinar {
  id: string;
  title: string;
}

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

interface Stats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  freeEnrollments: number;
  totalRevenue: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const { courses } = useCourseStore();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
    freeEnrollments: 0,
    totalRevenue: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteAdminPassword, setDeleteAdminPassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch webinars for filter dropdown
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await apiClient.getWebinars({ limit: 100 });
        if (response.data) {
          const webinarsData = response.data as unknown as Webinar[];
          setWebinars(webinarsData);
        }
      } catch (error) {
        console.error('Failed to fetch webinars:', error);
      }
    };
    fetchWebinars();
  }, []);

  // Parse selected item to get courseId or webinarId
  const getFilterParams = useCallback(() => {
    if (selectedItemId === 'all') {
      return { courseId: undefined, webinarId: undefined };
    }
    if (selectedItemId.startsWith('course:')) {
      return { courseId: selectedItemId.replace('course:', ''), webinarId: undefined };
    }
    if (selectedItemId.startsWith('webinar:')) {
      return { courseId: undefined, webinarId: selectedItemId.replace('webinar:', '') };
    }
    return { courseId: undefined, webinarId: undefined };
  }, [selectedItemId]);

  const fetchPayments = useCallback(async () => {
    try {
      setSearching(true);
      const { courseId, webinarId } = getFilterParams();
      const response = await apiClient.getAdminPayments({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: selectedStatus as 'all' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'FREE',
        courseId,
        webinarId,
      });

      if (response.data) {
        const data = response as unknown as {
          data: Payment[];
          stats: Stats;
          pagination: PaginationData;
        };
        setPayments(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedStatus, getFilterParams]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedItemId, selectedStatus]);

  const handleRefundClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundReason('');
    setRefundAmount(payment.amount.toString());
    setAdminPassword('');
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (!selectedPayment || !refundReason.trim() || !adminPassword.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid refund amount');
      return;
    }

    if (amount > selectedPayment.amount) {
      toast.error('Refund amount cannot exceed the payment amount');
      return;
    }

    setRefundLoading(true);
    try {
      await apiClient.adminRefundPayment({
        paymentId: selectedPayment.id,
        reason: refundReason,
        adminPassword: adminPassword,
        refundAmount: amount,
      });
      toast.success(`Refund of ৳${amount.toLocaleString()} processed successfully`);
      setRefundModalOpen(false);
      fetchPayments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process refund');
    } finally {
      setRefundLoading(false);
    }
  };

  const handleDeleteClick = (payment: Payment) => {
    setDeletePayment(payment);
    setDeleteReason('');
    setDeleteAdminPassword('');
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePayment || !deleteReason.trim() || !deleteAdminPassword.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setDeleteLoading(true);
    try {
      await apiClient.adminDeletePayment({
        paymentId: deletePayment.id,
        reason: deleteReason,
        adminPassword: deleteAdminPassword,
      });
      toast.success('Payment record deleted successfully');
      setDeleteModalOpen(false);
      fetchPayments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete payment');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string, amount: number) => {
    if (status === 'COMPLETED' && amount === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <Gift size={12} /> Free
        </span>
      );
    }
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
      COMPLETED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
      FAILED: { color: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
      REFUNDED: { color: 'bg-gray-100 text-gray-700', icon: <RotateCcw size={12} /> },
      CANCELLED: { color: 'bg-slate-100 text-slate-700', icon: <XCircle size={12} /> },
    };
    const configEntry = config[status] || config.PENDING;
    const { color, icon } = configEntry as { color: string; icon: React.ReactNode };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {icon} {status}
      </span>
    );
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Payments & Enrollments"
        description="Manage all payment transactions and enrollments"
      />

      <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ৳{stats.totalRevenue.toLocaleString()}
              </p>
              <button
                className="inline-flex items-center gap-2 text-sm rounded-full px-3 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors mt-2"
                onClick={() => setShowGraph((p) => !p)}
              >
                Show Graph <ChartLine size={16} />
              </button>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <DollarSign size={22} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <CheckCircle size={22} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Free Enrollments</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.freeEnrollments}</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Gift size={22} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Refunded</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.refunded}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg">
              <RotateCcw size={22} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {showGraph && (
        <div>
          <RevenueDashboard paymentList={payments} handleState={() => setShowGraph(false)} />
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          {searching ? (
            <Loader2
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin"
              size={20}
            />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          )}
          <input
            type="text"
            placeholder="Search by name, email, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-blue/30 focus:border-vibrant-blue"
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue placeholder="Filter by course/webinar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>

            {courses.length > 0 && (
              <>
                <SelectSeparator className="my-2" />
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-xs text-slate-500 font-semibold px-2 py-1.5">
                    <BookOpen size={14} />
                    Courses
                  </SelectLabel>
                  {courses.map((course) => (
                    <SelectItem key={`course:${course.id}`} value={`course:${course.id}`}>
                      <span className="flex items-center gap-2">{course.title}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </>
            )}

            {webinars.length > 0 && (
              <>
                <SelectSeparator className="my-2" />
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-xs text-slate-500 font-semibold px-2 py-1.5">
                    <Video size={14} />
                    Webinars
                  </SelectLabel>
                  {webinars.map((webinar) => (
                    <SelectItem key={`webinar:${webinar.id}`} value={`webinar:${webinar.id}`}>
                      <span className="flex items-center gap-2">{webinar.title}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Item</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Transaction ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vibrant-blue/10 flex items-center justify-center overflow-hidden">
                          {payment.user.avatarUrl ? (
                            <Image
                              src={payment.user.avatarUrl}
                              alt={payment.user.name || ''}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-vibrant-blue font-semibold text-sm">
                              {(payment.user?.name ||
                                payment.user?.email ||
                                'U')[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {payment.user.name || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-500">{payment.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-900 text-sm max-w-48 truncate">
                          {payment.course?.title || payment.webinar?.title || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {payment.course ? 'Course' : payment.webinar ? 'Webinar' : 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-semibold ${payment.amount === 0 ? 'text-purple-600' : 'text-slate-900'}`}
                      >
                        {payment.amount === 0 ? 'Free' : `৳${payment.amount.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600 font-mono">
                        {payment.gatewayTransactionId || payment.transactionId || '----'}
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(payment.status, payment.amount)}</td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">
                        {formatDate(payment.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(payment)}
                          className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {payment.status === 'COMPLETED' && payment.amount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefundClick(payment)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Refund
                          </Button>
                        )}
                        {payment.status === 'REFUNDED' && (
                          <span className="text-xs text-slate-500">
                            Refunded: ৳{payment.refundAmount?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </div>
      )}

      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPayment && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">User:</span>{' '}
                  {selectedPayment.user.name || selectedPayment.user.email}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Original Amount:</span> ৳
                  {selectedPayment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Item:</span>{' '}
                  {selectedPayment.course?.title || selectedPayment.webinar?.title}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Refund Amount (৳)
              </label>
              <Input
                type="number"
                placeholder="Enter refund amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                min={1}
                max={selectedPayment?.amount || undefined}
                step="0.01"
              />
              <p className="text-xs text-slate-500 mt-1">
                Max: ৳{selectedPayment?.amount.toLocaleString() || 0} (full refund)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Refund Reason</label>
              <Textarea
                placeholder="Enter reason for refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="min-h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admin Password
              </label>
              <Input
                type="password"
                placeholder="Enter your admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Required for security verification</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundModalOpen(false)}
              disabled={refundLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRefundConfirm}
              disabled={
                refundLoading || !refundReason.trim() || !adminPassword.trim() || !refundAmount
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {refundLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Refund ৳${parseFloat(refundAmount || '0').toLocaleString()}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Payment Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {deletePayment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ This action cannot be undone
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">User:</span>{' '}
                  {deletePayment.user.name || deletePayment.user.email}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Amount:</span> ৳
                  {deletePayment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Item:</span>{' '}
                  {deletePayment.course?.title || deletePayment.webinar?.title}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Status:</span> {deletePayment.status}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason for Deletion
              </label>
              <Textarea
                placeholder="Enter reason for deleting this payment record..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="min-h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admin Password
              </label>
              <Input
                type="password"
                placeholder="Enter your admin password"
                value={deleteAdminPassword}
                onChange={(e) => setDeleteAdminPassword(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Required for security verification</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteLoading || !deleteReason.trim() || !deleteAdminPassword.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
