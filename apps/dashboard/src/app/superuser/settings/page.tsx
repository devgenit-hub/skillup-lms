'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { t } = useLocale();
  const pageText = t('superuser');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 8 characters long',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New password and confirmation do not match',
      });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: 'error',
        text: 'New password must be different from current password',
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.changePassword(currentPassword, newPassword);

      setMessage({
        type: 'success',
        text: 'Password changed successfully!',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      toast.success('Password changed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={pageText['settings_title']} description={pageText['settings_subtitle']} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-vibrant-blue/10 rounded-lg">
                <Lock className="text-vibrant-blue" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{pageText['change_password']}</h2>
                <p className="text-sm text-slate-500">{pageText['settings_subtitle']}</p>
              </div>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="text-green-600  shrink-0" size={20} />
                ) : (
                  <AlertCircle className="text-red-600 shrink-0" size={20} />
                )}
                <p
                  className={`text-sm font-medium ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {pageText['current_password']}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-vibrant-blue focus:border-vibrant-blue focus:outline-none transition-all"
                    placeholder={pageText['current_password']}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {pageText['new_password']}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-vibrant-blue focus:border-vibrant-blue focus:outline-none transition-all"
                    placeholder={pageText['new_password']}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">{pageText['password_requirements']}</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {pageText['confirm_password']}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-vibrant-blue focus:border-vibrant-blue focus:outline-none transition-all"
                    placeholder={pageText['confirm_password']}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-dark-blue hover:bg-vibrant-blue text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? pageText['updating'] : pageText['update_password']}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 sticky top-8">
            <h3 className="font-semibold text-slate-900 mb-3">Password Security Tips</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use a unique password that you don{"'"}t use elsewhere</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Include a mix of uppercase, lowercase, numbers, and symbols</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Avoid using personal information in your password</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Change your password regularly for better security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
