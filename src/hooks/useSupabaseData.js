import { useEffect, useState } from 'react';
import * as api from '../api';

// Custom hook for components that need Supabase data
export const useSupabaseData = () => {
  const [data, setData] = useState({
    galleryImages: [],
    scheduleImage: null,
    danPhoto: null,
    heroVideo: null,
    stats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const [gallery, schedule, dan, hero, stats] = await Promise.all([
          api.getGalleryImages(),
          api.getActiveScheduleImage(),
          api.getActiveDanPhoto(),
          api.getActiveHeroVideo(),
          api.getSiteStats(),
        ]);

        setData({
          galleryImages: gallery.map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            order: img.order
          })),
          scheduleImage: schedule ? {
            id: schedule.id,
            url: schedule.url,
            alt: schedule.alt
          } : null,
          danPhoto: dan ? {
            id: dan.id,
            url: dan.url,
            alt: dan.alt
          } : null,
          heroVideo: hero ? {
            id: hero.id,
            video_url: hero.video_url,
            fallback_image_url: hero.fallback_image_url,
            is_active: hero.is_active
          } : null,
          stats: stats ? {
            sessions: stats.sessions,
            satisfaction: stats.satisfaction,
            clients: stats.clients,
            temp: stats.temp
          } : null,
        });
      } catch (err) {
        console.error('Error loading Supabase data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { data, loading, error };
};
