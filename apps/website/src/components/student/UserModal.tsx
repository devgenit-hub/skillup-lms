'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Edit, X } from 'lucide-react';

export default function UserModal({
  open,
  onClose,
  imageUrl,
  name,
  email,
  phone,
}: {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  name: string;
  email?: string;
  phone?: string;
}) {
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedPhone, setEditedPhone] = useState(phone);

  const handleSavePersonalInfo = () => {
    // Update the actual values
    // You would typically call an API here to save the data
    setIsEditingPersonalInfo(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setEditedName(name);
    setEditedEmail(email);
    setEditedPhone(phone);
    setIsEditingPersonalInfo(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative z-10 max-w-[95vw] rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-600 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-6 items-start">
          <div className="flex-1">
            <div className="flex gap-7 items-center">
              <div className="flex-shrink-0">
                <div className="h-28 w-28 rounded-full overflow-hidden ring-2 ring-gray-100">
                  <Image src={imageUrl} alt={name} width={112} height={112} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="rounded-full bg-black/20 px-4 py-2 text-sm font-bold cursor-pointer">
                    Upload new photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log('Selected file:', file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="text-sm text-black/50">
                  At least 1080 x 1080 px recommended
                  <br />
                  JPG or PNG is allowed
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">Personal Info</h4>
                  {!isEditingPersonalInfo ? (
                    <button
                      onClick={() => setIsEditingPersonalInfo(true)}
                      className="text-sm rounded-full px-4 py-1 hover:bg-black/10 border flex items-center gap-1"
                    >
                      <Edit size={15} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="text-sm rounded-full px-4 py-1 hover:bg-black/10 border"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePersonalInfo}
                        className="text-sm rounded-full px-4 py-1 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-black/50">Name</div>
                    {!isEditingPersonalInfo ? (
                      <div className="font-medium">{name}</div>
                    ) : (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-black/50">Email</div>
                    {!isEditingPersonalInfo ? (
                      <div className="font-medium">{email ?? '-'}</div>
                    ) : (
                      <input
                        type="email"
                        disabled
                        value={editedEmail || ''}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium disabled:grayscale-75 opacity-40 cursor-not-allowed"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-black/50">Phone</div>
                    {!isEditingPersonalInfo ? (
                      <div className="font-medium">{phone ?? '-'}</div>
                    ) : (
                      <input
                        type="tel"
                        disabled
                        value={editedPhone || ''}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium disabled:grayscale-75 opacity-40 cursor-not-allowed"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-vibrant-blue/5 border border-black/10 p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Change password</h4>
                  <button className="text-sm text-gray-500">Cancel</button>
                </div>

                <div className="mt-4 flex gap-3">
                  <div className="flex gap-1">
                    <input
                      placeholder="New password"
                      type="password"
                      className="flex-1 rounded-md border border-vibrant-blue px-3 py-2 bg-white text-sm"
                    />
                    <input
                      placeholder="Confirm password"
                      type="password"
                      className="flex-1 rounded-md border border-vibrant-blue px-3 py-2 bg-white text-sm"
                    />
                  </div>
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
