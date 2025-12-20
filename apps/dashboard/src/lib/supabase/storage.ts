import { createClient } from './client';

export const STORAGE_BUCKETS = {
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  COURSES: 'courses',
  MATERIALS: 'course-materials',
  LESSONS: 'lessons',
  CLASS_ROUTINES: 'class-routines',
  CERTIFICATES: 'certificates',
  WEBINARS: 'webinars',
  AVATARS: 'avatars',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export async function uploadImage(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<string> {
  const supabase = createClient();

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<string> {
  const supabase = createClient();

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF, DOC, DOCX, PPT, PPTX, and ZIP files are allowed');
  }

  const maxSize = 50 * 1024 * 1024; // 50MB for materials
  if (file.size > maxSize) {
    throw new Error('File size must be less than 50MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(url: string, bucket: StorageBucket): Promise<void> {
  const supabase = createClient();

  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const bucketIndex = pathParts.indexOf(bucket);

  if (bucketIndex === -1) {
    throw new Error('Invalid URL format');
  }

  const filePath = pathParts.slice(bucketIndex + 1).join('/');

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
