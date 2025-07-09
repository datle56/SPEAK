export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  totalLessons: number;
  completedLessons: number;
  accuracy: number;
  studyTime: number; // in minutes
  joinDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface LessonNode {
  id: number;
  title: string;
  icon: string;
  status: 'locked' | 'available' | 'current' | 'completed' | 'perfect';
  stars: number;
  position: { x: number; y: number };
  category: string;
}

export interface WordAnalysis {
  word: string;
  phonetic: string;
  accuracy: number;
  status: 'correct' | 'incorrect' | 'close';
}

export interface Lesson {
  id: number;
  sentence: string;
  phonetic: string;
  audio_url: string;
  word_analysis: WordAnalysis[];
  overall_score: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}