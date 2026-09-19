import request from 'supertest';
import { app } from '../src/app';
import { calculateQuizScore } from '../src/controllers/quizController';
import { Problem } from '../src/types';
import { inMemoryDb } from '../src/config/db';

describe('Quiz Module & Scoring Logic Tests', () => {
  beforeEach(() => {
    inMemoryDb.seed();
  });

  describe('Unit Tests: calculateQuizScore Pure Function', () => {
    const sampleQuestions: Problem[] = [
      {
        id: 101,
        title: 'Binary Search Time Complexity',
        description: 'What is the worst case time complexity of Binary Search?',
        difficulty: 'Easy',
        topic: 'Sorting & Searching',
        correct_answer: 'O(log n)',
        explanation: 'Halves the search space each step.',
      },
      {
        id: 102,
        title: 'Stack Operations',
        description: 'Which principle does a Stack follow?',
        difficulty: 'Easy',
        topic: 'Arrays',
        correct_answer: 'LIFO',
        explanation: 'Last In First Out.',
      },
      {
        id: 103,
        title: 'Tree Height',
        description: 'What is the maximum number of nodes at level k of a binary tree?',
        difficulty: 'Medium',
        topic: 'Trees',
        correct_answer: '2^k',
        explanation: 'Each node has at most 2 children.',
      },
      {
        id: 104,
        title: 'Hash Collisions',
        description: 'Which technique resolves collisions with linked lists?',
        difficulty: 'Easy',
        topic: 'Arrays',
        correct_answer: 'Chaining',
        explanation: 'Separate chaining stores collided keys in a bucket list.',
      },
    ];

    it('calculates 100% score when all answers are correct', () => {
      const answers = {
        101: 'O(log n)',
        102: 'LIFO',
        103: '2^k',
        104: 'Chaining',
      };

      const result = calculateQuizScore(sampleQuestions, answers);
      expect(result.score).toBe(100);
      expect(result.correctCount).toBe(4);
      expect(result.totalQuestions).toBe(4);
      expect(result.details.every(d => d.isCorrect)).toBe(true);
    });

    it('calculates 0% score when all answers are incorrect', () => {
      const answers = {
        101: 'O(n)',
        102: 'FIFO',
        103: 'k^2',
        104: 'Open Addressing',
      };

      const result = calculateQuizScore(sampleQuestions, answers);
      expect(result.score).toBe(0);
      expect(result.correctCount).toBe(0);
      expect(result.details.every(d => !d.isCorrect)).toBe(true);
    });

    it('calculates partial score (50%) accurately with 2 out of 4 correct', () => {
      const answers = {
        101: 'O(log n)', // correct
        102: 'LIFO', // correct
        103: 'wrong', // incorrect
        104: 'wrong', // incorrect
      };

      const result = calculateQuizScore(sampleQuestions, answers);
      expect(result.score).toBe(50);
      expect(result.correctCount).toBe(2);
      expect(result.totalQuestions).toBe(4);
    });

    it('handles case-insensitivity and extra whitespace in answers', () => {
      const answers = {
        101: '  o(log n)  ',
        102: 'lifo ',
        103: ' 2^k',
        104: 'CHAINING',
      };

      const result = calculateQuizScore(sampleQuestions, answers);
      expect(result.score).toBe(100);
      expect(result.correctCount).toBe(4);
    });

    it('handles empty questions array safely without crashing (0%)', () => {
      const result = calculateQuizScore([], {});
      expect(result.score).toBe(0);
      expect(result.correctCount).toBe(0);
      expect(result.totalQuestions).toBe(0);
      expect(result.details).toEqual([]);
    });

    it('handles missing/unanswered questions correctly as incorrect', () => {
      const answers = {
        101: 'O(log n)', // only 1 answered
      };

      const result = calculateQuizScore(sampleQuestions, answers);
      expect(result.score).toBe(25);
      expect(result.correctCount).toBe(1);
    });
  });

  describe('Integration Tests: Quiz & Dashboard Endpoints', () => {
    let userToken: string;

    beforeEach(async () => {
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          email: 'alex@example.com',
          password: 'Password123!',
        });
      userToken = loginRes.body.token;
    });

    it('GET /api/quizzes - returns available topics and quiz definitions', async () => {
      const res = await request(app).get('/api/quizzes');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.topics)).toBe(true);
      expect(res.body.topics.length).toBeGreaterThan(0);
    });

    it('GET /api/quiz/questions?topic=Arrays - returns quiz questions without leaking correct_answer', async () => {
      const res = await request(app).get('/api/quiz/questions?topic=Arrays');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.questions.length).toBeGreaterThan(0);

      // Verify anti-cheat: questions MUST NOT contain correct_answer or explanation
      res.body.questions.forEach((q: any) => {
        expect(q.correct_answer).toBeUndefined();
        expect(q.explanation).toBeUndefined();
        expect(Array.isArray(q.options)).toBe(true);
      });
    });

    it('POST /api/quiz/submit - evaluates answers, records score, and returns breakdown', async () => {
      const submitRes = await request(app)
        .post('/api/quiz/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quiz_id: 1,
          topic: 'Arrays',
          answers: {
            1: 'O(n) time, O(n) space', // correct answer for problem 1
            2: 'Deciding whether to add the current element to the existing subarray or start a new subarray', // correct for problem 2
          },
          time_spent_seconds: 45,
        });

      expect(submitRes.status).toBe(200);
      expect(submitRes.body.success).toBe(true);
      expect(submitRes.body.result.score).toBe(100);
      expect(submitRes.body.result.correct_count).toBe(2);
      expect(submitRes.body.result.details.length).toBe(2);
      expect(submitRes.body.result.details[0].isCorrect).toBe(true);
      expect(submitRes.body.result.details[0].explanation).toBeDefined();
    });

    it('POST /api/quiz/submit - rejects submission without auth token (401)', async () => {
      const res = await request(app)
        .post('/api/quiz/submit')
        .send({
          quiz_id: 1,
          answers: { 1: 'any' },
        });

      expect(res.status).toBe(401);
    });

    it('GET /api/leaderboard - returns top ranked users sorted by total score', async () => {
      const res = await request(app).get('/api/leaderboard');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.leaderboard)).toBe(true);
      expect(res.body.leaderboard.length).toBeLessThanOrEqual(10);

      // Verify descending order
      for (let i = 0; i < res.body.leaderboard.length - 1; i++) {
        expect(res.body.leaderboard[i].total_score).toBeGreaterThanOrEqual(
          res.body.leaderboard[i + 1].total_score
        );
      }
    });

    it('GET /api/dashboard - returns user progress analytics with time-series data', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.problems_attempted).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(res.body.progress_over_time)).toBe(true);
      expect(Array.isArray(res.body.topic_breakdown)).toBe(true);
    });
  });
});
