'use client';

import {
  Calendar as CalendarIcon,
  Tag,
  Loader2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Pencil,
  X,
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { Coupon } from './types';

interface CouponTabProps {
  couponTag: string;
  setCouponTag: (value: string) => void;
  couponTitle: string;
  setCouponTitle: (value: string) => void;
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  discount: string;
  onDiscountChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  coupons: Coupon[];
  isLoadingCoupons: boolean;
  onToggleCoupon?: (couponId: string) => void;
  onDeleteCoupon?: (couponId: string) => void;
  onEditCoupon?: (coupon: {
    id: string;
    code: string;
    title?: string | null;
    discount: number;
    expiresAt: string;
  }) => void;
  onCancelEdit?: () => void;
  isTogglingCoupon?: string | null;
  isDeletingCoupon?: string | null;
  editingCouponId?: string | null;
}

export function CouponTab({
  couponTag,
  setCouponTag,
  couponTitle,
  setCouponTitle,
  expiryDate,
  setExpiryDate,
  showCalendar,
  setShowCalendar,
  discount,
  onDiscountChange,
  onSubmit,
  isSubmitting,
  coupons,
  isLoadingCoupons,
  onToggleCoupon,
  onDeleteCoupon,
  onEditCoupon,
  onCancelEdit,
  isTogglingCoupon,
  isDeletingCoupon,
  editingCouponId,
}: CouponTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create/Edit Coupon Form */}
      <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag size={20} className="text-purple-600" />
            {editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}
          </h3>
          {editingCouponId && (
            <button
              onClick={onCancelEdit}
              className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors cursor-pointer"
              title="Cancel editing"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={couponTag}
              onChange={(e) => setCouponTag(e.target.value.toUpperCase())}
              placeholder="e.g., SUMMER2024"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={couponTitle}
              onChange={(e) => setCouponTitle(e.target.value)}
              placeholder="e.g., Summer Sale Discount"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Discount (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value)}
              placeholder="Enter discount percentage (1-100)"
              min="1"
              max="100"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-left flex items-center justify-between cursor-pointer"
            >
              <span className={expiryDate ? 'text-slate-900' : 'text-slate-400'}>
                {expiryDate ? expiryDate.toLocaleDateString() : 'Select a date'}
              </span>
              <CalendarIcon size={18} className="text-slate-400" />
            </button>
            {showCalendar && (
              <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-4">
                <DayPicker
                  mode="single"
                  selected={expiryDate}
                  onSelect={(date) => {
                    setExpiryDate(date);
                    setShowCalendar(false);
                  }}
                  disabled={{ before: new Date() }}
                  className="font-sans!"
                />
              </div>
            )}
          </div>

          <button
            onClick={onSubmit}
            disabled={!couponTag || !expiryDate || !discount || isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {editingCouponId ? 'Updating...' : 'Creating...'}
              </>
            ) : editingCouponId ? (
              'Update Coupon'
            ) : (
              'Create Coupon'
            )}
          </button>
        </div>
      </div>

      {/* Active Coupons List */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Coupons</h3>
        {isLoadingCoupons ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {coupons.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No coupons created yet</p>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    editingCouponId === coupon.id
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900">{coupon.code}</p>
                    {coupon.title && <p className="text-sm text-slate-700">{coupon.title}</p>}
                    <p className="text-sm text-slate-500">
                      {coupon.discount}% off • Expires:{' '}
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      Used: {coupon.usageCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : ''} times
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {/* Toggle Active/Inactive Button */}
                    <button
                      onClick={() => onToggleCoupon?.(coupon.id)}
                      disabled={isTogglingCoupon === coupon.id}
                      className={`px-3 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 text-sm font-medium ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                    >
                      {isTogglingCoupon === coupon.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : coupon.isActive ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                      <span className="hidden sm:inline">
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() =>
                        onEditCoupon?.({
                          id: coupon.id,
                          code: coupon.code,
                          title: coupon.title,
                          discount: coupon.discount,
                          expiresAt: coupon.expiresAt,
                        })
                      }
                      disabled={editingCouponId === coupon.id}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Edit coupon"
                    >
                      <Pencil size={18} />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon "${coupon.code}"?`)) {
                          onDeleteCoupon?.(coupon.id);
                        }
                      }}
                      disabled={isDeletingCoupon === coupon.id}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Delete coupon"
                    >
                      {isDeletingCoupon === coupon.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
