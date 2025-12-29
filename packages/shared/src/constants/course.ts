// Course Fee Type
export const FeeType = {
  FREE: 'FREE',
  PAID: 'PAID',
} as const;

export type FeeTypeType = (typeof FeeType)[keyof typeof FeeType];

// Webinar Fee Type (lowercase for webinars as per database schema)
export const WebinarFeeType = {
  FREE: 'free',
  PAID: 'paid',
} as const;

export type WebinarFeeTypeType = (typeof WebinarFeeType)[keyof typeof WebinarFeeType];

// Course Level
export const CourseLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type CourseLevelType = (typeof CourseLevel)[keyof typeof CourseLevel];

// Course Type
export const CourseType = {
  RECORDED: 'record',
  LIVE: 'live',
} as const;

export type CourseTypeType = (typeof CourseType)[keyof typeof CourseType];

// Webinar Status
export const WebinarStatus = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type WebinarStatusType = (typeof WebinarStatus)[keyof typeof WebinarStatus];
