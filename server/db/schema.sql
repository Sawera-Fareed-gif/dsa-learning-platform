-- ========================================================================
-- DSA ONLINE LEARNING & QUIZ PLATFORM - MYSQL DATABASE SCHEMA MIGRATION
-- Developer: Sawera Shehzadi (za3060873@gmail.com)
-- ========================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dsa_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dsa_platform;

-- Disable foreign key checks for clean re-creation
SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS leaderboard;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================================
-- 1. USERS TABLE
-- Purpose:
--   Stores registered student and administrator user credentials and profiles.
--   Enforces unique email addresses for authentication.
--   Stores salted and hashed passwords (using bcrypt, never plain text).
--   The 'role' field distinguishes regular learners ('user') from instructors/administrators ('admin'),
--   allowing administrators to create new DSA problems while preventing unauthorized problem creation.
-- ========================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 2. PROBLEMS TABLE
-- Purpose:
--   Serves as the central repository for Data Structures & Algorithms practice questions.
--   Contains problem title, detailed problem description/code snippet, difficulty rating
--   (Easy, Medium, Hard), and categorized topic (Arrays, Linked Lists, Trees, Dynamic Programming, etc.).
--   Supports both standalone DSA problem exploration and timed quiz generation with structured
--   options, correct answers, and conceptual algorithmic explanations.
-- ========================================================================
CREATE TABLE problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    topic VARCHAR(100) NOT NULL,
    options JSON NULL COMMENT 'Array of answer choices for interactive quiz assessments',
    correct_answer VARCHAR(255) NULL COMMENT 'The exact correct answer or option text',
    explanation TEXT NULL COMMENT 'Algorithmic explanation and time/space complexity analysis',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_problem_topic (topic),
    INDEX idx_problem_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 3. QUIZZES TABLE
-- Purpose:
--   Represents predefined or dynamically assembled assessment modules.
--   Each quiz has an overarching title (e.g., 'Array Mastery Quiz', 'Dynamic Programming Fundamentals')
--   and stores a JSON array of referenced problem IDs (problem_ids) linking to the problems table.
--   This structure decouples quiz assembly from individual problem definitions, allowing problems
--   to be reused across multiple specialized quizzes.
-- ========================================================================
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    problem_ids JSON NOT NULL COMMENT 'JSON array of integers: [1, 2, 3, 4, 5]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_quiz_topic (topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 4. SCORES TABLE
-- Purpose:
--   Records historical quiz attempts, user performance, and completion timestamps.
--   Links user_id (FK to users) and quiz_id (FK to quizzes) with the earned score and question count.
--   Enables analytics for user dashboards (progress over time, average accuracy, problem counts)
--   and aggregates data for global competitive leaderboards.
-- ========================================================================
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL DEFAULT 5,
    date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scores_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_scores_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_scores_user (user_id),
    INDEX idx_scores_quiz (quiz_id),
    INDEX idx_scores_date (date_taken)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 5. LEADERBOARD VIEW
-- Purpose:
--   Aggregates user scoring data in real-time across the entire platform.
--   Computes:
--     - total_score: Sum of all points accumulated by the user
--     - quizzes_taken: Total count of completed assessments
--     - average_score: Mean score per quiz attempt
--     - last_activity: Most recent quiz submission date
--   Orders users descending by total score to immediately yield the Top 10 rankings.
-- ========================================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    COALESCE(SUM(s.score), 0) AS total_score,
    COUNT(s.id) AS quizzes_taken,
    ROUND(COALESCE(AVG(s.score), 0), 1) AS average_score,
    MAX(s.date_taken) AS last_activity
FROM users u
LEFT JOIN scores s ON u.id = s.user_id
GROUP BY u.id, u.name, u.email, u.role
ORDER BY total_score DESC, quizzes_taken DESC, u.name ASC;
