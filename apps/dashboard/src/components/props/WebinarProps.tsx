export interface WebinarSpeaker {
  name: string;
  designation: string;
  image: string;
}

export interface SessionAgenda {
  time: string;
  title: string;
  description: string;
  speakerName: string;
}

export interface WebinarResource {
  fileName: string;
  fileUrl: string;
}

export interface WebinarProps {
  id: string;
  title: string;
  category: string;
  image?: string;
  scheduleDateTime: string; // ISO date string
  duration: number; // in minutes
  feeType: 'free' | 'paid';
  price?: number;
  platform: string;
  liveLink?: string;
  sessionHighlights?: string; // Markdown format - list of highlights
  aboutWebinar?: string; // Markdown format - detailed description
  speakers?: WebinarSpeaker[];
  sessionAgenda?: SessionAgenda[];
  resources?: WebinarResource[];
  status: 'upcoming' | 'live' | 'completed' | 'draft';
  registeredUsers?: number;
}
