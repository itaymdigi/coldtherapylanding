import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { Activity, Home, LogIn, LogOut, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import AuthModal from '../components/AuthModal';
import LivePracticeTimer from '../components/LivePracticeTimer';
import SessionHistory from '../components/SessionHistory';

export const Route = createFileRoute('/live-practice')({
  component: LivePracticePage,
});

function LivePracticePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('timer');
  const [language, setLanguage] = useState('he');

  const verifiedUser = useQuery(api.auth.verifyToken, token ? { token } : 'skip');

  const handleAuthSuccess = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthModalOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }, []);

  const handleSessionSaved = useCallback(() => {
    // Refresh history by switching tabs
    if (activeTab === 'timer') {
      setActiveTab('history');
      setTimeout(() => setActiveTab('timer'), 100);
    }
  }, [activeTab]);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedLanguage = localStorage.getItem('language') || 'he';

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    if (verifiedUser === null && token) {
      handleLogout();
    } else if (verifiedUser && !user) {
      setUser(verifiedUser);
    }
  }, [verifiedUser, token, user, handleLogout]);

  const translations = {
    he: {
      title: 'אימון חי',
      subtitle: 'עקוב אחר ההתקדמות שלך ושפר את הביצועים',
      login: 'התחבר',
      logout: 'התנתק',
      welcome: 'שלום',
      timer: 'טיימר',
      history: 'היסטוריה',
      loginPrompt: 'התחבר כדי להתחיל לעקוב אחר האימונים שלך',
      backToHome: 'חזרה לדף הבית',
    },
    en: {
      title: 'Live Practice',
      subtitle: 'Track your progress and improve your performance',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Welcome',
      timer: 'Timer',
      history: 'History',
      loginPrompt: 'Login to start tracking your sessions',
      backToHome: 'Back to Home',
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-cyan-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back to Home */}
            <Link
              to="/"
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              <Home size={20} />
              <span className="hidden sm:inline">{t.backToHome}</span>
            </Link>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-white text-center">
              <span className="text-cyan-400">⏱️</span> {t.title}
            </h1>

            {/* Language Toggle & Auth */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newLang = language === 'en' ? 'he' : 'en';
                  setLanguage(newLang);
                  localStorage.setItem('language', newLang);
                }}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all text-sm"
              >
                {language === 'en' ? '🇮🇱' : '🇺🇸'}
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all font-medium text-sm"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">{t.logout}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all font-medium text-sm"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">{t.login}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {user ? (
            <>
              {/* User Welcome */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
                  <User size={20} className="text-cyan-400" />
                  <span className="text-lg">
                    {t.welcome}, <span className="font-bold text-cyan-400">{user.name}</span>
                  </span>
                </div>
                <p className="text-white/60 text-sm">{t.subtitle}</p>
              </div>

              {/* Tabs */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('timer')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'timer'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Activity size={20} />
                  {t.timer}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Activity size={20} />
                  {t.history}
                </button>
              </div>

              {/* Content */}
              <div className="animate-fadeIn">
                {activeTab === 'timer' ? (
                  <LivePracticeTimer
                    user={user}
                    token={token}
                    language={language}
                    gender={user.gender || 'male'}
                    onSessionSaved={handleSessionSaved}
                  />
                ) : (
                  <SessionHistory token={token} language={language} />
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-3xl p-12 border border-cyan-500/30 shadow-2xl max-w-md mx-auto">
                <div className="text-6xl mb-6">⏱️</div>
                <h2 className="text-2xl font-bold text-white mb-4">{t.title}</h2>
                <p className="text-white/70 mb-8">{t.loginPrompt}</p>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <LogIn size={20} />
                  {t.login}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        language={language}
      />
    </div>
  );
}
