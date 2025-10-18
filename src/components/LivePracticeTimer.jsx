import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Timer, Thermometer, Heart } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function LivePracticeTimer({ user, token, language = 'he', onSessionSaved }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const saveSessionMutation = useMutation(api.practiceSessions.saveSession);

  const translations = {
    he: {
      title: 'טיימר אימון חי',
      start: 'התחל',
      pause: 'השהה',
      resume: 'המשך',
      stop: 'עצור',
      temperature: 'טמפרטורת מים (°C)',
      mood: 'איך הרגשת?',
      notes: 'הערות',
      save: 'שמור אימון',
      cancel: 'ביטול',
      excellent: 'מצוין',
      good: 'טוב',
      neutral: 'בסדר',
      challenging: 'מאתגר',
      sessionSaved: 'האימון נשמר בהצלחה!',
      personalBest: '🎉 שיא אישי חדש!',
      pauses: 'השהיות',
    },
    en: {
      title: 'Live Practice Timer',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      temperature: 'Water Temperature (°C)',
      mood: 'How did you feel?',
      notes: 'Notes',
      save: 'Save Session',
      cancel: 'Cancel',
      excellent: 'Excellent',
      good: 'Good',
      neutral: 'Neutral',
      challenging: 'Challenging',
      sessionSaved: 'Session saved successfully!',
      personalBest: '🎉 New Personal Best!',
      pauses: 'Pauses',
    },
  };

  const t = translations[language];

  // Voice announcements
  const speak = (text, lang = 'he-IL') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'he-IL' ? 'he-IL' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const announceTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (language === 'he') {
      if (remainingSeconds === 0) {
        speak(`${minutes} דקות`, 'he-IL');
      } else {
        speak(`${minutes} דקות ו ${remainingSeconds} שניות`, 'he-IL');
      }
    } else {
      if (remainingSeconds === 0) {
        speak(`${minutes} minutes`, 'en-US');
      } else {
        speak(`${minutes} minutes and ${remainingSeconds} seconds`, 'en-US');
      }
    }
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          
          // Announce every 60 seconds (every minute)
          if (newTime % 60 === 0 && newTime > 0) {
            announceTime(newTime);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, language]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    speak(language === 'he' ? 'האימון מתחיל' : 'Session starting', language === 'he' ? 'he-IL' : 'en-US');
  };

  const handlePause = () => {
    setIsPaused(true);
    setPauseCount((prev) => prev + 1);
    pausedTimeRef.current = Date.now();
    speak(language === 'he' ? 'השהיה' : 'Paused', language === 'he' ? 'he-IL' : 'en-US');
  };

  const handleResume = () => {
    setIsPaused(false);
    speak(language === 'he' ? 'ממשיך' : 'Resuming', language === 'he' ? 'he-IL' : 'en-US');
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    speak(language === 'he' ? 'האימון הסתיים' : 'Session complete', language === 'he' ? 'he-IL' : 'en-US');
    
    if (time > 0) {
      setShowSaveForm(true);
    }
  };

  const handleSave = async () => {
    try {
      const result = await saveSessionMutation({
        token,
        duration: time,
        temperature: temperature ? parseFloat(temperature) : undefined,
        notes: notes || undefined,
        mood: mood || undefined,
        pauseCount,
      });

      if (result.success) {
        if (result.isPersonalBest) {
          speak(
            language === 'he' ? 'שיא אישי חדש! כל הכבוד!' : 'New personal best! Congratulations!',
            language === 'he' ? 'he-IL' : 'en-US'
          );
        }
        
        // Reset
        setTime(0);
        setPauseCount(0);
        setTemperature('');
        setNotes('');
        setMood('');
        setShowSaveForm(false);
        
        if (onSessionSaved) {
          onSessionSaved(result);
        }
      }
    } catch (error) {
      console.error('Error saving session:', error);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setTime(0);
    setPauseCount(0);
    setTemperature('');
    setNotes('');
    setMood('');
    setShowSaveForm(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30 shadow-2xl">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Timer className="text-cyan-400" size={32} />
        <h2 className="text-3xl font-bold text-white">{t.title}</h2>
      </div>

      {/* Big Timer Display */}
      <div className="text-center mb-8">
        <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 font-mono tracking-wider">
          {formatTime(time)}
        </div>
        {pauseCount > 0 && (
          <div className="text-white/70 text-sm">
            {t.pauses}: {pauseCount}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {!showSaveForm && (
        <div className="flex justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Play size={24} />
              {t.start}
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={handlePause}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Pause size={24} />
                  {t.pause}
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Play size={24} />
                  {t.resume}
                </button>
              )}
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Square size={24} />
                {t.stop}
              </button>
            </>
          )}
        </div>
      )}

      {/* Save Form */}
      {showSaveForm && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label className="block text-white/90 mb-2 text-sm font-medium flex items-center gap-2">
              <Thermometer size={18} />
              {t.temperature}
            </label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
              placeholder="10"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-white/90 mb-2 text-sm font-medium flex items-center gap-2">
              <Heart size={18} />
              {t.mood}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['excellent', 'good', 'neutral', 'challenging'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    mood === m
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {t[m]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/90 mb-2 text-sm font-medium">
              {t.notes}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all resize-none"
              rows="3"
              placeholder={t.notes}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {t.save}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
