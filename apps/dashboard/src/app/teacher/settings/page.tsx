'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useEffect } from 'react';
import { Upload, User, Phone, MapPin, Calendar, Loader2, Save } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface Teacher {
  id: string;
  supabaseId: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  qualification: string | null;
  experience: number | null;
  specialization: string | null;
  bio: string | null;
  profileImage: string | null;
  joiningDate: string | null;
}

export default function TeacherSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingTeacher, setFetchingTeacher] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    qualification: '',
    experience: '',
    specialization: '',
    bio: '',
    profileImage: '',
    joiningDate: '',
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setFetchingTeacher(true);
        const response = await apiClient.getCurrentTeacher();
        const teacher = response.data as Teacher;

        setFormData({
          name: teacher.name || '',
          phone: teacher.phone || '',
          address: teacher.address || '',
          qualification: teacher.qualification || '',
          experience: teacher.experience?.toString() || '',
          specialization: teacher.specialization || '',
          bio: teacher.bio || '',
          profileImage: teacher.profileImage || '',
          joiningDate: (teacher.joiningDate ? teacher.joiningDate.split('T')[0] : '') as string,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        toast.error(errorMessage);
      } finally {
        setFetchingTeacher(false);
      }
    };

    fetchTeacher();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await apiClient.updateCurrentTeacher({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        qualification: formData.qualification.trim(),
        experience: formData.experience,
        specialization: formData.specialization.trim(),
        bio: formData.bio.trim(),
        joiningDate: formData.joiningDate,
        profileImage: formData.profileImage,
      });

      toast.success('Profile updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTeacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profile Settings"
        description="Update your personal information and profile details."
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
      >
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Profile Picture
          </h2>

          <div className="flex items-center gap-6">
            <div className="shrink-0">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
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
                      profileImage: imageUrl,
                    }));
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors"
              >
                <Upload size={18} />
                Upload Picture
              </label>
              <p className="text-sm text-slate-500 mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  placeholder="+880 1234-567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Joining Date
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                placeholder="e.g., 5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-vertical"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Professional Information
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Highest Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                placeholder="e.g., PhD in Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                placeholder="e.g., Web Development, Machine Learning, UI/UX Design"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-vertical"
                placeholder="Tell students about yourself, your teaching philosophy, and expertise..."
              />
              <p className="mt-1 text-xs text-slate-500">
                This will be visible to students on your profile.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200">
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <strong>Note:</strong> Email address and password can only be changed by the
            administrator. Please contact support if you need to update these details.
          </p>
          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2 min-w-40"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
