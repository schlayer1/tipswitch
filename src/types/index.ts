export interface Company {
  id: string;
  name: string;
  industry: string;
  category: 'tech' | 'craft' | 'care' | 'service' | 'industry';
  city: string;
  address?: string;
  slots: number;
  shortDescription: string;
  highlights: string[];
  pdfUrl?: string;
  imageUrl?: string;
  bannerGradient?: string;
  active: boolean;
}

export type SwipeDirection = 'left' | 'right' | 'super';

export interface StudentPreferences {
  studentCode: string;
  studentName: string;
  studentClass: string;
  likes: string[]; // Company IDs
  superLikes: string[]; // Company IDs (Top-Wünsche)
  dislikes: string[]; // Company IDs
  updatedAt: string;
}

export interface UserAuth {
  role: 'student' | 'teacher' | null;
  studentCode: string;
  studentName: string;
  studentClass: string;
}
