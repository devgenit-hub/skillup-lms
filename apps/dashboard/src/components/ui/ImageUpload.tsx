'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, User, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage, type StorageBucket } from '@/lib/supabase/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket: StorageBucket;
  label?: string;
  error?: string;
  variant?: 'avatar' | 'hero';
  onUploadStateChange?: (isUploading: boolean) => void;
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  label,
  error,
  variant = 'avatar',
  onUploadStateChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB');
      return;
    }

    try {
      setUploading(true);
      onUploadStateChange?.(true);
      setFileName(file.name);
      const url = await uploadImage(file, bucket);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      onUploadStateChange?.(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB');
      return;
    }

    try {
      setUploading(true);
      onUploadStateChange?.(true);
      const url = await uploadImage(file, bucket);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      onUploadStateChange?.(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName('');
    toast.success('Image removed');
  };

  if (variant === 'hero') {
    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label || 'Hero Image'} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              isDragging
                ? 'border-vibrant-blue bg-blue-50 scale-[1.02]'
                : value
                  ? 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-vibrant-blue'
            }`}
          >
            {value ? (
              <>
                <div className="relative w-full h-full p-4 flex items-center justify-center">
                  <Image
                    src={value}
                    alt="Hero preview"
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
                <button
                  onClick={handleRemove}
                  className="absolute bottom-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                {uploading ? (
                  <Loader2 className="w-12 h-12 mb-4 text-vibrant-blue animate-spin" />
                ) : (
                  <div
                    className={`p-4 rounded-full mb-4 transition-colors ${
                      isDragging ? 'bg-vibrant-blue' : 'bg-slate-200'
                    }`}
                  >
                    <Upload
                      className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-slate-500'}`}
                    />
                  </div>
                )}
                <p className="mb-2 text-base text-slate-700 font-semibold text-center">
                  {uploading ? (
                    'Uploading...'
                  ) : isDragging ? (
                    'Drop image here'
                  ) : (
                    <>
                      <span className="text-vibrant-blue">Click to upload</span> or drag and drop
                    </>
                  )}
                </p>
                <p className="text-sm text-slate-500 text-center">PNG, JPG or WEBP (MAX. 5MB)</p>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Recommended size: 1920x600 or similar aspect ratio
                </p>
              </div>
            )}
          </div>
        </div>
        {fileName && (
          <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
            <span className="font-medium">Selected file:</span>
            <span className="text-slate-800 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
              {fileName}
            </span>
          </p>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
        {label || 'Profile Picture'}
      </h2>

      <div className="flex items-center gap-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`shrink-0 relative transition-all cursor-pointer ${
            isDragging ? 'ring-2 ring-vibrant-blue ring-offset-2' : ''
          }`}
          onClick={() => fileInputRef.current?.click()}
          title="Click or drag & drop to upload"
        >
          {value ? (
            <Image
              src={value}
              alt="Preview"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
              unoptimized
            />
          ) : (
            <div
              className={`w-32 h-32 rounded-full bg-slate-100 border-4 flex items-center justify-center flex-col gap-1 ${
                isDragging ? 'border-vibrant-blue bg-blue-50' : 'border-slate-200'
              }`}
            >
              {isDragging ? (
                <Upload size={32} className="text-vibrant-blue" />
              ) : (
                <>
                  <User size={36} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-medium text-center px-2">
                    Click or Drag
                  </span>
                </>
              )}
            </div>
          )}
          {isDragging && value && (
            <div className="absolute inset-0 rounded-full bg-vibrant-blue bg-opacity-20 flex items-center justify-center">
              <p className="text-xs text-vibrant-blue font-semibold">Drop here</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg cursor-pointer hover:bg-dark-blue transition-all ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            } ${isDragging ? 'scale-105 ring-2 ring-vibrant-blue ring-offset-2' : ''}`}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : isDragging ? (
              <>
                <Upload size={18} />
                Drop to upload
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Picture
              </>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Recommended: Square image, max 5MB.{' '}
            <span className="font-medium">Click or drag & drop</span>
          </p>
          {fileName && (
            <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
              <span className="font-medium">Selected file:</span>
              <span className="text-slate-800 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                {fileName}
              </span>
            </p>
          )}

          <div className="mt-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-2">
              Or provide image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={uploading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue ${
                error ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
