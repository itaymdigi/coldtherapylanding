import { useQuery, useMutation } from 'convex/react';
import { useState } from 'react';
import {
  Award,
  Calendar,
  Clock,
  Flame,
  Star,
  Thermometer,
  Trash2,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { api } from '../../convex/_generated/api';

export default function SessionHistory({ token, language = 'he' }) {
  const sessions = useQuery(api.practiceSessions.getUserSessions, {
    token,
    limit: 20,
  });
  const stats = useQuery(api.practiceSessions.getUserStats, { token });
  const deleteSessionMutation = useMutation(api.practiceSessions.deleteSession);
  const [deletingId, setDeletingId] = useState(null);

  const translations = {
    he: {
      title: 'היסטוריית אימונים',
      stats: 'סטטיסטיקות',
      totalSessions: 'סה"כ אימונים',
      totalTime: 'זמן כולל',
      longestSession: 'אימון הכי ארוך',
      averageSession: 'ממוצע אימון',
      currentStreak: 'רצף נוכחי',
      personalBests: 'שיאים אישיים',
      recentSessions: 'אימונים אחרונים',
      duration: 'משך',
      temperature: 'טמפרטורה',
      mood: 'מצב רוח',
      notes: 'הערות',
      pauses: 'השהיות',
      personalBest: 'שיא אישי',
      delete: 'מחק',
      noSessions: 'עדיין אין אימונים. התחל את האימון הראשון שלך!',
      days: 'ימים',
      excellent: 'מצוין',
      good: 'טוב',
      neutral: 'בסדר',
      challenging: 'מאתגר',
      minutes: 'דקות',
      seconds: 'שניות',
    },
    en: {
      title: 'Session History',
      stats: 'Statistics',
      totalSessions: 'Total Sessions',
      totalTime: 'Total Time',
      longestSession: 'Longest Session',
      averageSession: 'Average Session',
      currentStreak: 'Current Streak',
      personalBests: 'Personal Bests',
      recentSessions: 'Recent Sessions',
      duration: 'Duration',
      temperature: 'Temperature',
      mood: 'Mood',
      notes: 'Notes',
      pauses: 'Pauses',
      personalBest: 'Personal Best',
      delete: 'Delete',
      noSessions: 'No sessions yet. Start your first practice!',
      days: 'days',
      excellent: 'Excellent',
      good: 'Good',
      neutral: 'Neutral',
      challenging: 'Challenging',
      minutes: 'minutes',
      seconds: 'seconds',
    },
  };

  const t = translations[language];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}${t.seconds}`;
    }
    return secs > 0 ? `${mins}${t.minutes} ${secs}${t.seconds}` : `${mins}${t.minutes}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (sessionId) => {
    if (confirm(language === 'he' ? 'האם למחוק אימון זה?' : 'Delete this session?')) {
      setDeletingId(sessionId);
      try {
        await deleteSessionMutation({ token, sessionId });
      } catch (error) {
        console.error('Error deleting session:', error);
        alert(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      excellent: '😄',
      good: '🙂',
      neutral: '😐',
      challenging: '😅',
    };
    return emojis[mood] || '';
  };

  if (!stats || !sessions) {
    return (
      <div className="text-center text-white/70 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-cyan-400" size={28} />
          {t.stats}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-cyan-400" size={20} />
              <div className="text-white/70 text-sm">{t.totalSessions}</div>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalSessions}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-purple-400" size={20} />
              <div className="text-white/70 text-sm">{t.totalTime}</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatDuration(stats.totalDuration)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-green-400" size={20} />
              <div className="text-white/70 text-sm">{t.longestSession}</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatDuration(stats.longestSession)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-orange-400" size={20} />
              <div className="text-white/70 text-sm">{t.averageSession}</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatDuration(stats.averageSession)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-red-400" size={20} />
              <div className="text-white/70 text-sm">{t.currentStreak}</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.currentStreak} {t.days}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-yellow-400" size={20} />
              <div className="text-white/70 text-sm">{t.personalBests}</div>
            </div>
            <div className="text-3xl font-bold text-white">{stats.personalBests}</div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="text-cyan-400" size={28} />
          {t.recentSessions}
        </h3>

        {sessions.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center text-white/70">
            {t.noSessions}
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Clock className="text-cyan-400" size={18} />
                        <span className="text-xl font-bold text-white">
                          {formatDuration(session.duration)}
                        </span>
                      </div>

                      {session.personalBest && (
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30 flex items-center gap-1">
                          <Trophy size={14} />
                          {t.personalBest}
                        </span>
                      )}

                      <span className="text-white/50 text-sm">
                        {formatDate(session.completedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap text-sm">
                      {session.temperature && (
                        <div className="flex items-center gap-1 text-white/70">
                          <Thermometer size={16} className="text-blue-400" />
                          {session.temperature}°C
                        </div>
                      )}

                      {session.mood && (
                        <div className="flex items-center gap-1 text-white/70">
                          <span className="text-lg">{getMoodEmoji(session.mood)}</span>
                          <span>{t[session.mood]}</span>
                        </div>
                      )}

                      {session.rating && (
                        <div className="flex items-center gap-1 text-white/70">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`star-${session._id}-${i}`}
                              size={16}
                              className={`${
                                i < session.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <div className="text-white/60 text-sm italic bg-white/5 rounded-lg p-2">
                        "{session.notes}"
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(session._id)}
                    disabled={deletingId === session._id}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
