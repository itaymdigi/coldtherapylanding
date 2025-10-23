import { Play, Pause, Square, Timer, Thermometer, Heart, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useId } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function LivePracticeTimer({ language = 'he', gender = 'male', token, onSessionSaved }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  const [rating, setRating] = useState(0);
  const [showSaveForm, setShowSaveForm] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const saveSessionMutation = useMutation(api.practiceSessions.saveSession);

  const moodEmojis = {
    excellent: '😄',
    good: '🙂',
    neutral: '😐',
    challenging: '😰',
  };

  const translations = {
    he: {
      title: 'טיימר אימון חי',
      start: 'התחל',
      pause: 'השהה',
      resume: 'המשך',
      stop: 'עצור',
      temperature: 'טמפרטורת מים (°C)',
      mood: 'איך הרגשת?',
      rating: 'דירוג האימון',
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
      title: 'Training Timer',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      temperature: 'Water Temperature (°C)',
      mood: 'How did it feel?',
      rating: 'Rate Your Performance',
      notes: 'Session Notes',
      save: 'Save Session',
      cancel: 'Cancel',
      excellent: 'Crushing It! 💪',
      good: 'Strong',
      neutral: 'Solid',
      challenging: 'Tough',
      sessionSaved: 'Session saved! Keep crushing it! 🔥',
      personalBest: '🎉 New Personal Record!',
      pauses: 'Pauses',
    },
  };

  const t = translations[language];

  const temperatureInputId = useId();
  const ratingInputId = useId();
  const notesTextareaId = useId();

  const announceTime = useCallback((seconds) => {
    const speak = (text, lang = 'he-IL') => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'he-IL' ? 'he-IL' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    };

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (language === 'he') {
      const isFemale = gender === 'female';
      const you = isFemale ? 'את' : 'אתה';
      const pastSuffix = isFemale ? 'ה' : '';
      const presentSuffix = isFemale ? 'י' : '';
      const pastSuffixPlural = 'ו';

      let announcement = '';
      let encouragement = '';

      // Proper Hebrew grammar for minutes
      if (minutes === 1) {
        announcement = `דקה אחת עבר${pastSuffix}`;
      } else if (minutes === 2) {
        announcement = `שתי דקות עבר${pastSuffixPlural}`;
      } else if (minutes > 2) {
        announcement = `${minutes} דקות עבר${pastSuffixPlural}`;
      }

      // Add encouraging messages at milestones
      if (minutes > 0) {
        if (minutes === 1) {
          encouragement = `כל הכבוד! ${you} מתחיל${isFemale ? 'ה' : ''} חזק`;
        } else if (minutes === 2) {
          encouragement = `שתי דקות כבר מאחור${isFemale ? 'יך' : 'יך'}! תמשיכ${presentSuffix} ככה`;
        } else if (minutes === 3) {
          encouragement = `מדהים! ${you} בשליטה מלאה`;
        } else if (minutes === 5) {
          encouragement = `חמש דקות של כוח! ${you} גיבור${isFemale ? 'ה' : ''}`;
        } else if (minutes === 10) {
          encouragement = `עשר דקות! זה כבר הישג אמיתי`;
        } else if (minutes % 3 === 0) {
          encouragement = `כל הכבוד! תמשיכ${presentSuffix} ככה`;
        }
      }

      // Combine announcement and encouragement
      const fullMessage = encouragement ? `${announcement}. ${encouragement}` : announcement;

      // Add seconds if not exact minutes
      if (remainingSeconds > 0) {
        const secondsText = remainingSeconds === 1 ? 'שנייה אחת' : `${remainingSeconds} שניות`;
        speak(`${fullMessage}, ועוד ${secondsText}`, 'he-IL');
      } else {
        speak(fullMessage, 'he-IL');
      }
    } else {
      // English version with encouragement
      let announcement = '';
      let encouragement = '';

      if (remainingSeconds === 0) {
        announcement = `${minutes} minutes completed`;
      } else {
        announcement = `${minutes} minutes and ${remainingSeconds} seconds`;
      }

      // Add encouraging messages
      if (minutes > 0) {
        if (minutes === 1) {
          encouragement = 'Great start! Keep going strong!';
        } else if (minutes === 2) {
          encouragement = 'Two minutes down! You\'re doing amazing!';
        } else if (minutes === 3) {
          encouragement = 'Fantastic! You\'ve got this under control!';
        } else if (minutes === 5) {
          encouragement = 'Five minutes of power! You\'re a champion!';
        } else if (minutes === 10) {
          encouragement = 'Ten minutes! That\'s a real achievement!';
        } else if (minutes % 3 === 0) {
          encouragement = 'Well done! Keep it up!';
        }
      }

      const fullMessage = encouragement ? `${announcement}. ${encouragement}` : announcement;
      speak(fullMessage, 'en-US');
    }
  }, [language, gender]);

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
  }, [isRunning, isPaused, announceTime]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    speak(
      language === 'he' ? 'האימון מתחיל' : 'Session starting',
      language === 'he' ? 'he-IL' : 'en-US'
    );
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
    speak(
      language === 'he' ? 'האימון הסתיים' : 'Session complete',
      language === 'he' ? 'he-IL' : 'en-US'
    );

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
        rating: rating || undefined,
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
        setRating(0);
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
    setRating(0);
    setShowSaveForm(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-3xl p-4 md:p-8 border border-cyan-500/30 shadow-2xl">
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
        <Timer className="text-cyan-400" size={24} />
        <h2 className="text-xl md:text-3xl font-bold text-white">{t.title}</h2>
      </div>

      {/* Big Timer Display */}
      <div className="text-center mb-6 md:mb-8">
        <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 font-mono tracking-wider">
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
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-6">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
            >
              <Play size={20} />
              {t.start}
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-xs md:text-sm"
                >
                  <Pause size={18} />
                  {t.pause}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResume}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-xs md:text-sm"
                >
                  <Play size={18} />
                  {t.resume}
                </button>
              )}
              <button
                type="button"
                onClick={handleStop}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
              >
                <Square size={20} />
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
            <label htmlFor={temperatureInputId} className="block text-white/90 mb-2 text-sm font-medium flex items-center gap-2">
              <Thermometer size={18} />
              {t.temperature}
            </label>
            <input
              id={temperatureInputId}
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
              placeholder="10"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor={ratingInputId} className="block text-white/90 mb-2 text-sm font-medium flex items-center gap-2">
              <Heart size={18} />
              {t.mood}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['excellent', 'good', 'neutral', 'challenging'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    mood === m
                      ? 'bg-cyan-500 text-white scale-105'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="text-2xl">{moodEmojis[m]}</span>
                  <span>{t[m]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={ratingInputId} className="block text-white/90 mb-2 text-sm font-medium flex items-center gap-2">
              <Star size={18} />
              {t.rating}
            </label>
            <div id={ratingInputId} className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/30 hover:text-white/50'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={notesTextareaId} className="block text-white/90 mb-2 text-sm font-medium">{t.notes}</label>
            <textarea
              id={notesTextareaId}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all resize-none"
              rows="3"
              placeholder={t.notes}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {t.save}
            </button>
            <button
              type="button"
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
