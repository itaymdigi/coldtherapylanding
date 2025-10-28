import { Activity, LogIn, LogOut, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, logout as logoutApi } from '../../api/auth';
import AuthModal from '../AuthModal';
import LivePracticeTimer from '../LivePracticeTimer';
import SessionHistory from '../SessionHistory';

const SECTION_ID = 'live-practice';

export default function LivePractice({ language = 'he' }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('timer');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerifiedSession, setHasVerifiedSession] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
    setActiveTab('timer');
    setHasVerifiedSession(false);
  }, []);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setHasVerifiedSession(true);
  }, []);

  const handleSessionSaved = () => {
    // Optionally switch to history tab after saving
    setActiveTab('history');
  };

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        setIsVerifying(true);
        const profile = await getCurrentUser();
        if (!profile) {
          setUser(null);
          setActiveTab('timer');
          setHasVerifiedSession(true);
          return;
        }
        setUser(profile);
        setHasVerifiedSession(true);
      } catch (error) {
        console.error('Failed to load current user:', error);
        setUser(null);
        setActiveTab('timer');
        setHasVerifiedSession(true);
      } finally {
        setIsVerifying(false);
      }
    }

    if (isVerifying || hasVerifiedSession) {
      return;
    }

    loadCurrentUser();
  }, [isVerifying, hasVerifiedSession]);

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
    },
    en: {
      title: 'Live Training',
      subtitle: 'Track your progress and crush your goals',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Welcome',
      timer: 'Timer',
      history: 'History',
      loginPrompt: 'Login to start tracking your transformation',
    },
  };

  const t = translations[language];

  return (
    <section id={SECTION_ID} className="relative z-20 py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/50 to-black pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="text-cyan-400" size={40} />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {t.title}
            </h2>
          </div>
          <p className="text-xl text-white/70 mb-6">{t.subtitle}</p>

          {/* Auth Section */}
          <div className="flex items-center justify-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <User size={20} className="text-cyan-400" />
                  <span className="font-medium">
                    {t.welcome}, {user.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-full transition-all text-sm font-medium border border-red-500/30"
                >
                  <LogOut size={16} />
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-8 py-3 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <LogIn size={20} />
                {t.login}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {user ? (
          <div className="space-y-8">
            {/* Tabs */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('timer')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  activeTab === 'timer'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {t.timer}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {t.history}
              </button>
            </div>

            {/* Content */}
            <div className="animate-fadeIn">
              {activeTab === 'timer' ? (
                <LivePracticeTimer
                  language={language}
                  gender={user.gender || 'male'}
                  onSessionSaved={handleSessionSaved}
                />
              ) : (
                <SessionHistory language={language} />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-3xl p-12 border border-cyan-500/30 shadow-2xl text-center">
            <div className="mb-6">
              <User className="text-cyan-400 mx-auto mb-4" size={64} />
              <p className="text-xl text-white/80">{t.loginPrompt}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-8 py-4 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              <LogIn size={20} />
              {t.login}
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        language={language}
      />
    </section>
  );
}
