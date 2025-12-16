/**
 * Props for the InfoCard component.
 *
 * @property chipText - Short label shown in the top-left chip (e.g. "Webinar").
 * @property chipColor - RGBA color for chip background (e.g. "#5604F4").
 * @property title - Main title of the card.
 * @property description - Short description or subtitle.
 * @property bgColor - RGBA background color for the card container.
 * @property borderColor - RGBA border color for the card container.
 * @property totalStudents - Number of enrolled students (used for display).
 * @property topProfileImagesURLs - Array of profile image URLs shown as avatars. (max 3 shown)
 */
export interface InfoCardProps {
  chipText?: string;
  chipColor?: string;
  title?: string;
  description?: string;
  bgColor?: string;
  borderColor?: string;
  totalStudents?: string;
  topProfileImagesURLs?: string[];
}
