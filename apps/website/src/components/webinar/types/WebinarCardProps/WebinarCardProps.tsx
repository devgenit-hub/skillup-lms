/**
 * Props for WebinarCard component
 * imageUrl: URL of the webinar image
 * category: Category of the webinar
 * title: Title of the webinar
 * endDate: End date of the webinar. Format: YYYY-MM-DD
 * gradientFrom: Starting color of the gradient background
 * gradientTo: Ending color of the gradient background
 **/

export interface WebinarCardProps {
  imageUrl?: string;
  webinarId?: number;
  category?: string;
  title?: string;
  showShadow?: boolean;
  endDate?: string;
  gradientFrom?: string;
  gradientTo?: string;
}
