import React from 'react';
import { Problem } from '../types';
import { X, BookOpen, Layers, CheckCircle, Sparkles, HelpCircle } from 'lucide-react';

interface ProblemDetailModalProps {
  problem: Problem | null;
  onClose: () => void;
  onStartQuiz: (topic: string) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ problem, onClose, onStartQuiz }) => {
  if (!problem) return null;

  const difficultyColors = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        id="problem-detail-modal"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          id="close-problem-detail-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${difficultyColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {problem.topic}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">{problem.title}</h2>

        <div className="space-y-5 text-sm text-slate-300">
          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Problem Statement
            </h3>
            <p className="leading-relaxed font-sans text-slate-200">{problem.description}</p>
          </div>

          {/* Algorithmic Explanation & Complexity */}
          {problem.explanation && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Algorithmic Analysis & Key Insight
              </h3>
              <p className="leading-relaxed text-slate-300 font-sans">{problem.explanation}</p>
            </div>
          )}

          {/* Quiz Assessment Options if available */}
          {problem.options && problem.options.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                Assessment Question Choices
              </h3>
              <div className="space-y-2">
                {problem.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900 text-xs text-slate-300 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-3 justify-end">
          <button
            id="close-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
          >
            Close
          </button>
          <button
            id="start-quiz-from-modal-btn"
            onClick={() => {
              onClose();
              onStartQuiz(problem.topic);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-xl shadow-md shadow-indigo-500/20"
          >
            Practice {problem.topic} Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
