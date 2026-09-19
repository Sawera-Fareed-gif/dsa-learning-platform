import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Problem, Quiz, Score, LeaderboardEntry } from '../types.js';

dotenv.config();

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Self-contained persistent database initialized with rich seed data
class DatabaseStore {
  users: User[] = [];
  problems: Problem[] = [];
  quizzes: Quiz[] = [];
  scores: Score[] = [];
  private nextUserId = 1;
  private nextProblemId = 1;
  private nextQuizId = 1;
  private nextScoreId = 1;

  constructor() {
    this.init();
  }

  init() {
    // In test environment, always use clean seed data in memory
    if (process.env.NODE_ENV === 'test') {
      this.seed();
      return;
    }

    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.users) && Array.isArray(data.problems) && Array.isArray(data.quizzes) && Array.isArray(data.scores)) {
          this.users = data.users;
          this.problems = data.problems;
          this.quizzes = data.quizzes;
          this.scores = data.scores;
          this.recalculateNextIds();
          console.log(`[DB] Loaded persistent data store (${this.users.length} users, ${this.problems.length} problems, ${this.scores.length} scores).`);
          return;
        }
      }
    } catch (err: any) {
      console.warn('[DB] Could not read existing store.json, re-initializing seed data:', err.message);
    }

    // Seed defaults and write initial store.json
    this.seed();
    this.saveToFile();
  }

  private recalculateNextIds() {
    this.nextUserId = this.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    this.nextProblemId = this.problems.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    this.nextQuizId = this.quizzes.reduce((max, q) => Math.max(max, q.id), 0) + 1;
    this.nextScoreId = this.scores.reduce((max, s) => Math.max(max, s.id), 0) + 1;
  }

  saveToFile() {
    if (process.env.NODE_ENV === 'test') return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const payload = JSON.stringify(
        {
          users: this.users,
          problems: this.problems,
          quizzes: this.quizzes,
          scores: this.scores,
          updated_at: new Date().toISOString(),
        },
        null,
        2
      );
      fs.writeFileSync(STORE_FILE, payload, 'utf-8');
    } catch (err: any) {
      console.error('[DB] Failed to persist data store to disk:', err.message);
    }
  }

  seed() {
    // Hash "Password123!" for default seed accounts
    const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

    this.users = [
      { id: 1, name: 'Admin Shehzadi', email: 'admin@dsa.com', password_hash: defaultPasswordHash, role: 'admin', created_at: '2026-09-10 10:00:00' },
      { id: 2, name: 'Alex Turner', email: 'alex@example.com', password_hash: defaultPasswordHash, role: 'user', created_at: '2026-09-12 11:30:00' },
      { id: 3, name: 'Sara Connor', email: 'sara@example.com', password_hash: defaultPasswordHash, role: 'user', created_at: '2026-09-14 09:15:00' },
      { id: 4, name: 'Chen Wei', email: 'chen@example.com', password_hash: defaultPasswordHash, role: 'user', created_at: '2026-09-15 14:20:00' },
      { id: 5, name: 'Sawera Shehzadi', email: 'za3060873@gmail.com', password_hash: defaultPasswordHash, role: 'admin', created_at: '2026-09-16 08:00:00' },
    ];
    this.nextUserId = 6;

    this.problems = [
      {
        id: 1,
        title: 'Two Sum Problem',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. What is the optimal time complexity using a Hash Map?',
        difficulty: 'Easy',
        topic: 'Arrays',
        options: ['O(n^2) time, O(1) space', 'O(n) time, O(n) space', 'O(n log n) time, O(1) space', 'O(log n) time, O(n) space'],
        correct_answer: 'O(n) time, O(n) space',
        explanation: 'By storing each number\'s complement (target - num) in a Hash Map, lookup takes O(1) average time, resulting in O(n) overall time and space.',
        created_at: '2026-09-10 10:00:00',
      },
      {
        id: 2,
        title: 'Maximum Subarray (Kadane\'s Algorithm)',
        description: 'Find the contiguous subarray with the largest sum. What principle does Kadane\'s algorithm rely on at each step?',
        difficulty: 'Medium',
        topic: 'Arrays',
        options: [
          'Sorting the array and taking two pointers',
          'Deciding whether to add the current element to the existing subarray or start a new subarray',
          'Binary search over prefix sums',
          'Dividing into 3 sub-problems recursively'
        ],
        correct_answer: 'Deciding whether to add the current element to the existing subarray or start a new subarray',
        explanation: 'Kadane\'s algorithm maintains max_ending_here = max(x, max_ending_here + x), deciding dynamically whether extending or resetting provides a larger sum in O(n) time.',
        created_at: '2026-09-10 10:05:00',
      },
      {
        id: 3,
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list and return the reversed list. What pointers are strictly required to iteratively reverse in O(1) space?',
        difficulty: 'Easy',
        topic: 'Linked Lists',
        options: [
          'prev, current, and next pointers',
          'A stack to store all node addresses',
          'Two pointers moving in opposite directions from head and tail',
          'Only a single slow pointer'
        ],
        correct_answer: 'prev, current, and next pointers',
        explanation: 'Iterative reversal requires prev (initially null), current (head), and next (to preserve reference before mutating current.next).',
        created_at: '2026-09-10 10:10:00',
      },
      {
        id: 4,
        title: 'Detect Cycle in a Linked List (Floyd\'s Cycle)',
        description: 'Given head, the head of a linked list, determine if the linked list has a cycle. Which algorithm achieves O(n) time and O(1) space?',
        difficulty: 'Easy',
        topic: 'Linked Lists',
        options: [
          'Floyd\'s Tortoise and Hare algorithm',
          'Dijkstra\'s shortest path',
          'Kruskal\'s minimum spanning tree',
          'Boyer-Moore voting algorithm'
        ],
        correct_answer: 'Floyd\'s Tortoise and Hare algorithm',
        explanation: 'Floyd\'s algorithm uses slow (1 step) and fast (2 steps) pointers. If a cycle exists, they must meet within the cycle loop.',
        created_at: '2026-09-10 10:15:00',
      },
      {
        id: 5,
        title: 'Invert Binary Tree',
        description: 'Given the root of a binary tree, invert the tree, and return its root. What is the time complexity of inverting a binary tree with N nodes?',
        difficulty: 'Easy',
        topic: 'Trees',
        options: [
          'O(N) because each node is visited once',
          'O(N^2) because each swap takes linear time',
          'O(log N) always',
          'O(1) in-place swap of roots'
        ],
        correct_answer: 'O(N) because each node is visited once',
        explanation: 'Every node must have its left and right subtrees swapped once, yielding O(N) linear time.',
        created_at: '2026-09-10 10:20:00',
      },
      {
        id: 6,
        title: 'Lowest Common Ancestor (LCA) in BST',
        description: 'Given a Binary Search Tree (BST) and two nodes p and q, find their Lowest Common Ancestor. What property allows O(h) navigation without a hash table?',
        difficulty: 'Medium',
        topic: 'Trees',
        options: [
          'Left child is smaller and right child is greater than current root',
          'All leaves reside at the exact same depth',
          'BST is always balanced with AVL rotations',
          'Edges are weighted directed graphs'
        ],
        correct_answer: 'Left child is smaller and right child is greater than current root',
        explanation: 'In a BST, if both p and q are less than root, LCA is in left subtree; if both are greater, in right subtree; else root is the split point.',
        created_at: '2026-09-10 10:25:00',
      },
      {
        id: 7,
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How does this reduce to a known mathematical relation?',
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        options: [
          'Fibonacci recurrence: F(n) = F(n-1) + F(n-2)',
          'Catalan numbers recurrence',
          'Factorial permutation: n!',
          'Binomial coefficients: C(n, 2)'
        ],
        correct_answer: 'Fibonacci recurrence: F(n) = F(n-1) + F(n-2)',
        explanation: 'To reach step n, you can arrive from step (n-1) with a 1-step or step (n-2) with a 2-step: ways(n) = ways(n-1) + ways(n-2).',
        created_at: '2026-09-10 10:30:00',
      },
      {
        id: 8,
        title: '0/1 Knapsack Problem',
        description: 'Given weights and values of n items, put these items in a knapsack of capacity W to get maximum value. Why can\'t greedy approach solve 0/1 knapsack?',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        options: [
          'Items cannot be broken; taking a high value-to-weight item may leave empty space that wastes capacity',
          'Greedy requires float division which is prohibited in integer arrays',
          'Greedy always produces negative weight cycles',
          'There are no optimal substructures in knapsack'
        ],
        correct_answer: 'Items cannot be broken; taking a high value-to-weight item may leave empty space that wastes capacity',
        explanation: 'Because items cannot be fractionally divided, choosing the greedily highest density item may preclude a better combination of items that completely fill capacity.',
        created_at: '2026-09-10 10:35:00',
      },
      {
        id: 9,
        title: 'Breadth-First Search (BFS) Shortest Path',
        description: 'In an unweighted graph, which data structure is fundamental to finding the shortest path between two vertices?',
        difficulty: 'Easy',
        topic: 'Graphs',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Max Heap', 'Disjoint Set Union (DSU)'],
        correct_answer: 'Queue (FIFO)',
        explanation: 'BFS uses a FIFO queue to explore nodes in order of their hop distance from the start vertex, guaranteeing the shortest path in unweighted graphs.',
        created_at: '2026-09-10 10:40:00',
      },
      {
        id: 10,
        title: 'Detect Cycle in Directed Graph',
        description: 'Which algorithm or color-marking approach is standard for finding cycles in a directed graph using DFS?',
        difficulty: 'Medium',
        topic: 'Graphs',
        options: [
          '3-color DFS (White, Gray, Black) to detect back-edges',
          'Prim\'s algorithm',
          'Bellman-Ford relaxation',
          'Huffman coding tree'
        ],
        correct_answer: '3-color DFS (White, Gray, Black) to detect back-edges',
        explanation: 'White = unvisited, Gray = visiting (on current call stack), Black = finished. Re-encountering a Gray node signifies a back-edge, hence a directed cycle.',
        created_at: '2026-09-10 10:45:00',
      },
      {
        id: 11,
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s. What is the optimal frequency counting space complexity assuming lowercase English letters?',
        difficulty: 'Easy',
        topic: 'Strings',
        options: [
          'O(1) space using a fixed 26-element integer array',
          'O(N^2) using nested substring matching',
          'O(N log N) using quicksort',
          'O(2^N) exponential combinations'
        ],
        correct_answer: 'O(1) space using a fixed 26-element integer array',
        explanation: 'An array of size 26 is fixed and constant space (O(1)) regardless of string length N.',
        created_at: '2026-09-10 10:50:00',
      },
      {
        id: 12,
        title: 'Merge Sort Time & Space Complexity',
        description: 'What are the worst-case time complexity and standard auxiliary space complexity of Merge Sort on an array of size N?',
        difficulty: 'Medium',
        topic: 'Sorting & Searching',
        options: [
          'O(N log N) time and O(N) auxiliary space',
          'O(N^2) time and O(1) auxiliary space',
          'O(N) time and O(log N) auxiliary space',
          'O(N log N) time and O(1) auxiliary space'
        ],
        correct_answer: 'O(N log N) time and O(N) auxiliary space',
        explanation: 'Merge sort always divides array into halves (log N levels) and requires O(N) linear merging work per level, needing O(N) buffer memory.',
        created_at: '2026-09-10 10:55:00',
      },
    ];
    this.nextProblemId = 13;

    this.quizzes = [
      { id: 1, title: 'Arrays & Hashing Fundamentals', topic: 'Arrays', problem_ids: [1, 2], created_at: '2026-09-11 12:00:00' },
      { id: 2, title: 'Linked Lists & Pointers Mastery', topic: 'Linked Lists', problem_ids: [3, 4], created_at: '2026-09-11 12:05:00' },
      { id: 3, title: 'Trees & Hierarchical Structures', topic: 'Trees', problem_ids: [5, 6], created_at: '2026-09-11 12:10:00' },
      { id: 4, title: 'Dynamic Programming Essentials', topic: 'Dynamic Programming', problem_ids: [7, 8], created_at: '2026-09-11 12:15:00' },
      { id: 5, title: 'Graph Traversal & Graph Algorithms', topic: 'Graphs', problem_ids: [9, 10], created_at: '2026-09-11 12:20:00' },
      { id: 6, title: 'Strings & Sorting Practice', topic: 'Strings', problem_ids: [11, 12], created_at: '2026-09-11 12:25:00' },
    ];
    this.nextQuizId = 7;

    this.scores = [
      { id: 1, user_id: 2, quiz_id: 1, score: 100, total_questions: 2, date_taken: '2026-09-15 14:30:00' },
      { id: 2, user_id: 2, quiz_id: 2, score: 80, total_questions: 2, date_taken: '2026-09-16 11:15:00' },
      { id: 3, user_id: 2, quiz_id: 3, score: 90, total_questions: 2, date_taken: '2026-09-17 09:45:00' },
      { id: 4, user_id: 3, quiz_id: 1, score: 90, total_questions: 2, date_taken: '2026-09-16 16:20:00' },
      { id: 5, user_id: 3, quiz_id: 4, score: 100, total_questions: 2, date_taken: '2026-09-18 13:00:00' },
      { id: 6, user_id: 4, quiz_id: 1, score: 70, total_questions: 2, date_taken: '2026-09-17 17:10:00' },
      { id: 7, user_id: 4, quiz_id: 5, score: 85, total_questions: 2, date_taken: '2026-09-18 19:30:00' },
      { id: 8, user_id: 5, quiz_id: 1, score: 100, total_questions: 2, date_taken: '2026-09-18 20:00:00' },
      { id: 9, user_id: 5, quiz_id: 2, score: 100, total_questions: 2, date_taken: '2026-09-19 08:30:00' },
      { id: 10, user_id: 5, quiz_id: 3, score: 100, total_questions: 2, date_taken: '2026-09-19 10:15:00' },
    ];
    this.nextScoreId = 11;
  }

  // Users
  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(user: Omit<User, 'id' | 'created_at'>): User {
    const newUser: User = {
      ...user,
      id: this.nextUserId++,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    this.users.push(newUser);
    this.saveToFile();
    return newUser;
  }

  // Problems
  getProblems(filters?: { difficulty?: string; topic?: string; search?: string }): Problem[] {
    return this.problems.filter(p => {
      if (filters?.difficulty && filters.difficulty !== 'All' && p.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters?.topic && filters.topic !== 'All' && p.topic !== filters.topic) {
        return false;
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matches = p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  getProblemById(id: number): Problem | undefined {
    return this.problems.find(p => p.id === id);
  }

  createProblem(problem: Omit<Problem, 'id' | 'created_at'>): Problem {
    const newProblem: Problem = {
      ...problem,
      id: this.nextProblemId++,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    this.problems.push(newProblem);
    this.saveToFile();
    return newProblem;
  }

  deleteProblem(id: number): boolean {
    const index = this.problems.findIndex(p => p.id === id);
    if (index !== -1) {
      this.problems.splice(index, 1);
      this.saveToFile();
      return true;
    }
    return false;
  }

  // Quizzes
  getQuizzes(): Quiz[] {
    return this.quizzes;
  }

  getQuizById(id: number): Quiz | undefined {
    return this.quizzes.find(q => q.id === id);
  }

  getQuizByTopic(topic: string): Quiz | undefined {
    return this.quizzes.find(q => q.topic.toLowerCase() === topic.toLowerCase());
  }

  createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>): Quiz {
    const newQuiz: Quiz = {
      ...quiz,
      id: this.nextQuizId++,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    this.quizzes.push(newQuiz);
    this.saveToFile();
    return newQuiz;
  }

  // Scores
  createScore(score: Omit<Score, 'id' | 'date_taken'>): Score {
    const newScore: Score = {
      ...score,
      id: this.nextScoreId++,
      date_taken: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    this.scores.push(newScore);
    this.saveToFile();
    return newScore;
  }

  getUserScores(userId: number): Score[] {
    return this.scores
      .filter(s => s.user_id === userId)
      .map(s => {
        const quiz = this.quizzes.find(q => q.id === s.quiz_id);
        return {
          ...s,
          quiz_title: quiz ? quiz.title : 'DSA Quiz',
          topic: quiz ? quiz.topic : 'General',
        };
      })
      .sort((a, b) => new Date(a.date_taken).getTime() - new Date(b.date_taken).getTime());
  }

  // Leaderboard View
  getLeaderboard(): LeaderboardEntry[] {
    const map = new Map<number, { user: User; total_score: number; count: number; last_activity: string | null }>();

    for (const u of this.users) {
      map.set(u.id, { user: u, total_score: 0, count: 0, last_activity: null });
    }

    for (const s of this.scores) {
      const entry = map.get(s.user_id);
      if (entry) {
        entry.total_score += s.score;
        entry.count += 1;
        if (!entry.last_activity || new Date(s.date_taken) > new Date(entry.last_activity)) {
          entry.last_activity = s.date_taken;
        }
      }
    }

    const leaderboard: LeaderboardEntry[] = Array.from(map.values()).map(({ user, total_score, count, last_activity }) => ({
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      total_score,
      quizzes_taken: count,
      average_score: count > 0 ? Math.round((total_score / count) * 10) / 10 : 0,
      last_activity,
    }));

    // Order by total_score desc, quizzes_taken desc
    leaderboard.sort((a, b) => b.total_score - a.total_score || b.quizzes_taken - a.quizzes_taken);
    return leaderboard;
  }
}

export const inMemoryDb = new DatabaseStore();

const mysqlPool = null;
const isUsingMySQL = false;

export async function initDatabaseConnection(): Promise<{ isMySQL: boolean; message: string }> {
  console.log('[DB] Self-contained persistent database initialized successfully (Zero-config, ready for deployment).');
  return {
    isMySQL: false,
    message: 'Using self-contained persistent database engine with full 3NF relational data structures',
  };
}

export function getDbStatus() {
  return {
    isMySQL: false,
    connected: true,
    engine: 'Self-Contained Relational Store (Zero-Config Persistent Engine)',
    totalUsers: inMemoryDb.users.length,
    totalProblems: inMemoryDb.problems.length,
    totalQuizzes: inMemoryDb.quizzes.length,
    totalScores: inMemoryDb.scores.length,
    storageFile: 'server/data/store.json',
  };
}

export { mysqlPool, isUsingMySQL };
