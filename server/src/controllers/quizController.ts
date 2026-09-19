import { Request, Response } from 'express';
import { inMemoryDb } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Problem } from '../types.js';

/**
 * Pure scoring calculation function for unit testing and reuse
 */
export function calculateQuizScore(
  questions: Problem[],
  userAnswers: Record<number, string>
): {
  score: number; // percentage 0-100
  correctCount: number;
  totalQuestions: number;
  details: Array<{
    problemId: number;
    title: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
} {
  if (!questions || questions.length === 0) {
    return { score: 0, correctCount: 0, totalQuestions: 0, details: [] };
  }

  let correctCount = 0;
  const details = questions.map(q => {
    const userAnswer = userAnswers[q.id] ? String(userAnswers[q.id]).trim() : null;
    const correctAnswer = q.correct_answer ? String(q.correct_answer).trim() : '';

    const isCorrect = userAnswer !== null && userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    if (isCorrect) {
      correctCount++;
    }

    return {
      problemId: q.id,
      title: q.title,
      userAnswer,
      correctAnswer,
      isCorrect,
      explanation: q.explanation || 'Algorithmic efficiency and constraints are key.',
    };
  });

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return {
    score,
    correctCount,
    totalQuestions,
    details,
  };
}

export async function getTopicsAndQuizzes(req: Request, res: Response) {
  try {
    const problems = inMemoryDb.problems;
    const quizzes = inMemoryDb.quizzes;

    // Aggregate topics with count of problems having quiz options
    const topicStats: Record<string, { totalProblems: number; quizReady: number; difficulties: Record<string, number> }> = {};

    for (const p of problems) {
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { totalProblems: 0, quizReady: 0, difficulties: { Easy: 0, Medium: 0, Hard: 0 } };
      }
      topicStats[p.topic].totalProblems++;
      if (p.options && p.options.length > 0) {
        topicStats[p.topic].quizReady++;
      }
      if (p.difficulty in topicStats[p.topic].difficulties) {
        topicStats[p.topic].difficulties[p.difficulty]++;
      }
    }

    const topicsList = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      ...stats,
    }));

    return res.json({
      success: true,
      topics: topicsList,
      quizzes,
    });
  } catch (err: any) {
    console.error('Get quizzes error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}

export async function getQuizQuestions(req: Request, res: Response) {
  try {
    const { topic, quiz_id } = req.query;

    let targetProblems: Problem[] = [];
    let title = 'DSA Assessment';
    let resolvedTopic = 'General';
    let resolvedQuizId = 1;

    if (quiz_id) {
      const qId = parseInt(String(quiz_id), 10);
      const quiz = inMemoryDb.getQuizById(qId);
      if (quiz) {
        title = quiz.title;
        resolvedTopic = quiz.topic;
        resolvedQuizId = quiz.id;
        targetProblems = quiz.problem_ids
          .map(id => inMemoryDb.getProblemById(id))
          .filter((p): p is Problem => Boolean(p));
      }
    }

    if (targetProblems.length === 0 && topic) {
      resolvedTopic = String(topic);
      title = `${resolvedTopic} Challenge Quiz`;
      targetProblems = inMemoryDb.problems.filter(
        p => p.topic.toLowerCase() === resolvedTopic.toLowerCase() && p.options && p.options.length > 0
      );
      // Find or create quiz record for this topic
      const existingQuiz = inMemoryDb.getQuizByTopic(resolvedTopic);
      if (existingQuiz) {
        resolvedQuizId = existingQuiz.id;
      }
    }

    // Fallback if empty
    if (targetProblems.length === 0) {
      targetProblems = inMemoryDb.problems.filter(p => p.options && p.options.length > 0).slice(0, 5);
      title = 'Comprehensive DSA Fundamentals Quiz';
    }

    // Return sanitized questions WITHOUT correct_answer and explanation to prevent inspect-element cheating
    const sanitizedQuestions = targetProblems.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      topic: p.topic,
      options: p.options || [],
    }));

    return res.json({
      success: true,
      quiz_id: resolvedQuizId,
      title,
      topic: resolvedTopic,
      duration_minutes: Math.max(3, sanitizedQuestions.length * 2), // 2 mins per question
      total_questions: sanitizedQuestions.length,
      questions: sanitizedQuestions,
    });
  } catch (err: any) {
    console.error('Get questions error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}

export async function submitQuiz(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to submit quiz.' });
    }

    const { quiz_id, topic, answers, time_spent_seconds } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Answers object is required.' });
    }

    const problemIds = Object.keys(answers).map(id => parseInt(id, 10));
    const questions: Problem[] = [];

    for (const pid of problemIds) {
      const prob = inMemoryDb.getProblemById(pid);
      if (prob) {
        questions.push(prob);
      }
    }

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid questions found for answers provided.' });
    }

    // Calculate score
    const result = calculateQuizScore(questions, answers);

    // Record score in database
    const finalQuizId = typeof quiz_id === 'number' && quiz_id > 0 ? quiz_id : 1;
    const newScore = inMemoryDb.createScore({
      user_id: req.user.id,
      quiz_id: finalQuizId,
      score: result.score,
      total_questions: result.totalQuestions,
    });

    return res.json({
      success: true,
      message: 'Quiz submitted and evaluated successfully!',
      result: {
        score_id: newScore.id,
        score: result.score,
        correct_count: result.correctCount,
        total_questions: result.totalQuestions,
        passed: result.score >= 60,
        time_spent_seconds: time_spent_seconds || 0,
        date_taken: newScore.date_taken,
        details: result.details,
      },
    });
  } catch (err: any) {
    console.error('Submit quiz error:', err);
    return res.status(500).json({ success: false, message: 'Server error evaluating quiz', error: err.message });
  }
}
