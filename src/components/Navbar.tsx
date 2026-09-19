import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  BookOpen,
  HelpCircle,
  BarChart3,
  Trophy,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
  Info
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const navItems = [
    { id: 'problems', label: 'DSA Problems', icon: BookOpen },
    { id: 'quiz', label: 'Take Quiz', icon: HelpCircle },
    { id: 'dashboard', label: 'My Progress', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'about', label: 'About Developer', icon: Info },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          id="navbar-brand-button"
          onClick={() => handleNavClick('problems')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AlgoCraft</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                DSA Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Full-Stack Quiz & Learning Engine</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Quick Demo Accounts & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              id="demo-accounts-dropdown-btn"
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
              title="Quick test accounts"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Accounts</span>
            </button>

            {demoDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-750 p-2 shadow-xl shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setDemoDropdownOpen(false)}
              >
                <p className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                  Switch Test Account
                </p>
                <button
                  id="demo-login-admin-btn"
                  onClick={() => quickDemoLogin('admin')}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg hover:bg-slate-800 text-left text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-semibold text-white">Admin (Sawera / Admin)</div>
                      <div className="text-[11px] text-slate-400">Can add & delete problems</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                    Admin
                  </span>
                </button>
                <button
                  id="demo-login-student-btn"
                  onClick={() => quickDemoLogin('user')}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg hover:bg-slate-800 text-left text-slate-200 mt-1"
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">Student (Alex Turner)</div>
                      <div className="text-[11px] text-slate-400">Takes quizzes, tracks stats</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    User
                  </span>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">{user.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <button
                id="navbar-logout-button"
                onClick={logout}
                className="p-2 rounded-lg bg-slate-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-slate-800 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="navbar-login-button"
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                Sign In
              </button>
              <button
                id="navbar-signup-button"
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                id="mobile-demo-admin"
                onClick={() => { quickDemoLogin('admin'); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-purple-950/50 border border-purple-800/50 text-purple-300 text-center"
              >
                Demo Admin
              </button>
              <button
                id="mobile-demo-student"
                onClick={() => { quickDemoLogin('user'); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 text-center"
              >
                Demo Student
              </button>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{user.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-400 font-medium px-2 py-1 hover:bg-red-950/30 rounded"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mobile-signin-btn"
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="py-2 text-sm font-medium text-slate-300 rounded-lg bg-slate-900 border border-slate-800"
                >
                  Sign In
                </button>
                <button
                  id="mobile-signup-btn"
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
