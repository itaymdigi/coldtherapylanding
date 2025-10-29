import { useEffect, useState } from 'react';
import * as api from '../api';
import { useApp } from '../contexts/AppContext';

const EventSchedulePage = () => {
  const { t } = useApp();
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSchedule = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await api.getActiveScheduleImage();
        if (!isMounted) return;
        setSchedule(result ?? null);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
        setSchedule(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSchedule();

    return () => {
      isMounted = false;
    };
  }, []);

  const title = t?.eventScheduleTitle || 'Event Schedule';
  const subtitle = t?.eventScheduleSubtitle || 'See the weekly activities and events';
  const loadingText = t?.eventScheduleLoading || 'Loading event schedule...';
  const emptyText = t?.eventScheduleEmpty || 'No upcoming events right now. Check back soon!';
  const errorText = t?.eventScheduleError || 'There was an error loading the event schedule. Please try again later.';

  return (
    <div className="relative z-20 pt-24 pb-16 px-4 sm:px-8 md:px-16 lg:px-24 min-h-screen">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {title}
        </h1>
        <p className="text-blue-200 text-base sm:text-lg md:text-xl">
          {subtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-10 sm:mt-12">
        {isLoading && (
          <div className="text-center text-blue-200 text-lg">{loadingText}</div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-300 text-lg">{errorText}</div>
        )}

        {!isLoading && !error && !schedule && (
          <div className="text-center text-blue-200 text-lg">{emptyText}</div>
        )}

        {!isLoading && !error && schedule && (
          <div className="bg-cyan-900/20 backdrop-blur-md p-4 sm:p-6 rounded-3xl border-2 border-cyan-400/30">
            <img
              src={schedule.url}
              alt={title}
              className="w-full rounded-2xl shadow-2xl shadow-cyan-500/20"
            />
            {schedule.title && (
              <p className="mt-4 text-center text-blue-100 text-lg font-semibold">
                {schedule.title}
              </p>
            )}
            {schedule.description && (
              <p className="mt-2 text-center text-blue-200 text-base">
                {schedule.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSchedulePage;
