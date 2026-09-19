import request from 'supertest';
import { app } from '../src/app';
import { inMemoryDb } from '../src/config/db';

describe('DSA Problems Module Integration Tests', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    inMemoryDb.seed();

    const adminLogin = await request(app)
      .post('/api/login')
      .send({ email: 'admin@dsa.com', password: 'Password123!' });
    adminToken = adminLogin.body.token;

    const userLogin = await request(app)
      .post('/api/login')
      .send({ email: 'alex@example.com', password: 'Password123!' });
    userToken = userLogin.body.token;
  });

  it('GET /api/problems - retrieves all problems and topic counts', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.problems.length).toBeGreaterThan(0);
    expect(res.body.topics).toContain('Arrays');
    expect(res.body.difficultyCounts.Easy).toBeGreaterThan(0);
  });

  it('GET /api/problems with query filters - filters by difficulty and topic', async () => {
    const res = await request(app).get('/api/problems?difficulty=Easy&topic=Arrays');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.problems.forEach((p: any) => {
      expect(p.difficulty).toBe('Easy');
      expect(p.topic).toBe('Arrays');
    });
  });

  it('GET /api/problems/:id - retrieves a specific problem', async () => {
    const res = await request(app).get('/api/problems/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.problem.id).toBe(1);
    expect(res.body.problem.title).toBe('Two Sum Problem');
  });

  it('POST /api/problems - Admin creates a new DSA problem', async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Trapping Rain Water',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        difficulty: 'Hard',
        topic: 'Arrays',
        options: ['O(n) time, O(1) space with two pointers', 'O(n^2) brute force', 'O(2^n) exponential recursion', 'O(log n) binary search'],
        correct_answer: 'O(n) time, O(1) space with two pointers',
        explanation: 'Two pointers maintain left_max and right_max, allowing linear scan with constant auxiliary space.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.problem.title).toBe('Trapping Rain Water');
    expect(res.body.problem.difficulty).toBe('Hard');
  });

  it('POST /api/problems - Non-admin user is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Unauthorized Problem',
        description: 'Should not be allowed to create.',
        difficulty: 'Medium',
        topic: 'Graphs',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /api/problems/:id - Admin deletes a problem', async () => {
    const res = await request(app)
      .delete('/api/problems/12')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await request(app).get('/api/problems/12');
    expect(checkRes.status).toBe(404);
  });
});
