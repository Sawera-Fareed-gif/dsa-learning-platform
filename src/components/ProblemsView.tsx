import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Problem } from '../types';
import { useAuth } from '../context/AuthContext';
import { ProblemDetailModal } from './ProblemDetailModal';
import { AdminAddProblemModal } from './AdminAddProblemModal';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  Code2,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ProblemsViewProps {
  onStartQuiz: (topic: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onStartQuiz, onOpenAuth }) => {
  const { user, isAdmin } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [difficultyCounts, setDifficultyCounts] = useState({ Easy: 0, Medium: 0, Hard: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Notification / feedback
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProblems({
        difficulty: selectedDifficulty,
        topic: selectedTopic,
        search: searchQuery,
      });
      setProblems(data.problems);
      setTopics(data.topics);
      setDifficultyCounts(data.difficultyCounts);
    } catch (err: any) {
      console.error('Error loading problems:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedDifficulty, selectedTopic, searchQuery]);

  const handleDeleteProblem = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this problem from the database?')) {
      return;
    }

    try {
      await api.deleteProblem(id);
      setActionMessage('Problem removed from database successfully.');
      setTimeout(() => setActionMessage(null), 3000);
      fetchProblems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete problem');
    }
  };

  const handleProblemCreated = (newProblem: Problem) => {
    setActionMessage(`Problem "${newProblem.title}" added to MySQL schema!`);
    setTimeout(() => setActionMessage(null), 3500);
    fetchProblems();
  };

  const difficultyColors = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              DSA Problem Directory
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {problems.length} problems available
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Data Structures & Algorithms Repository
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore core algorithm patterns, filter by difficulty or topic, inspect conceptual solutions, and test your knowledge with interactive timed quizzes.
          </p>
        </div>

        {/* Action Button: Admin Add Problem */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              id="admin-add-problem-open-btn"
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add DSA Problem</span>
            </button>
          ) : (
            <button
              id="request-admin-access-btn"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-medium rounded-xl transition-colors"
              title="Sign in as admin to add or manage DSA problems"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Portal Access</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="problem-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search problems by name, topic, or keyword (e.g. Kadane, BFS, Tree)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            {['All', 'Easy', 'Medium', 'Hard'].map(diff => {
              const count = diff === 'All' ? problems.length : difficultyCounts[diff as keyof typeof difficultyCounts] || 0;
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  id={`filter-difficulty-${diff.toLowerCase()}`}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{diff}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium pl-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Topic:
          </span>
          <button
            id="filter-topic-all"
            onClick={() => setSelectedTopic('All')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedTopic === 'All'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            All Topics
          </button>
          {topics.map(t => (
            <button
              key={t}
              id={`filter-topic-${t.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid / Listing */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Querying MySQL schema for problems...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
          <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No problems match your filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or switching difficulty/topic filters to see all available algorithmic problems.
          </p>
          <button
            onClick={() => {
              setSelectedDifficulty('All');
              setSelectedTopic('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map(problem => (
            <div
              key={problem.id}
              id={`problem-card-${problem.id}`}
              onClick={() => setSelectedProblem(problem)}
              className="bg-slate-900/90 hover:bg-slate-850/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md hover:shadow-black/40"
            >
              <div>
                {/* Header: Difficulty & Topic */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-750">
                      {problem.topic}
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      id={`delete-problem-btn-${problem.id}`}
                      onClick={(e) => handleDeleteProblem(e, problem.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Admin: Delete Problem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
                  {problem.title}
                </h3>

                {/* Description snippet */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {problem.description}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  Problem #{problem.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    id={`view-details-btn-${problem.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProblem(problem);
                    }}
                    className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-750 rounded-lg text-xs font-medium"
                  >
                    View Details
                  </button>

                  <button
                    id={`take-topic-quiz-btn-${problem.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartQuiz(problem.topic);
                    }}
                    className="px-2.5 py-1 text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <span>Quiz</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Problem Detail Modal */}
      <ProblemDetailModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        onStartQuiz={onStartQuiz}
      />

      {/* Admin Add Problem Modal */}
      <AdminAddProblemModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onProblemCreated={handleProblemCreated}
        existingTopics={topics}
      />
    </div>
  );
};
