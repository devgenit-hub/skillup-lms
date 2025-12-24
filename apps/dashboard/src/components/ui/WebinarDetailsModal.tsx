'use client';

import { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { WebinarProps } from '../props/WebinarProps';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { CouponTab, type Coupon } from '../superuser/courses';
import { useRouter } from 'next/navigation';

interface WebinarDetailsModalProps {
  webinar: WebinarProps;
  isOpen: boolean;
  onClose: () => void;
  onWebinarUpdated?: () => void;
  onWebinarDeleted?: (webinarId: string) => void;
}

export default function WebinarDetailsModal({
  webinar,
  isOpen,
  onClose,
  onWebinarUpdated,
  onWebinarDeleted,
}: WebinarDetailsModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'live-link' | 'coupon'>('live-link');
  const [isSaving, setIsSaving] = useState(false);
  const [_isDeleting, _setIsDeleting] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [webinarStatus, setWebinarStatus] = useState(webinar.status);

  // Live Link form state
  const [liveLink, setLiveLink] = useState(webinar.liveLink || '');

  // Coupon form state
  const [couponTag, setCouponTag] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [discount, setDiscount] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [isTogglingCoupon, setIsTogglingCoupon] = useState<string | null>(null);
  const [isDeletingCoupon, setIsDeletingCoupon] = useState<string | null>(null);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Load coupons when coupon tab is active
  useEffect(() => {
    if (activeTab === 'coupon' && isOpen && webinar.feeType === 'paid') {
      const loadCoupons = async () => {
        setIsLoadingCoupons(true);
        try {
          const response = await apiClient.getWebinarCoupons(webinar.id);
          if (response.data && Array.isArray(response.data)) {
            setCoupons(response.data as Coupon[]);
          }
        } catch {
          setCoupons([]);
        } finally {
          setIsLoadingCoupons(false);
        }
      };
      loadCoupons();
    }
  }, [activeTab, isOpen, webinar.id, webinar.feeType]);

  if (!isOpen) return null;

  const handleLiveLinkSubmit = async () => {
    try {
      setIsSaving(true);
      await apiClient.updateWebinar(webinar.id, { liveLink });
      toast.success('Live link updated successfully!');
      onWebinarUpdated?.();
    } catch {
      toast.error('Failed to update live link');
    } finally {
      setIsSaving(false);
    }
  };

  const _handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this webinar? This action cannot be undone.')) {
      return;
    }

    try {
      _setIsDeleting(true);
      await apiClient.deleteWebinar(webinar.id);
      toast.success('Webinar deleted successfully!');
      onWebinarDeleted?.(webinar.id);
      onClose();
    } catch {
      toast.error('Failed to delete webinar');
    } finally {
      _setIsDeleting(false);
    }
  };

  const handleDiscountChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 100)) {
      setDiscount(value);
    }
  };

  const handleCouponSubmit = async () => {
    if (!couponTag || !expiryDate || !discount) return;

    try {
      setIsCreatingCoupon(true);

      if (editingCouponId) {
        // Update existing coupon
        await apiClient.updateWebinarCoupon(webinar.id, editingCouponId, {
          code: couponTag,
          title: couponTitle || undefined,
          discount: parseInt(discount),
          expiresAt: expiryDate.toISOString(),
        });
        toast.success('Coupon updated successfully!');
        setEditingCouponId(null);
      } else {
        // Create new coupon
        await apiClient.createWebinarCoupon(webinar.id, {
          code: couponTag,
          title: couponTitle || undefined,
          discount: parseInt(discount),
          expiresAt: expiryDate.toISOString(),
        });
        toast.success('Coupon created successfully!');
      }

      // Refresh coupons
      const response = await apiClient.getWebinarCoupons(webinar.id);
      if (response.data && Array.isArray(response.data)) {
        setCoupons(response.data as Coupon[]);
      }

      // Reset form
      setCouponTag('');
      setCouponTitle('');
      setExpiryDate(undefined);
      setDiscount('');
      setShowCalendar(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save coupon';
      toast.error(errorMessage);
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (couponId: string) => {
    try {
      setIsTogglingCoupon(couponId);
      await apiClient.toggleWebinarCoupon(webinar.id, couponId);

      // Refresh coupons
      const response = await apiClient.getWebinarCoupons(webinar.id);
      if (response.data && Array.isArray(response.data)) {
        setCoupons(response.data as Coupon[]);
      }
      toast.success('Coupon status updated!');
    } catch {
      toast.error('Failed to toggle coupon');
    } finally {
      setIsTogglingCoupon(null);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      setIsDeletingCoupon(couponId);
      await apiClient.deleteWebinarCoupon(webinar.id, couponId);

      // Refresh coupons
      const response = await apiClient.getWebinarCoupons(webinar.id);
      if (response.data && Array.isArray(response.data)) {
        setCoupons(response.data as Coupon[]);
      }
      toast.success('Coupon deleted successfully!');
    } catch {
      toast.error('Failed to delete coupon');
    } finally {
      setIsDeletingCoupon(null);
    }
  };

  const handleEditCoupon = (coupon: {
    id: string;
    code: string;
    title?: string | null;
    discount: number;
    expiresAt: string;
  }) => {
    setEditingCouponId(coupon.id);
    setCouponTag(coupon.code);
    setCouponTitle(coupon.title || '');
    setDiscount(coupon.discount.toString());
    setExpiryDate(new Date(coupon.expiresAt));
  };

  const handleCancelEdit = () => {
    setEditingCouponId(null);
    setCouponTag('');
    setCouponTitle('');
    setDiscount('');
    setExpiryDate(undefined);
  };

  const handleTogglePublish = async () => {
    if (isTogglingPublish) return;
    try {
      setIsTogglingPublish(true);
      const newStatus = webinarStatus === 'upcoming' ? 'draft' : 'upcoming';
      await apiClient.updateWebinar(webinar.id, { status: newStatus });
      setWebinarStatus(newStatus);
      toast.success(newStatus === 'upcoming' ? 'Webinar published!' : 'Webinar unpublished!');
      onWebinarUpdated?.();
    } catch {
      toast.error('Failed to update webinar status. Please try again.');
    } finally {
      setIsTogglingPublish(false);
    }
  };

  const handleEditWebinar = () => {
    router.push(`/superuser/webinars/edit/${webinar.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header - Two rows like course modal */}
        <div className="border-b border-slate-200">
          {/* Top row: Title and Close */}
          <div className="flex items-start justify-between p-6 pb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 truncate max-w-full pr-4">
                {webinar.title}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                <span className="truncate max-w-50" title={webinar.id}>
                  ID: {webinar.id}
                </span>
                <span className="shrink-0">Registered: {webinar.registeredUsers ?? 0}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors ml-4 shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Bottom row: Tab buttons and Publish/Unpublish */}
          <div className="flex items-center gap-2 px-6 pb-3 overflow-x-auto">
            <button
              onClick={handleEditWebinar}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Edit Webinar
            </button>
            <button
              onClick={() => setActiveTab('live-link')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'live-link'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Live Link
            </button>
            {webinar.feeType === 'paid' && (
              <button
                onClick={() => setActiveTab('coupon')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  activeTab === 'coupon'
                    ? 'bg-dark-blue text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Coupon
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={handleTogglePublish}
              disabled={isTogglingPublish}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shrink-0 ${
                webinarStatus === 'upcoming'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isTogglingPublish ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              {webinarStatus === 'upcoming' ? 'Published' : 'Unpublish'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'live-link' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Update Live Session Link
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="liveLink"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Live Webinar Link
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="liveLink"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
                    />
                    <LinkIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the URL where students can join the live session.
                  </p>
                </div>

                <button
                  onClick={handleLiveLinkSubmit}
                  disabled={!liveLink || isSaving}
                  className="w-full bg-dark-blue hover:bg-vibrant-blue text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Updating...' : 'Update Link'}
                </button>
              </div>
            </div>
          )}
          {activeTab === 'coupon' && webinar.feeType === 'paid' && (
            <CouponTab
              couponTag={couponTag}
              setCouponTag={setCouponTag}
              couponTitle={couponTitle}
              setCouponTitle={setCouponTitle}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              discount={discount}
              onDiscountChange={handleDiscountChange}
              onSubmit={handleCouponSubmit}
              isSubmitting={isCreatingCoupon}
              coupons={coupons}
              isLoadingCoupons={isLoadingCoupons}
              onToggleCoupon={handleToggleCoupon}
              onDeleteCoupon={handleDeleteCoupon}
              onEditCoupon={handleEditCoupon}
              onCancelEdit={handleCancelEdit}
              isTogglingCoupon={isTogglingCoupon}
              isDeletingCoupon={isDeletingCoupon}
              editingCouponId={editingCouponId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
