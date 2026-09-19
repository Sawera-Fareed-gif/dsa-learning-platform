import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserStats, ProgressDataPoint, TopicBreakdown } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  HelpCircle
} from 'lucide-react';

interface DashboardViewProps {
  onStartQuiz: (topic?: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onStartQuiz, onOpenAuth }) => {
  const { isAuthenticated, user, quickDemoLogin } = useAuth();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [progressData, setProgressData] = useState<ProgressDataPoint[]>([]);
  const [topicBreakdown, setTopicBreakdown] = useState<TopicBreakdown[]>([]);
  const [recentActivity, setRecentActivity] = useState<ProgressDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<ProgressDataPoint | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function loadDashboard() {
      setIsLoading(true);
      try {
        const data = await api.getDashboard();
        setStats(data.stats);
        setProgressData(data.progress_over_time);
        setTopicBreakdown(data.topic_breakdown);
        setRecentActivity(data.recent_activity);
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sign In to View Your Performance Analytics
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your personal progress dashboard tracks DSA problems attempted, average accuracy, quiz scores over time, and topic mastery.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            id="dashboard-signin-prompt-btn"
            onClick={() => onOpenAuth('login')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20"
          >
            Sign In to My Account
          </button>
          <button
            id="dashboard-demo-login-btn"
            onClick={() => quickDemoLogin('user')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs rounded-xl"
          >
            Quick Demo as Alex (Student)
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm">Calculating your DSA analytics & progress curve...</p>
      </div>
    );
  }

  // Generate SVG points for the progress chart
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = progressData.map((d, index) => {
    const totalPoints = Math.max(progressData.length - 1, 1);
    const x = paddingX + (index / totalPoints) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.score / 100) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Learner Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Performance & Progress Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Logged in as <span className="text-slate-200 font-semibold">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <button
          id="dashboard-take-quiz-btn"
          onClick={() => onStartQuiz()}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Take New Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Attempted */}
        <div id="stat-card-problems-attempted" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Problems Attempted
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {stats?.problems_attempted || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Questions evaluated in quizzes
          </p>
        </div>

        {/* Quizzes Taken */}
        <div id="stat-card-quizzes-taken" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quizzes Taken
            </span>
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {stats?.quizzes_taken || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Completed assessment sessions
          </p>
        </div>

        {/* Average Score */}
        <div id="stat-card-average-score" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            {stats?.average_score || 0}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Overall accuracy rating
          </p>
        </div>

        {/* Highest Score */}
        <div id="stat-card-highest-score" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Highest Score
            </span>
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-400 tracking-tight">
            {stats?.highest_score || 0}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Personal best record
          </p>
        </div>
      </div>

      {/* Progress Over Time Simple Chart */}
      <div 
        id="dashboard-progress-chart-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Score Progress Over Time</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological tracking of quiz scores across consecutive attempts
            </p>
          </div>
          {hoveredPoint && (
            <div className="hidden sm:block text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold">{hoveredPoint.score}%</span> on{' '}
              <span className="text-slate-300">{hoveredPoint.quiz_title}</span> ({hoveredPoint.date})
            </div>
          )}
        </div>

        {progressData.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No quiz attempts recorded yet. Complete a quiz to see your progress curve!
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 select-none overflow-visible"
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines (0%, 25%, 50%, 75%, 100%) */}
              {[0, 25, 50, 75, 100].map(level => {
                const y = chartHeight - paddingY - (level / 100) * (chartHeight - paddingY * 2);
                return (
                  <g key={level}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* Area gradient */}
              {areaD && <path d={areaD} fill="url(#scoreGradient)" />}

              {/* Line path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.id === pt.data.id;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="transition-all"
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 8}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      #{pt.data.attempt_number}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Row: Topic Mastery & Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Mastery Breakdown */}
        <div 
          id="dashboard-topic-breakdown-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Topic Mastery & Accuracy</span>
            </h3>
            <span className="text-xs text-slate-400">{topicBreakdown.length} Topics Attempted</span>
          </div>

          {topicBreakdown.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No topic data yet.</p>
          ) : (
            <div className="space-y-3.5">
              {topicBreakdown.map(item => (
                <div key={item.topic} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{item.attempts} attempts</span>
                      <span className="font-mono font-bold text-cyan-300">{item.average_score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, item.average_score))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quiz Attempts */}
        <div 
          id="dashboard-recent-activity-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Recent Quiz Sessions</span>
            </h3>
            <span className="text-xs text-slate-400">Stored in MySQL</span>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No recent sessions found.</p>
          ) : (
            <div className="space-y-2.5">
              {recentActivity.map(act => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-400">
                      #{act.attempt_number}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{act.quiz_title}</div>
                      <div className="text-[11px] text-slate-500">{act.date} • {act.topic}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-lg ${
                        act.score >= 70
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {act.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
