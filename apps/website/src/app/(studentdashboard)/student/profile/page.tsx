'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit, Camera, Lock, User, Mail, Phone, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, AuthUser } from '@/lib/zustand/auth-store';
import { useLocale } from '@/providers/locale-provider';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const supabase = createClient();
  const { t } = useLocale();
  const pageText = t('profile');
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || user?.email?.split('@')[0] || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.name || user.email?.split('@')[0] || '');
      setEditedPhone(user.phone || '');
    }
  }, [user]);

  const handleSavePersonalInfo = async () => {
    try {
      const response = await apiClient.updateProfile({ name: editedName, phone: editedPhone });
      if (response.data) {
        setUser(response.data as AuthUser);
      }
      toast.success(pageText['toast_updateSuccess']);
      setIsEditingPersonalInfo(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || pageText['toast_updateError']);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || user?.email?.split('@')[0] || '');
    setEditedPhone(user?.phone || '');
    setIsEditingPersonalInfo(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error(pageText['toast_fillAllFields']);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(pageText['toast_passwordMismatch']);
      return;
    }
    if (newPassword.length < 6) {
      toast.error(pageText['toast_passwordMinLength']);
      return;
    }

    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          password_changed_at: new Date().toISOString(),
        },
      });
      if (error) throw error;

      toast.success(pageText['toast_passwordSuccess'], {
        duration: 6000,
      });

      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || pageText['toast_passwordError'], {
        duration: 5000,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4 pb-4">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-3 lg:p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-2.5 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600 shadow-lg">
            <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm lg:text-lg text-gray-800">Profile Settings</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your account information</p>
          </div>
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-br from-vibrant-blue to-indigo-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-border shadow-xl">
              <Image
                src={user?.avatarUrl || '/test_images/avatar1.png'}
                alt={user?.name || 'User'}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-2 right-2 p-3 rounded-full bg-linear-to-br from-vibrant-blue to-indigo-600 text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Handle file upload
                  }
                }}
              />
            </label>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground mb-2">Profile Photo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              At least 1080 x 1080 px recommended. JPG or PNG is allowed.
            </p>
            <label
              htmlFor="profile-upload-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-muted to-muted/80 hover:from-vibrant-blue hover:to-indigo-600 text-foreground hover:text-white transition-all duration-300 hover:shadow-lg cursor-pointer font-medium text-sm"
            >
              <Camera className="w-4 h-4" />
              Upload new photo
              <input
                id="profile-upload-btn"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Handle file upload
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600">
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h4 className="font-bold text-sm lg:text-lg text-foreground">Personal Information</h4>
          </div>
          {!isEditingPersonalInfo ? (
            <button
              onClick={() => setIsEditingPersonalInfo(true)}
              className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl bg-linear-to-r from-muted to-muted/80 hover:from-vibrant-blue hover:to-indigo-600 text-foreground hover:text-white transition-all duration-300 hover:shadow-lg text-xs lg:text-sm font-medium w-full sm:w-auto justify-center"
            >
              <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all duration-300 text-xs lg:text-sm font-medium flex-1 sm:flex-none justify-center"
              >
                <X className="w-3 h-3 lg:w-4 lg:h-4" />
                Cancel
              </button>
              <button
                onClick={handleSavePersonalInfo}
                className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl bg-linear-to-r from-vibrant-blue to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 text-xs lg:text-sm font-medium flex-1 sm:flex-none justify-center"
              >
                <Save className="w-3 h-3 lg:w-4 lg:h-4" />
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Name Field */}
          <div>
            <label className="flex items-center gap-2 text-xs lg:text-sm font-medium text-muted-foreground mb-2">
              <User className="w-3 h-3 lg:w-4 lg:h-4" />
              Full Name
            </label>
            {!isEditingPersonalInfo ? (
              <div className="px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-muted/50 border border-border font-medium text-foreground text-sm lg:text-base overflow-hidden text-ellipsis whitespace-nowrap">
                {user?.name || user?.email?.split('@')[0] || 'Not set'}
              </div>
            ) : (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl border-2 border-vibrant-blue focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-sm lg:text-base bg-background text-foreground"
              />
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="flex items-center gap-2 text-xs lg:text-sm font-medium text-muted-foreground mb-2">
              <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
              Email Address
            </label>
            {!isEditingPersonalInfo ? (
              <div className="px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-muted/50 border border-border font-medium text-foreground text-sm lg:text-base overflow-hidden text-ellipsis whitespace-nowrap">
                {user?.email}
              </div>
            ) : (
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl border border-border bg-muted/50 font-medium text-muted-foreground cursor-not-allowed text-sm lg:text-base"
                title="Email cannot be changed"
              />
            )}
            {isEditingPersonalInfo && (
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="flex items-center gap-2 text-xs lg:text-sm font-medium text-muted-foreground mb-2">
              <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
              Phone Number
            </label>
            {!isEditingPersonalInfo ? (
              <div className="px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-muted/50 border border-border font-medium text-foreground text-sm lg:text-base">
                {user?.phone || 'Not set'}
              </div>
            ) : (
              <input
                type="tel"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl border-2 border-vibrant-blue focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-sm lg:text-base bg-background text-foreground"
                placeholder="Enter phone number"
              />
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600 ${
              user?.provider === 'GOOGLE' ? 'opacity-50' : ''
            }`}
          >
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4
              className={`font-bold text-base lg:text-lg ${
                user?.provider === 'GOOGLE' ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              Change Password
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user?.provider === 'GOOGLE'
                ? 'Password is managed by Google'
                : 'Update your password to keep your account secure'}
            </p>
          </div>
        </div>

        {user?.provider === 'GOOGLE' && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400">
              Your account is linked with Google. To change your password, please visit your Google
              Account settings.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                user?.provider === 'GOOGLE' ? 'text-muted-foreground/50' : 'text-muted-foreground'
              }`}
            >
              <Lock className="w-4 h-4" />
              New Password
            </label>
            <input
              placeholder="Enter new password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={user?.provider === 'GOOGLE'}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                user?.provider === 'GOOGLE'
                  ? 'border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed'
                  : 'border-border focus:border-vibrant-blue focus:ring-2 focus:ring-indigo-200 bg-background text-foreground'
              }`}
            />
          </div>
          <div>
            <label
              className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                user?.provider === 'GOOGLE' ? 'text-muted-foreground/50' : 'text-muted-foreground'
              }`}
            >
              <Lock className="w-4 h-4" />
              Confirm Password
            </label>
            <input
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={user?.provider === 'GOOGLE'}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                user?.provider === 'GOOGLE'
                  ? 'border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed'
                  : 'border-border focus:border-vibrant-blue focus:ring-2 focus:ring-indigo-200 bg-background text-foreground'
              }`}
            />
          </div>
        </div>

        {user?.provider === 'EMAIL' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-vibrant-blue to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* Account Actions Section */}
      {/* <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-6 lg:p-8">
        <h4 className="font-bold text-base lg:text-lg text-gray-800 mb-4">
          Account Actions
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 rounded-xl border-2 border-amber-500 text-amber-600 hover:bg-amber-50 transition-all duration-300 font-medium">
            Deactivate Account
          </button>
          <button className="px-6 py-3 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 transition-all duration-300 font-medium">
            Delete Account
          </button>
        </div>
      </div> */}
    </div>
  );
}
