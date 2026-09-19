import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProblemsView } from './components/ProblemsView';
import { QuizView } from './components/QuizView';
import { DashboardView } from './components/DashboardView';
import { LeaderboardView } from './components/LeaderboardView';
import { AboutView } from './components/AboutView';
import { AuthModal } from './components/AuthModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('problems');
  const [quizTopic, setQuizTopic] = useState<string | null>(null);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleStartQuiz = (topic?: string) => {
    setQuizTopic(topic || null);
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDashboard = () => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToLeaderboard = () => {
    setActiveTab('leaderboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'problems' && (
          <ProblemsView
            onStartQuiz={handleStartQuiz}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            initialTopic={quizTopic}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToLeaderboard={handleNavigateToLeaderboard}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onStartQuiz={handleStartQuiz}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            onStartQuiz={handleStartQuiz}
          />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
