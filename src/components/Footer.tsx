import React from 'react';
import { Code2, Heart, Mail, GraduationCap, Github } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">AlgoCraft DSA Platform</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Full-stack Data Structures & Algorithms learning and assessment platform built with React, Node.js/Express, MySQL schema, and JWT authentication.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-300">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Engineered by <strong>Sawera Shehzadi</strong> (BS Software Engineering)</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">Platform Modules</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('problems')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  DSA Problem Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Timed Topic Quizzes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Learner Progress Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Global Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer & Contact */}
          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">Contact & Deployment</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Developer Profile & Deployment
                </button>
              </li>
              <li className="flex items-center gap-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href="mailto:za3060873@gmail.com" className="text-slate-300 hover:text-white font-mono">
                  za3060873@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} AlgoCraft. Designed & Developed by Sawera Shehzadi.</p>
          <div className="flex items-center gap-4">
            <span>MySQL 3NF Relational Schema</span>
            <span>•</span>
            <span>JWT & Bcrypt Security</span>
            <span>•</span>
            <span>Jest Test Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
