'use client';

import { Facebook, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';

interface FacebookGroupTabProps {
  fbGroupLink: string;
  setFbGroupLink: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  savedLink?: string;
}

export function FacebookGroupTab({
  fbGroupLink,
  setFbGroupLink,
  onSubmit,
  isLoading,
  savedLink,
}: FacebookGroupTabProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Show saved link if exists */}
      {savedLink && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <span className="text-sm font-semibold text-green-800">Current Saved Link</span>
          </div>
          <a
            href={savedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 break-all"
          >
            {savedLink}
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Facebook size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Facebook Group Link</h3>
            <p className="text-sm text-slate-500">
              Add or update the Facebook group link for this course
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Group URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={fbGroupLink}
              onChange={(e) => setFbGroupLink(e.target.value)}
              placeholder="https://www.facebook.com/groups/your-group"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={!fbGroupLink.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Facebook Group Link'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
