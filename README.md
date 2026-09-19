#  DSA Learning Project — DSA Online Learning & Quiz Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey?logo=express&logoColor=black)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.1-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Jest_Tests-28%20Passed-brightgreen?logo=jest&logoColor=white)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A production-ready, full-stack Data Structures and Algorithms (DSA) learning and assessment web application featuring problem catalogs, interactive timed quizzes, real-time analytics, user authentication, and a competitive global leaderboard.

---

## 📌 Overview

** DSA Learning Project** is designed for software engineering students, interview candidates, and computer science enthusiasts looking to master fundamental and advanced DSA concepts. The application provides an end-to-end learning loop: read and filter algorithmic challenges, test comprehension under timed quiz conditions, receive question-level explanations, track performance milestones on a personal dashboard, and compete on a global leaderboard.

---

## ✨ Features

### 1. 📚 Algorithmic Problem Catalog
- Curated challenges covering key algorithmic domains:
  - **Arrays & Hashing**
  - **Linked Lists**
  - **Trees & Binary Search Trees**
  - **Dynamic Programming**
  - **Graphs & BFS/DFS**
  - **Strings**
  - **Sorting & Searching**
- Filter by topic and difficulty level (*Easy*, *Medium*, *Hard*).
- Real-time search query matching across problem titles and descriptions.
- Detailed modal views containing time/space complexity analysis and key takeaways.
- **Admin Management**: Authorized administrators can create new questions or delete existing problems directly from the UI.

### 2. ⏱️ Interactive Timed Quizzes
- Topic-specific quizzes with configurable durations.
- Live countdown timer with auto-submit on expiration.
- Question navigation bar with answered/unanswered indicators.
- Instant grading with complete performance breakdown:
  - Total percentage score and performance status badge.
  - Question-by-question review highlighting selected answers vs. correct answers.
  - Comprehensive algorithmic explanations for each question.

### 3. 📊 Learner Analytics Dashboard
- Key performance metrics:
  - Total problems attempted
  - Quizzes completed
  - Average score percentage
  - Peak quiz score
- **Interactive SVG Chart**: Visualizes score progress over time with gradient fills and tooltips.
- Topic mastery progress bars reflecting proficiency across data structure domains.
- Complete historical quiz attempt log with timestamps, scores, and duration.

### 4. 🏆 Global Leaderboard
- Top learner rankings based on cumulative points and overall accuracy.
- Podium display for 1st (🥇), 2nd (🥈), and 3rd (🥉) rank holders.
- Tier designations based on total score:
  - *Grandmaster* (≥ 2000 pts)
  - *Master* (≥ 1200 pts)
  - *Expert* (≥ 700 pts)
  - *Specialist* (≥ 300 pts)
  - *Apprentice* (< 300 pts)
- Highlight indicator for the currently signed-in user.

### 5. 🔐 Authentication & Role-Based Authorization
- Secure JWT-based stateless authentication with 7-day expiration tokens.
- Password hashing with **bcryptjs** (10 salt rounds).
- Client-side validation: real-time email regex validation, password length checks, and matching confirmation.
- Role-based route authorization (`requireAuth` and `requireAdmin` middlewares).
- One-click demo accounts for quick testing (*Student Demo* and *Admin Demo*).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide React, Canvas Confetti |
| **Backend** | Node.js (v20+), Express 4, RESTful API architecture |
| **Persistence** | Persistent JSON-backed relational storage engine (`server/data/store.json`) + Optional 3NF MySQL schema (`server/db/schema.sql`) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), Input sanitization |
| **Testing** | Jest 29, Supertest, ts-jest (28 passing unit & integration test suites) |
| **Packaging** | Single-bundle deployment with `esbuild`, unified single-port routing |

```
├── index.html                   # HTML entry point with SEO meta tags
├── metadata.json                # Project configuration
├── package.json                 # Dependencies and build scripts
├── server.ts                    # Root full-stack server entry point (Vite + Express)
├── server/
│   ├── data/
│   │   └── store.json           # Disk-backed persistent database
│   ├── db/
│   │   ├── schema.sql           # MySQL 3NF schema (Users, Problems, Quizzes, Scores, Leaderboard)
│   │   └── seed.sql             # SQL seed dataset
│   ├── src/
│   │   ├── config/db.ts         # Database store implementation
│   │   ├── controllers/         # Auth, problems, quiz, dashboard, and leaderboard handlers
│   │   ├── middleware/auth.ts   # JWT and role validation middleware
│   │   └── routes/api.ts        # Express REST API route definitions
│   └── tests/                   # Jest unit and integration tests (28 tests)
└── src/
    ├── components/              # UI views (Navbar, Problems, Quiz, Dashboard, Leaderboard, About, Footer)
    ├── context/AuthContext.tsx  # React authentication state and token management
    └── services/api.ts          # Typed client-side API service
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/algocraft-dsa-platform.git
   cd algocraft-dsa-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional):**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   > **Note:** The application includes safe defaults and a built-in persistent data store. No external database configuration is required to run the project.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

The project includes unit and integration tests covering password hashing, JWT issuance, quiz evaluation algorithms, problem CRUD operations, and dashboard analytics.

Run all test suites:
```bash
npm test
```

Expected output:
```text
PASS server/tests/problems.test.ts
PASS server/tests/quiz.test.ts
PASS server/tests/auth.test.ts

Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        ~5.5 s
```

---

## 🌐 API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/signup` | Public | Register a new learner account |
| `POST` | `/api/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/profile` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/problems` | Public | List DSA problems with filters & counts |
| `GET` | `/api/problems/:id` | Public | Retrieve detailed problem specification |
| `POST` | `/api/problems` | Admin | Create a new DSA challenge |
| `DELETE` | `/api/problems/:id` | Admin | Remove an existing DSA problem |
| `GET` | `/api/quizzes` | Public | Get list of available topical quizzes |
| `GET` | `/api/quiz/questions` | Public | Fetch quiz questions (answers stripped) |
| `POST` | `/api/quiz/submit` | Authenticated | Submit quiz, compute score & record result |
| `GET` | `/api/dashboard` | Authenticated | Retrieve learner performance metrics & charts |
| `GET` | `/api/leaderboard` | Public | Fetch top-ranked learners & rankings |
| `GET` | `/api/db-status` | Public | Check database store connection status |

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
```
This builds both the Vite client assets and bundles the Node.js server to `dist/server.cjs`.

### Start in Production
```bash
npm start
```

### Deployment Targets

- **Google Cloud Run**: Click *Deploy to Cloud Run* directly within Google AI Studio.
- **Render / Railway**:
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Port: `3000`
- **Vercel / Netlify**: Build static assets with `npm run build` targeting the `dist` folder.

---

## 👤 Author

**Sawera Shehzadi**  
*BS Software Engineering Student & Full-Stack Developer*  
- **Email**: [za3060873@gmail.com](mailto:za3060873@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
