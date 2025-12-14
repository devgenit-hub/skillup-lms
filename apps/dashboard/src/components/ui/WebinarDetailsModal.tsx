'use client';

import { useState } from 'react';
import { X, Calendar as CalendarIcon, Link as LinkIcon, Check, Ban } from 'lucide-react';
import { WebinarProps } from '../props/WebinarProps';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

interface WebinarDetailsModalProps {
  webinar: WebinarProps;
  isOpen: boolean;
  onClose: () => void;
}

export default function WebinarDetailsModal({
  webinar,
  isOpen,
  onClose,
}: WebinarDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'live-link' | 'coupon' | 'edit'>('live-link');

  // Live Link form state
  const [liveLink, setLiveLink] = useState(webinar.liveLink || '');

  // Coupon form state
  const [couponTag, setCouponTag] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [discount, setDiscount] = useState('');

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: webinar.title,
    category: webinar.category,
    scheduleDateTime: webinar.scheduleDateTime,
    duration: webinar.duration.toString(),
    platform: webinar.platform,
    feeType: webinar.feeType,
    price: webinar.price?.toString() || '',
    sessionHighlights: webinar.sessionHighlights,
    aboutWebinar: webinar.aboutWebinar,
  });

  if (!isOpen) return null;

  const handleLiveLinkSubmit = () => {
    // Handle live link update logic here
    console.log({ liveLink });
    // In a real app, you would call an API to update the webinar
    alert(`Live link updated to: ${liveLink}`);
  };

  const handleDiscountChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 100)) {
      setDiscount(value);
    }
  };

  const handleCouponSubmit = () => {
    // Handle coupon creation logic here
    console.log({ couponTag, expiryDate, discount });
    // Reset form
    setCouponTag('');
    setExpiryDate(undefined);
    setDiscount('');
    setShowCalendar(false);
    alert('Coupon created successfully!');
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = () => {
    console.log('Updated webinar data:', editFormData);
    alert('Webinar updated successfully!');
    onClose();
  };

  const handleToggleStatus = () => {
    const newStatus = webinar.status === 'upcoming' ? 'draft' : 'upcoming';
    console.log(`Webinar status changed to: ${newStatus}`);
    alert(`Webinar ${newStatus === 'draft' ? 'deactivated' : 'activated'}!`);
  };

  // Edit Webinar Tab
  const EditWebinarTab = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Edit Webinar Details</h3>
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">
              Webinar Title
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={editFormData.title}
              onChange={handleEditInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
            />
          </div>

          {/* Category and Platform */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-category"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Category
              </label>
              <select
                id="edit-category"
                name="category"
                value={editFormData.category}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
              >
                <option value="">Select Category</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="edit-platform"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Platform
              </label>
              <select
                id="edit-platform"
                name="platform"
                value={editFormData.platform}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
              >
                <option value="">Select Platform</option>
                <option value="zoom">Zoom</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="edit-duration"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="edit-duration"
              name="duration"
              value={editFormData.duration}
              onChange={handleEditInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
            />
          </div>

          {/* Fee Type and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-feeType"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Fee Type
              </label>
              <select
                id="edit-feeType"
                name="feeType"
                value={editFormData.feeType}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            {editFormData.feeType === 'paid' && (
              <div>
                <label
                  htmlFor="edit-price"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="edit-price"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                  placeholder="Enter price"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
                />
              </div>
            )}
          </div>

          {/* Session Highlights */}
          <div>
            <label
              htmlFor="edit-highlights"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Session Highlights
            </label>
            <textarea
              id="edit-highlights"
              name="sessionHighlights"
              value={editFormData.sessionHighlights}
              onChange={handleEditInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
            />
          </div>

          {/* About Webinar */}
          <div>
            <label htmlFor="edit-about" className="block text-sm font-medium text-slate-700 mb-2">
              About Webinar
            </label>
            <textarea
              id="edit-about"
              name="aboutWebinar"
              value={editFormData.aboutWebinar}
              onChange={handleEditInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleEditSubmit}
              className="flex-1 bg-dark-blue hover:bg-vibrant-blue text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                webinar.status === 'upcoming' || webinar.status === 'live'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {webinar.status === 'upcoming' || webinar.status === 'live' ? (
                <>
                  <Ban size={18} />
                  Deactivate
                </>
              ) : (
                <>
                  <Check size={18} />
                  Activate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Live Link Tab
  const LiveLinkTab = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Update Live Session Link</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="liveLink" className="block text-sm font-medium text-slate-700 mb-2">
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
            disabled={!liveLink}
            className="w-full bg-dark-blue hover:bg-vibrant-blue text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Update Link
          </button>
        </div>
      </div>
    );
  };

  // Coupon Tab
  const CouponTab = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Create Webinar Coupon</h3>
        <div className="space-y-6">
          {/* Coupon Tag */}
          <div>
            <label htmlFor="couponTag" className="block text-sm font-medium text-slate-700 mb-2">
              Coupon Tag
            </label>
            <input
              type="text"
              id="couponTag"
              value={couponTag}
              onChange={(e) => setCouponTag(e.target.value.toUpperCase())}
              placeholder="e.g., WEBINAR20"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none text-left flex items-center justify-between bg-white hover:border-slate-400 transition-colors"
              >
                <span className={expiryDate ? 'text-slate-900' : 'text-slate-400'}>
                  {expiryDate
                    ? expiryDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Select expiry date'}
                </span>
                <CalendarIcon size={18} className="text-slate-400" />
              </button>
              {showCalendar && (
                <div className="absolute z-10 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                  <DayPicker
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => {
                      setExpiryDate(date);
                      setShowCalendar(false);
                    }}
                    disabled={{ before: new Date() }}
                    className="rdp-custom"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-slate-700 mb-2">
              Discount Percentage (1-100)
            </label>
            <div className="relative">
              <input
                type="number"
                id="discount"
                value={discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                min="1"
                max="100"
                placeholder="Enter discount percentage"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                %
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Enter a whole number between 1 and 100</p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCouponSubmit}
            disabled={!couponTag || !expiryDate || !discount}
            className="w-full bg-dark-blue hover:bg-vibrant-blue text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Create Coupon
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{webinar.title}</h2>
            <p className="text-sm text-slate-500 mt-1">Webinar ID: {webinar.id}</p>
            <p className="text-sm text-slate-500 mt-1">
              Registered Users: {webinar.registeredUsers ?? 0}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 mx-6">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'edit'
                  ? 'bg-dark-blue text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Edit Webinar
            </button>
            <button
              onClick={() => setActiveTab('live-link')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
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
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'coupon'
                    ? 'bg-dark-blue text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Coupon
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'edit' && <EditWebinarTab />}
          {activeTab === 'live-link' && <LiveLinkTab />}
          {activeTab === 'coupon' && webinar.feeType === 'paid' && <CouponTab />}
        </div>
      </div>
    </div>
  );
}
