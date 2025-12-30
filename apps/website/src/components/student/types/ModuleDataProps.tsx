export interface CurriculumClass {
  id: string;
  title: string;
  videoUrl?: string;
  duration?: number; // Duration in minutes
  order: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface CurriculumMaterial {
  id: string;
  title: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number; // Size in bytes
  order: number;
}

export interface ModuleData {
  id: string;
  title: string;
  details?: string;
  order: number;
  classes: CurriculumClass[];
  materials: CurriculumMaterial[];
  isExpanded?: boolean;
  progress?: number; // Percentage of completion
}
