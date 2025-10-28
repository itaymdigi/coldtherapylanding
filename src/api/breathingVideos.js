/**
 * Breathing Videos API
 * Replaces convex/breathingVideos.ts
 */

import { supabase, query, mutation } from '../lib/supabase';

// Get all published videos (free + premium)
export async function getAllVideos() {
  return await query.getWhere('breathing_videos', { is_published: true }, {
    orderBy: 'order',
    ascending: true,
  });
}

// Get free videos only
export async function getFreeVideos() {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('*')
    .eq('is_published', true)
    .eq('is_premium', false)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Get premium videos only
export async function getPremiumVideos() {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('*')
    .eq('is_published', true)
    .eq('is_premium', true)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Get video by ID
export async function getVideoById(id) {
  return await query.getById('breathing_videos', id);
}

// Get videos by category
export async function getVideosByCategory(category) {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Add new video (Admin)
export async function addVideo({
  title,
  description,
  videoUrl,
  thumbnailUrl,
  duration,
  difficulty,
  category,
  isPremium,
  order,
}) {
  return await mutation.insert('breathing_videos', {
    title,
    description,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl || null,
    duration,
    difficulty,
    category,
    is_premium: isPremium,
    order,
    is_published: true,
    views: 0,
    created_at: new Date().toISOString(),
  });
}

// Update video
export async function updateVideo({ id, ...updates }) {
  const supabaseUpdates = {};
  
  if (updates.title !== undefined) supabaseUpdates.title = updates.title;
  if (updates.description !== undefined) supabaseUpdates.description = updates.description;
  if (updates.videoUrl !== undefined) supabaseUpdates.video_url = updates.videoUrl;
  if (updates.thumbnailUrl !== undefined) supabaseUpdates.thumbnail_url = updates.thumbnailUrl;
  if (updates.duration !== undefined) supabaseUpdates.duration = updates.duration;
  if (updates.difficulty !== undefined) supabaseUpdates.difficulty = updates.difficulty;
  if (updates.category !== undefined) supabaseUpdates.category = updates.category;
  if (updates.isPremium !== undefined) supabaseUpdates.is_premium = updates.isPremium;
  if (updates.order !== undefined) supabaseUpdates.order = updates.order;
  if (updates.isPublished !== undefined) supabaseUpdates.is_published = updates.isPublished;
  
  return await mutation.update('breathing_videos', id, supabaseUpdates);
}

// Increment video views
export async function incrementViews(id) {
  const video = await query.getById('breathing_videos', id);
  if (video) {
    return await mutation.update('breathing_videos', id, {
      views: video.views + 1,
    });
  }
}

// Delete video
export async function deleteVideo(id) {
  return await mutation.delete('breathing_videos', id);
}
