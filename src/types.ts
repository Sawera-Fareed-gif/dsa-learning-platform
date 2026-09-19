export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
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
  hasQuizSupport?: boolean;
  created_at?: string;
}

export interface QuizTopic {
  topic: string;
  totalProblems: number;
  quizReady: number;
  difficulties: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
}

export interface QuizDefinition {
  id: number;
  title: string;
  topic: string;
  problem_ids: number[];
}

export interface QuizQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  options: string[];
}

export interface QuizResultDetail {
  problemId: number;
  title: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmissionResult {
  score_id: number;
  score: number;
  correct_count: number;
  total_questions: number;
  passed: boolean;
  time_spent_seconds: number;
  date_taken: string;
  details: QuizResultDetail[];
}

export interface UserStats {
  problems_attempted: number;
  quizzes_taken: number;
  average_score: number;
  highest_score: number;
  total_score: number;
}

export interface ProgressDataPoint {
  id: number;
  attempt_number: number;
  date: string;
  timestamp: string;
  score: number;
  quiz_title: string;
  topic: string;
  total_questions: number;
}

export interface TopicBreakdown {
  topic: string;
  attempts: number;
  average_score: number;
}

export interface LeaderboardUser {
  rank: number;
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  total_score: number;
  quizzes_taken: number;
  average_score: number;
  badge: string;
  last_activity: string | null;
}
