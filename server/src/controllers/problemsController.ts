import { Request, Response } from 'express';
import { inMemoryDb } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getProblems(req: Request, res: Response) {
  try {
    const { difficulty, topic, search } = req.query;

    const problems = inMemoryDb.getProblems({
      difficulty: typeof difficulty === 'string' ? difficulty : undefined,
      topic: typeof topic === 'string' ? topic : undefined,
      search: typeof search === 'string' ? search : undefined,
    });

    // Extract all unique topics and counts for UI filtering
    const allProblems = inMemoryDb.problems;
    const topicsSet = new Set<string>();
    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

    for (const p of allProblems) {
      topicsSet.add(p.topic);
      if (p.difficulty in difficultyCounts) {
        difficultyCounts[p.difficulty as keyof typeof difficultyCounts]++;
      }
    }

    return res.json({
      success: true,
      total: problems.length,
      topics: Array.from(topicsSet).sort(),
      difficultyCounts,
      problems: problems.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        topic: p.topic,
        hasQuizSupport: Boolean(p.options && p.options.length > 0),
        created_at: p.created_at,
      })),
    });
  } catch (err: any) {
    console.error('Get problems error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve problems',
      error: err.message,
    });
  }
}

export async function getProblemById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid problem ID.' });
    }

    const problem = inMemoryDb.getProblemById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    return res.json({
      success: true,
      problem,
    });
  } catch (err: any) {
    console.error('Get problem error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}

export async function createProblem(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, description, difficulty, topic, options, correct_answer, explanation } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title is required (minimum 3 characters).',
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description is required (minimum 10 characters).',
      });
    }

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!difficulty || !validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty must be one of: Easy, Medium, Hard.',
      });
    }

    if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required.',
      });
    }

    // Optional quiz options validation
    let sanitizedOptions: string[] | undefined = undefined;
    if (Array.isArray(options) && options.length >= 2) {
      sanitizedOptions = options.map(opt => String(opt).trim()).filter(Boolean);
    }

    const newProblem = inMemoryDb.createProblem({
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
      topic: topic.trim(),
      options: sanitizedOptions,
      correct_answer: correct_answer ? String(correct_answer).trim() : (sanitizedOptions ? sanitizedOptions[0] : undefined),
      explanation: explanation ? String(explanation).trim() : 'Standard algorithmic solution.',
    });

    return res.status(201).json({
      success: true,
      message: 'DSA Problem created successfully!',
      problem: newProblem,
    });
  } catch (err: any) {
    console.error('Create problem error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: err.message,
    });
  }
}

export async function deleteProblem(req: AuthenticatedRequest, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid problem ID.' });
    }

    const deleted = inMemoryDb.deleteProblem(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Problem not found or already deleted.' });
    }

    return res.json({
      success: true,
      message: 'Problem removed successfully.',
    });
  } catch (err: any) {
    console.error('Delete problem error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}
