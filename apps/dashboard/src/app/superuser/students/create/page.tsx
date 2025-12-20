'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import { User, Mail, Lock, Phone, Loader2, Eye, EyeOff, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function CreateStudentPage() {
  const router = useRouter();
  const { t } = useLocale();
  const pageText = t('student_management');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatarUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    if (formData.avatarUrl && !/^https?:\/\/.+/.test(formData.avatarUrl)) {
      newErrors.avatarUrl = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      await apiClient.createStudent({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim() || undefined,
        avatarUrl: formData.avatarUrl.trim() || undefined,
      });

      toast.success('Student created successfully!');
      router.push('/superuser/students');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create student';

      if (
        errorMessage.includes('email address has already been registered') ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate')
      ) {
        toast.error('A user with this email already exists. Please use a different email address.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={pageText.create_modal_title} description={pageText.create_modal_desc} />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
      >
        {/* Profile Image Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Profile Picture
          </h2>

          <div className="flex items-center gap-6">
            <div className="shrink-0">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center">
                  <User size={48} className="text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error('File size exceeds 2MB. Please choose a smaller file.');
                      return;
                    }
                    const imageUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({
                      ...prev,
                      avatarUrl: imageUrl,
                    }));
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className="inline-flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg cursor-pointer hover:bg-dark-blue transition-colors"
              >
                <Upload size={18} />
                Upload Profile Picture
              </label>
              <p className="text-sm text-slate-500 mt-2">Recommended: Square image, max 2MB</p>

              {/* Alternative URL Input */}
              <div className="mt-4">
                <label
                  htmlFor="avatarUrl"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Or provide image URL
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue ${
                    errors.avatarUrl ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="https://example.com/avatar.jpg"
                />
                {errors.avatarUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.avatarUrl}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                {pageText.name_label}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue ${
                  errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                {pageText.email_label}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="student@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                {pageText.phone_label}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue ${
                  errors.phone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="+1234567890"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </section>

        {/* Account Security */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Account Security
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                {pageText.password_label}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue pr-12 ${
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                <Lock className="inline w-4 h-4 mr-1" />
                Confirm Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-vibrant-blue hover:bg-dark-blue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              pageText.create_student
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
