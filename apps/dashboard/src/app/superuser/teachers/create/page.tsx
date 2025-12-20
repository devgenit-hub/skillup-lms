'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Calendar, Smile, Frown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage';

export default function CreateTeacherPage() {
  const router = useRouter();
  const { t } = useLocale();
  const formText = t('forms');
  const buttonText = t('buttons');

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    qualification: '',
    experience: '',
    specialization: '',
    bio: '',
    profileImage: '',
    joiningDate: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);

      await apiClient.createTeacher({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        qualification: formData.qualification.trim(),
        experience: formData.experience,
        specialization: formData.specialization.trim(),
        bio: formData.bio.trim(),
        profileImage: formData.profileImage,
        joiningDate: formData.joiningDate,
      });

      toast.success('Teacher created successfully!');
      router.push('/superuser/teachers');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create teacher';

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
      <PageHeader
        title={formText['create_teacher_title']}
        description={formText['create_teacher_subtitle']}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
      >
        {/* Profile Image Section */}
        <ImageUpload
          value={formData.profileImage}
          onChange={(url: string) => setFormData((prev) => ({ ...prev, profileImage: url }))}
          bucket={STORAGE_BUCKETS.TEACHERS}
          label={formText['profile_picture']}
        />

        {/* Basic Information Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['basic_information']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['full_name']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['email_address']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['phone_number']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                  placeholder="+880 1234-567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['joining_date']}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-slate-400" />
                </div>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['address']}
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
                  placeholder={formText['full_address']}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Account Security Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['account_security']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['password']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                  placeholder={formText['password_placeholder']}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['confirm_password']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                  placeholder={formText['confirm_password_placeholder']}
                />
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500">{formText['password_requirement']}</p>
          {formData.password.length > 0 &&
            (formData.password.length > 8 ? (
              <p className="w-fit my-1 text-sm text-green-600 bg-green-100 p-2 rounded-md flex items-center gap-1">
                <Smile size={20} /> {formText['password_length_valid']}
              </p>
            ) : (
              <p className="w-fit my-1 text-sm text-red-600 bg-red-100 p-2 rounded-md flex items-center gap-1">
                <Frown size={20} /> {formText['password_length_invalid']}
              </p>
            ))}
          {formData.confirmPassword.length > 0 &&
            (formData.password === formData.confirmPassword ? (
              <p className="w-fit my-1 text-sm text-green-600 bg-green-100 p-2 rounded-md flex items-center gap-1">
                <Smile size={20} /> {formText['password_match']}
              </p>
            ) : (
              <p className="w-fit my-1 text-sm text-red-600 bg-red-100 p-2 rounded-md flex items-center gap-1">
                <Frown size={20} /> {formText['password_not_match']}
              </p>
            ))}
        </section>

        {/* Professional Information Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['professional_information']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div hidden>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['highest_qualification']}
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., PhD in Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['years_of_experience']}
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., 5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['specialization']} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., Web Development, Machine Learning, UI/UX Design"
              />
            </div>

            <div className="md:col-span-2" hidden>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['bio']}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
                placeholder={formText['bio_placeholder']}
              />
              <p className="mt-1 text-xs text-slate-500">{formText['bio_note']}</p>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push('/superuser/teachers')}
            disabled={loading}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
          >
            {buttonText['cancel']}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium disabled:opacity-50 flex items-center gap-2 min-w-40"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              formText['create_teacher_account']
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
