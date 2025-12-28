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
  webinarId?: string;
  category?: string;
  title?: string;
  showShadow?: boolean;
  endDate?: string;
  feeType?: string;
  price?: number | null;
  maxDiscount?: string | null;
  gradientFrom?: string;
  gradientTo?: string;
}
