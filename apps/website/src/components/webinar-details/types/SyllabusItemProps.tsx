export interface AgendaItemProps {
  id: string;
  time: string; // e.g., "৮:০০ PM - ৮:১৫ PM"
  title: string;
  description: string;
  speaker?: string; // Optional speaker name for this segment
}
