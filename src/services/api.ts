import {
  User,
  Problem,
  QuizTopic,
  QuizDefinition,
  QuizQuestion,
  QuizSubmissionResult,
  UserStats,
  ProgressDataPoint,
  TopicBreakdown,
  LeaderboardUser,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('dsa_jwt_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async signup(data: { name: string; email: string; password: string; role?: string }): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Signup failed');
    }
    return body;
  },

  async login(data: { email: string; password: string }): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Login failed');
    }
    return body;
  },

  async getProfile(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to fetch profile');
    }
    return body;
  },

  // Problems
  async getProblems(filters?: { difficulty?: string; topic?: string; search?: string }): Promise<{
    problems: Problem[];
    topics: string[];
    difficultyCounts: { Easy: number; Medium: number; Hard: number };
    total: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.difficulty && filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
    if (filters?.topic && filters.topic !== 'All') params.append('topic', filters.topic);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/problems?${params.toString()}`);
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to fetch problems');
    }
    return body;
  },

  async getProblemById(id: number): Promise<{ problem: Problem }> {
    const res = await fetch(`${API_BASE}/problems/${id}`);
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to fetch problem details');
    }
    return body;
  },

  async createProblem(problemData: {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    options?: string[];
    correct_answer?: string;
    explanation?: string;
  }): Promise<{ problem: Problem; message: string }> {
    const res = await fetch(`${API_BASE}/problems`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(problemData),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to create problem');
    }
    return body;
  },

  async deleteProblem(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/problems/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to delete problem');
    }
    return body;
  },

  // Quiz
  async getQuizzes(): Promise<{ topics: QuizTopic[]; quizzes: QuizDefinition[] }> {
    const res = await fetch(`${API_BASE}/quizzes`);
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to fetch quizzes');
    }
    return body;
  },

  async getQuizQuestions(params: { topic?: string; quiz_id?: number }): Promise<{
    quiz_id: number;
    title: string;
    topic: string;
    duration_minutes: number;
    total_questions: number;
    questions: QuizQuestion[];
  }> {
    const query = new URLSearchParams();
    if (params.topic) query.append('topic', params.topic);
    if (params.quiz_id) query.append('quiz_id', String(params.quiz_id));

    const res = await fetch(`${API_BASE}/quiz/questions?${query.toString()}`);
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to fetch quiz questions');
    }
    return body;
  },

  async submitQuiz(data: {
    quiz_id?: number;
    topic?: string;
    answers: Record<number, string>;
    time_spent_seconds: number;
  }): Promise<{ result: QuizSubmissionResult; message: string }> {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to submit quiz');
    }
    return body;
  },

  // Dashboard & Leaderboard
  async getDashboard(): Promise<{
    stats: UserStats;
    progress_over_time: ProgressDataPoint[];
    topic_breakdown: TopicBreakdown[];
    recent_activity: ProgressDataPoint[];
  }> {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to load dashboard data');
    }
    return body;
  },

  async getLeaderboard(): Promise<{ total_participants: number; leaderboard: LeaderboardUser[] }> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || 'Failed to load leaderboard');
    }
    return body;
  },

  async getDbStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/db-status`);
    return res.json();
  },
};
