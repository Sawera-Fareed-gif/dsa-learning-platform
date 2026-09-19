import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { getProblems, getProblemById, createProblem, deleteProblem } from '../controllers/problemsController.js';
import { getTopicsAndQuizzes, getQuizQuestions, submitQuiz } from '../controllers/quizController.js';
import { getUserDashboard } from '../controllers/dashboardController.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getDbStatus, inMemoryDb } from '../config/db.js';

const router = Router();

// ==========================================
// Authentication Endpoints
// ==========================================
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// ==========================================
// DSA Problems Endpoints
// ==========================================
router.get('/problems', getProblems);
router.get('/problems/:id', getProblemById);
router.post('/problems', authenticateToken, requireAdmin, createProblem);
router.delete('/problems/:id', authenticateToken, requireAdmin, deleteProblem);

// ==========================================
// Quiz Module Endpoints
// ==========================================
router.get('/quizzes', getTopicsAndQuizzes);
router.get('/quiz/questions', getQuizQuestions);
router.post('/quiz/submit', authenticateToken, submitQuiz);

// ==========================================
// User Analytics & Leaderboard Endpoints
// ==========================================
router.get('/dashboard', authenticateToken, getUserDashboard);
router.get('/leaderboard', getLeaderboard);

// ==========================================
// System Status & Utility Endpoints
// ==========================================
router.get('/db-status', (req, res) => {
  res.json({
    success: true,
    status: getDbStatus(),
  });
});

router.post('/reset-seed', (req, res) => {
  inMemoryDb.seed();
  res.json({
    success: true,
    message: 'Seed database re-initialized successfully with users, problems, quizzes, and scores.',
  });
});

export default router;
