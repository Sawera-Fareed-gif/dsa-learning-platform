import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Code2,
  Database,
  Server,
  Cloud,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const developer = {
    name: 'Sawera Shehzadi',
    email: 'za3060873@gmail.com',
    role: 'Full-stack developer, BS Software Engineering student',
    bio: 'Passionate Software Engineering undergraduate student focused on designing resilient web architectures, relational database schemas, and intuitive algorithm learning platforms.',
    skills: [
      'React & TypeScript',
      'Node.js & Express',
      'MySQL Database Design',
      'JWT Authentication & Bcrypt',
      'Jest & SWC Unit Testing',
      'Tailwind CSS & Responsive UI',
      'RESTful API Architecture',
      'Asymptotic Complexity Analysis',
    ],
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developer.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Developer Profile & Platform Documentation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About the Developer & System Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Comprehensive project overview, relational database design specification, and production deployment instructions for Vercel, Render, and Railway.
        </p>
      </div>

      {/* Developer Profile Card */}
      <div 
        id="developer-profile-card"
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar / Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-1 shrink-0 shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-white">
              <span className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                SS
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {developer.name}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Software Engineering
              </span>
            </div>

            <p className="text-sm font-medium text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{developer.role}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
              {developer.bio}
            </p>

            {/* Email contact pill */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-slate-200">{developer.email}</span>
                <button
                  id="copy-developer-email-btn"
                  onClick={handleCopyEmail}
                  className="ml-1 p-1 hover:text-white text-slate-400 rounded transition-colors"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <a
                id="mailto-developer-link"
                href={`mailto:${developer.email}`}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Send Direct Email</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Technical Competencies Badges */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Core Technical Stack & Engineering Expertise
          </span>
          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Database Schema & Architecture Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>MySQL Relational Database Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Normalized 3NF relational schema created in <code className="text-emerald-400 font-mono">/server/db/schema.sql</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Table 1: users */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-cyan-300">users</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Table</span>
            </div>
            <p className="text-xs text-slate-400">
              Stores authenticated accounts with unique email constraints, bcrypt hashed passwords (<code className="text-slate-300">password_hash</code>), and role enum ('user', 'admin').
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
              id (PK) • name • email • password_hash • role • created_at
            </div>
          </div>

          {/* Table 2: problems */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-indigo-300">problems</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Table</span>
            </div>
            <p className="text-xs text-slate-400">
              Algorithmic questions catalog indexed by difficulty ('Easy', 'Medium', 'Hard') and topic, plus JSON options and correct answer fields.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
              id (PK) • title • description • difficulty • topic • options • correct_answer • explanation
            </div>
          </div>

          {/* Table 3: quizzes */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-purple-300">quizzes</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Table</span>
            </div>
            <p className="text-xs text-slate-400">
              Curated topical assessments linking arrays of problem IDs in JSON format for dynamic topic retrieval.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
              id (PK) • title • topic • problem_ids (JSON) • duration_minutes
            </div>
          </div>

          {/* Table 4: scores */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-amber-300">scores</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Table</span>
            </div>
            <p className="text-xs text-slate-400">
              Historical ledger of every quiz attempt, linking <code className="text-slate-300">user_id</code> (FK) and <code className="text-slate-300">quiz_id</code> (FK) with evaluation metrics.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
              id (PK) • user_id (FK) • quiz_id (FK) • score • time_spent_seconds • date_taken
            </div>
          </div>

          {/* View: leaderboard_view */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-emerald-300">leaderboard_view</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-mono">SQL View</span>
            </div>
            <p className="text-xs text-slate-400">
              Precomputed aggregation query performing an inner join across users and scores, computing <code className="text-slate-300">SUM(score) AS total_score</code>, <code className="text-slate-300">ROUND(AVG(score), 1) AS average_score</code>, and sorted by descending rank.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
              SELECT u.id, u.name, u.email, SUM(s.score) AS total_score, COUNT(s.id) AS quizzes_taken, ROUND(AVG(s.score), 1) AS average_score ... ORDER BY total_score DESC
            </div>
          </div>
        </div>
      </div>

      {/* Production Deployment Instructions */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <span>Step-by-Step Production Deployment Guide</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed walkthrough to deploy MySQL on Railway/Render, Express API on Render, and React on Vercel.
          </p>
        </div>

        <div className="space-y-5">
          {/* Step 1: Instant Deployment (Zero-Config) */}
          <div 
            id="deploy-step-1"
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="text-base font-bold text-white">
                Zero-Config Deployment (Google Cloud Run & Render)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The platform operates with a self-contained persistent relational data store that writes to <code className="text-emerald-400 font-mono">server/data/store.json</code>. You do <strong>not</strong> need to provision an external database, create cloud database accounts, or supply connection credentials.
            </p>
            <div className="mt-2 p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
              <div className="text-slate-400">// In Google AI Studio / Cloud Run:</div>
              <div className="text-emerald-400">Click &quot;Deploy to Cloud Run&quot; in the AI Studio header. No database configuration required!</div>
              <div className="text-slate-400 pt-2">// In Render / Container hosts:</div>
              <div>Build Command: npm run build</div>
              <div>Start Command: npm start</div>
              <div>Port: 3000</div>
            </div>
          </div>

          {/* Step 2: Optional Cloud SQL / MySQL Integration */}
          <div 
            id="deploy-step-2"
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="text-base font-bold text-white">
                Optional External Database Integration
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your organization requires a managed enterprise database (such as Google Cloud SQL or MySQL on Railway/AWS RDS), standard migration files are included in the repository:
            </p>
            <div className="mt-2 p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
              <div>// Database Schema: <span className="text-indigo-300">server/db/schema.sql</span> (users, problems, quizzes, scores, leaderboard view)</div>
              <div>// Seed Data: <span className="text-indigo-300">server/db/seed.sql</span> (DSA topics, quizzes, curated questions)</div>
            </div>
          </div>

          {/* Step 3: Frontend Static & Edge Deployment */}
          <div 
            id="deploy-step-3"
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-base font-bold text-white">
                Single-Port Full-Stack Serving
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Node.js Express server automatically compiles and serves the modern React + Tailwind client on port 3000 with SPA fallback routing. No separate reverse proxy or CORS configuration is needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
