import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';
import { JWT_SECRET } from '../src/middleware/auth';
import { inMemoryDb } from '../src/config/db';

describe('Authentication Module Tests', () => {
  beforeEach(() => {
    // Reset DB seed state before each test
    inMemoryDb.seed();
  });

  describe('Unit Tests: Password & Token Utilities', () => {
    it('should correctly hash and verify password with bcrypt', async () => {
      const password = 'TestSecurePassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toEqual(password);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });

    it('should generate, sign, and verify a valid JWT token', () => {
      const payload = {
        id: 99,
        email: 'tester@example.com',
        name: 'Unit Tester',
        role: 'user' as const,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);

      const decoded = jwt.verify(token, JWT_SECRET) as typeof payload;
      expect(decoded.id).toBe(99);
      expect(decoded.email).toBe('tester@example.com');
      expect(decoded.role).toBe('user');
    });

    it('should fail token verification with wrong secret', () => {
      const payload = { id: 1, email: 'admin@dsa.com', name: 'Admin', role: 'admin' as const };
      const token = jwt.sign(payload, 'wrong_secret_key');

      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });
  });

  describe('Integration Tests: Auth Endpoints', () => {
    it('POST /api/signup - successfully registers a new student user', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'Jane Doe',
          email: 'janedoe@test.com',
          password: 'Password123!',
          role: 'user',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toMatchObject({
        name: 'Jane Doe',
        email: 'janedoe@test.com',
        role: 'user',
      });
      expect(res.body.user.password_hash).toBeUndefined();
    });

    it('POST /api/signup - fails when email already exists (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'Duplicate Admin',
          email: 'admin@dsa.com', // already seeded
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('POST /api/signup - rejects invalid inputs (missing fields or short password)', async () => {
      const resShort = await request(app)
        .post('/api/signup')
        .send({
          name: 'A',
          email: 'invalid-email',
          password: '123',
        });

      expect(resShort.status).toBe(400);
      expect(resShort.body.success).toBe(false);
    });

    it('POST /api/login - succeeds with correct credentials and returns JWT', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@dsa.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('admin@dsa.com');
      expect(res.body.user.role).toBe('admin');
    });

    it('POST /api/login - returns 401 on incorrect password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@dsa.com',
          password: 'IncorrectPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.token).toBeUndefined();
    });

    it('GET /api/profile - returns user profile with valid Bearer token', async () => {
      // Login first to obtain valid token
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          email: 'alex@example.com',
          password: 'Password123!',
        });

      const token = loginRes.body.token;

      const profileRes = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.success).toBe(true);
      expect(profileRes.body.user.email).toBe('alex@example.com');
      expect(profileRes.body.user.name).toBe('Alex Turner');
    });

    it('GET /api/profile - returns 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
