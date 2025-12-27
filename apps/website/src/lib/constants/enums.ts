// Re-export centralized enums from @repo/shared
export {
  FeeType,
  WebinarFeeType,
  CourseLevel,
  CourseType,
  WebinarStatus,
  type FeeTypeType,
  type WebinarFeeTypeType,
  type CourseLevelType,
  type CourseTypeType,
  type WebinarStatusType,
} from '@repo/shared';

// Bangla labels for UI
export const FeeBanglaLabels = {
  FREE: 'ফ্রি',
  PAID: 'পেইড',
} as const;

export const LevelBanglaLabels = {
  BEGINNER: 'বেগিনার',
  INTERMEDIATE: 'ইন্টারমিডিয়েট',
  ADVANCED: 'অ্যাডভান্সড',
} as const;

export const CourseTypeBanglaLabels = {
  LIVE: 'লাইভ',
  RECORDED: 'রেকর্ডেড',
} as const;

export const WebinarStatusBanglaLabels = {
  DRAFT: 'ড্রাফট',
  SCHEDULED: 'নির্ধারিত',
  LIVE: 'লাইভ',
  COMPLETED: 'সম্পন্ন',
  CANCELLED: 'বাতিল',
} as const;
