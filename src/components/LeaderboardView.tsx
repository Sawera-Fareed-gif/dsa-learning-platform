import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LeaderboardUser } from '../types';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award, Flame, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

interface LeaderboardViewProps {
  onStartQuiz: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onStartQuiz }) => {
  const { user: currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true);
      try {
        const data = await api.getLeaderboard();
        setLeaderboard(data.leaderboard);
        setTotalParticipants(data.total_participants);
      } catch (err: any) {
        console.error('Error loading leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-extrabold flex items-center justify-center shadow-lg shadow-amber-500/30 text-sm">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-extrabold flex items-center justify-center shadow-md shadow-slate-400/20 text-sm">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-amber-800/20 text-sm">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 font-mono font-bold text-slate-400 flex items-center justify-center text-xs">
        #{rank}
      </div>
    );
  };

  const getMasteryColor = (badge: string) => {
    switch (badge) {
      case 'Grandmaster':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Master':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Expert':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Specialist':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              MySQL Leaderboard View
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {totalParticipants} competitive participants
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Top 10 Algorithmic Champions
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Rankings are computed dynamically by the MySQL <code className="text-amber-400 font-mono">leaderboard_view</code>, aggregating cumulative scores and accuracy percentages across all completed assessments.
          </p>
        </div>

        <button
          id="leaderboard-compete-btn"
          onClick={onStartQuiz}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-[1.02]"
        >
          <span>Compete in a Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm">Querying MySQL leaderboard view...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Silver #2 */}
              <div 
                id="podium-rank-2"
                className="order-2 md:order-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-900 font-extrabold text-xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-white/5">
                    🥈
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Rank #2
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 truncate">
                    {leaderboard[1].name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                    {leaderboard[1].email}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500">Total Score</span>
                    <p className="font-bold text-white font-mono">{leaderboard[1].total_score} pts</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Quizzes</span>
                    <p className="font-bold text-slate-300">{leaderboard[1].quizzes_taken}</p>
                  </div>
                </div>
              </div>

              {/* Gold #1 */}
              <div 
                id="podium-rank-1"
                className="order-1 md:order-2 bg-gradient-to-b from-amber-950/30 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 text-center relative flex flex-col justify-between shadow-xl shadow-amber-500/10 md:-translate-y-2"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-extrabold text-2xl mx-auto flex items-center justify-center mb-3 shadow-xl shadow-amber-500/30">
                    🥇
                  </div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    Champion #1
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-2 truncate">
                    {leaderboard[0].name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                    {leaderboard[0].email}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-amber-400/80 uppercase font-semibold">Total Score</span>
                    <p className="text-xl font-extrabold text-amber-300 font-mono">{leaderboard[0].total_score} pts</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</span>
                    <p className="text-sm font-bold text-white font-mono">{leaderboard[0].average_score}%</p>
                  </div>
                </div>
              </div>

              {/* Bronze #3 */}
              <div 
                id="podium-rank-3"
                className="order-3 md:order-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white font-extrabold text-xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-amber-800/10">
                    🥉
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Rank #3
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 truncate">
                    {leaderboard[2].name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                    {leaderboard[2].email}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500">Total Score</span>
                    <p className="font-bold text-white font-mono">{leaderboard[2].total_score} pts</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Quizzes</span>
                    <p className="font-bold text-slate-300">{leaderboard[2].quizzes_taken}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Top 10 Table */}
          <div 
            id="leaderboard-table-container"
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                    <th className="py-3.5 px-4">Learner</th>
                    <th className="py-3.5 px-4">Tier Badge</th>
                    <th className="py-3.5 px-4 text-right">Total Score</th>
                    <th className="py-3.5 px-4 text-right">Quizzes</th>
                    <th className="py-3.5 px-4 text-right">Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboard.map(user => {
                    const isCurrentUser = currentUser?.email === user.email;
                    return (
                      <tr
                        key={user.user_id}
                        id={`leaderboard-row-${user.rank}`}
                        className={`transition-colors ${
                          isCurrentUser
                            ? 'bg-indigo-950/40 hover:bg-indigo-950/60'
                            : 'hover:bg-slate-850/60'
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {getRankBadge(user.rank)}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-sm">{user.name}</span>
                                {isCurrentUser && (
                                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30">
                                    You
                                  </span>
                                )}
                                {user.role === 'admin' && (
                                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30 flex items-center gap-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Admin
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getMasteryColor(user.badge)}`}>
                            {user.badge}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-extrabold text-sm text-cyan-300">
                            {user.total_score}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-1">pts</span>
                        </td>

                        <td className="py-3 px-4 text-right text-slate-300 font-mono">
                          {user.quizzes_taken}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-bold text-emerald-400">
                            {user.average_score}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
