import { Request, Response } from 'express';
import { inMemoryDb } from '../config/db.js';

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const limit = parseInt(String(req.query.limit || '10'), 10);
    const allEntries = inMemoryDb.getLeaderboard();

    const topUsers = allEntries.slice(0, isNaN(limit) ? 10 : limit).map((entry, index) => {
      let badge = 'Apprentice';
      if (entry.total_score >= 250) badge = 'Grandmaster';
      else if (entry.total_score >= 150) badge = 'Master';
      else if (entry.total_score >= 80) badge = 'Expert';

      return {
        rank: index + 1,
        user_id: entry.user_id,
        name: entry.name,
        email: entry.email,
        role: entry.role,
        total_score: entry.total_score,
        quizzes_taken: entry.quizzes_taken,
        average_score: entry.average_score,
        badge,
        last_activity: entry.last_activity,
      };
    });

    return res.json({
      success: true,
      total_participants: allEntries.length,
      leaderboard: topUsers,
    });
  } catch (err: any) {
    console.error('Leaderboard error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving leaderboard', error: err.message });
  }
}
