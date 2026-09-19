import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { QuizTopic, QuizQuestion, QuizSubmissionResult } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  HelpCircle,
  Layers,
  Sparkles,
  BarChart3,
  Flame,
  BookOpen
} from 'lucide-react';

interface QuizViewProps {
  initialTopic?: string | null;
  onNavigateToDashboard: () => void;
  onNavigateToLeaderboard: () => void;
  onOpenAuth: (mode: 'login') => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialTopic,
  onNavigateToDashboard,
  onNavigateToLeaderboard,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();

  // State: 'select' | 'active' | 'results'
  const [phase, setPhase] = useState<'select' | 'active' | 'results'>('select');

  // Topics listing
  const [topics, setTopics] = useState<QuizTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  // Active quiz state
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic || 'Arrays');
  const [quizId, setQuizId] = useState<number>(1);
  const [quizTitle, setQuizTitle] = useState<string>('DSA Assessment');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  // Timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 mins
  const [totalQuizDuration, setTotalQuizDuration] = useState(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load available topics on mount
  useEffect(() => {
    async function loadTopics() {
      setLoadingTopics(true);
      try {
        const res = await api.getQuizzes();
        setTopics(res.topics);
      } catch (err: any) {
        console.error('Error loading topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    }
    loadTopics();
  }, []);

  // Handle initialTopic prop
  useEffect(() => {
    if (initialTopic) {
      startQuizForTopic(initialTopic);
    }
  }, [initialTopic]);

  // Timer effect
  useEffect(() => {
    if (phase === 'active' && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timeLeftSeconds]);

  const startQuizForTopic = async (topicName: string) => {
    setErrorMessage(null);
    setPhase('active');
    setActiveTopic(topicName);
    setCurrentQuestionIndex(0);
    setUserAnswers({});

    try {
      const res = await api.getQuizQuestions({ topic: topicName });
      setQuizId(res.quiz_id);
      setQuizTitle(res.title);
      setQuestions(res.questions);

      const duration = res.duration_minutes * 60;
      setTimeLeftSeconds(duration);
      setTotalQuizDuration(duration);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start quiz');
      setPhase('select');
    }
  };

  const handleSelectAnswer = (problemId: number, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [problemId]: option,
    }));
  };

  const handleAutoSubmit = () => {
    submitQuizAnswers();
  };

  const submitQuizAnswers = async () => {
    if (!isAuthenticated) {
      onOpenAuth('login');
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    setIsSubmitting(true);
    setErrorMessage(null);

    const timeSpent = totalQuizDuration - timeLeftSeconds;

    try {
      const res = await api.submitQuiz({
        quiz_id: quizId,
        topic: activeTopic,
        answers: userAnswers,
        time_spent_seconds: Math.max(1, timeSpent),
      });

      setSubmissionResult(res.result);
      setPhase('results');

      // Trigger celebratory confetti for high scores!
      if (res.result.score >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // PHASE 1: TOPIC SELECTION
  // =========================================================================
  if (phase === 'select') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Assessments
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select a DSA Topic to Practice
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Each quiz dynamically pulls algorithmic problems from our MySQL repository, tests algorithmic time/space complexities and invariants with a live countdown timer, and logs attempts to your personal progress dashboard.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loadingTopics ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm">Loading topics & question pools...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map(t => (
              <div
                key={t.topic}
                id={`quiz-topic-card-${t.topic.replace(/\s+/g, '-').toLowerCase()}`}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {t.topic}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {t.quizReady} Questions
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {t.topic} Mastery Quiz
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Test your understanding of {t.topic} data structures, pointer manipulations, and asymptotic complexity boundaries.
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      ~{Math.max(4, t.quizReady * 2)} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Easy to Hard
                    </span>
                  </div>
                </div>

                <button
                  id={`start-quiz-btn-${t.topic.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => startQuizForTopic(t.topic)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.01] transition-transform"
                >
                  <span>Start Timed Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // PHASE 2: ACTIVE TIMED QUIZ TAKING
  // =========================================================================
  if (phase === 'active') {
    if (questions.length === 0) {
      return (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p>Preparing quiz session...</p>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const selectedChoice = userAnswers[currentQuestion.id];
    const isTimerWarning = timeLeftSeconds < 60;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Assessment Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {activeTopic}
              </span>
              <h2 className="text-base font-bold text-white">{quizTitle}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Question {currentQuestionIndex + 1} of {totalQuestions} • {answeredCount} answered
            </p>
          </div>

          {/* Countdown Timer */}
          <div
            id="quiz-countdown-timer"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${
              isTimerWarning
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-cyan-300'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimerWarning ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(userAnswers[q.id]);
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                id={`quiz-question-dot-${idx + 1}`}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950'
                    : isAnswered
                    ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Body Card */}
        <div 
          id="quiz-active-question-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
        >
          {/* Question Title & Prompt */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Difficulty: {currentQuestion.difficulty}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQuestion.title}
            </h3>
            <p className="text-sm text-slate-300 mt-2 font-sans leading-relaxed">
              {currentQuestion.description}
            </p>
          </div>

          {/* Answer Options Radio Cards */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Your Answer:
            </p>
            {currentQuestion.options.map((option, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedChoice === option;

              return (
                <div
                  key={optIdx}
                  id={`quiz-option-${currentQuestion.id}-${letter}`}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border text-sm cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation & Submit */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            id="quiz-prev-btn"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {!isLastQuestion ? (
              <button
                id="quiz-next-btn"
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="quiz-submit-btn"
                disabled={isSubmitting}
                onClick={submitQuizAnswers}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Assessment'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PHASE 3: RESULTS SCREEN
  // =========================================================================
  if (phase === 'results' && submissionResult) {
    const isPassed = submissionResult.passed;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Score Summary Card */}
        <div 
          id="quiz-results-summary-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isPassed ? 'Assessment Completed!' : 'Good Effort! Keep Practicing'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Your results have been computed and recorded in the MySQL <code className="text-cyan-400 font-mono">scores</code> table.
          </p>

          {/* Primary Score Metric */}
          <div className="my-6 inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 min-w-[200px]">
            <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              {submissionResult.score}%
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider mt-2 px-2.5 py-0.5 rounded-full border ${
              isPassed
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}>
              {isPassed ? 'Passed' : 'Needs Review'}
            </span>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-left">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Correct</span>
              <p className="text-lg font-bold text-emerald-400">
                {submissionResult.correct_count} / {submissionResult.total_questions}
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Accuracy</span>
              <p className="text-lg font-bold text-white">
                {submissionResult.score}%
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Time Spent</span>
              <p className="text-lg font-bold text-cyan-300">
                {formatTime(submissionResult.time_spent_seconds)}
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Topic</span>
              <p className="text-lg font-bold text-indigo-300 truncate">
                {activeTopic}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              id="retake-quiz-btn"
              onClick={() => startQuizForTopic(activeTopic)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
            <button
              id="choose-another-topic-btn"
              onClick={() => setPhase('select')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Choose Another Topic</span>
            </button>
            <button
              id="view-dashboard-from-results-btn"
              onClick={onNavigateToDashboard}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>View Progress Dashboard</span>
            </button>
            <button
              id="view-leaderboard-from-results-btn"
              onClick={onNavigateToLeaderboard}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Check Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Question-by-Question Algorithmic Breakdown</span>
          </h3>

          <div className="space-y-4">
            {submissionResult.details.map((item, idx) => (
              <div
                key={item.problemId}
                id={`quiz-result-item-${item.problemId}`}
                className={`p-5 rounded-2xl border ${
                  item.isCorrect
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-rose-950/20 border-rose-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      item.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Your Answer</span>
                    <p className={`font-medium mt-1 ${item.isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {item.userAnswer || '(No answer provided)'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Correct Answer</span>
                    <p className="font-medium text-emerald-400 mt-1">
                      {item.correctAnswer}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Algorithmic Insight: </span>
                    <span>{item.explanation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
