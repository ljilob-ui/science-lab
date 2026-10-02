export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  category?: string;
}

export interface Score {
  id: string;
  nickname: string;
  score: number;
  played_at: string;
  quiz_name?: string;
}

export type LabTab = 'acid-base' | 'density' | 'circuit' | 'optics' | 'quiz' | 'community';

export interface QuizQuestion {
  id: number;
  lab: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
