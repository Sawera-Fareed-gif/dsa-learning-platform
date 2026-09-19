import { Response } from 'express';
import { inMemoryDb } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getUserDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.id;
    const scores = inMemoryDb.getUserScores(userId);

    const quizzesTaken = scores.length;
    let totalScoreSum = 0;
    let totalProblemsAttempted = 0;
    let highestScore = 0;

    const topicStats: Record<string, { totalScore: number; attempts: number; avgScore: number }> = {};

    const progressOverTime = scores.map((s, index) => {
      totalScoreSum += s.score;
      totalProblemsAttempted += s.total_questions || 5;
      if (s.score > highestScore) {
        highestScore = s.score;
      }

      const topicName = s.topic || 'General';
      if (!topicStats[topicName]) {
        topicStats[topicName] = { totalScore: 0, attempts: 0, avgScore: 0 };
      }
      topicStats[topicName].totalScore += s.score;
      topicStats[topicName].attempts += 1;

      return {
        id: s.id,
        attempt_number: index + 1,
        date: s.date_taken.split(' ')[0], // YYYY-MM-DD
        timestamp: s.date_taken,
        score: s.score,
        quiz_title: s.quiz_title || 'DSA Assessment',
        topic: s.topic || 'General',
        total_questions: s.total_questions,
      };
    });

    // Compute topic averages
    Object.keys(topicStats).forEach(t => {
      topicStats[t].avgScore = Math.round(topicStats[t].totalScore / topicStats[t].attempts);
    });

    const averageScore = quizzesTaken > 0 ? Math.round(totalScoreSum / quizzesTaken) : 0;

    return res.json({
      success: true,
      stats: {
        problems_attempted: totalProblemsAttempted,
        quizzes_taken: quizzesTaken,
        average_score: averageScore,
        highest_score: highestScore,
        total_score: totalScoreSum,
      },
      progress_over_time: progressOverTime,
      topic_breakdown: Object.entries(topicStats).map(([topic, data]) => ({
        topic,
        attempts: data.attempts,
        average_score: data.avgScore,
      })),
      recent_activity: [...progressOverTime].reverse().slice(0, 5),
    });
  } catch (err: any) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving dashboard data', error: err.message });
  }
}
