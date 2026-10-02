export interface TurnusSlots {
  turnus1?: number; // z.B. Durchgang 1 (Jg 8)
  turnus2?: number; // z.B. Durchgang 2 (Jg 8)
  turnus3?: number; // z.B. Durchgang 3 (Jg 9)
  turnus4?: number; // z.B. Durchgang 4 (Jg 9)
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  category: 'tech' | 'craft' | 'care' | 'service' | 'industry';
  city: string;
  address?: string;
  slots: number; // Gesamt bzw. Standard-Plätze
  turnusSlots?: TurnusSlots; // Feinjustierte Plätze je Turnus 1-4
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
  selectedTurnus?: string; // z.B. 'Turnus 1', 'Turnus 2', 'Turnus 3', 'Turnus 4'
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
