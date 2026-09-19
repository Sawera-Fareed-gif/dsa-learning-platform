export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  created_at?: string;
}

export interface Quiz {
  id: number;
  title: string;
  topic: string;
  problem_ids: number[];
  created_at?: string;
}

export interface Score {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  date_taken: string;
  quiz_title?: string;
  topic?: string;
}

export interface LeaderboardEntry {
  user_id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  total_score: number;
  quizzes_taken: number;
  average_score: number;
  last_activity: string | null;
}

export interface AuthRequestUser {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
