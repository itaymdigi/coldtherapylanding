/**
 * Hero Video API
 * Replaces convex/heroVideo.ts
 */

import { supabase, query, mutation } from '../lib/supabase';

// Get active hero video
export async function getActiveHeroVideo() {
  const { data, error } = await supabase
    .from('hero_video')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Get all hero videos
export async function getAllHeroVideos() {
  return await query.getAll('hero_video', {
    orderBy: 'created_at',
    ascending: false,
  });
}

// Upload hero video
export async function uploadHeroVideo({ url, altText, isActive }) {
  return await mutation.insert('hero_video', {
    url,
    alt_text: altText || null,
    is_active: isActive !== undefined ? isActive : true,
  });
}

// Update hero video
export async function updateHeroVideo({ id, url, altText, isActive }) {
  const updates = {};
  if (url !== undefined) updates.url = url;
  if (altText !== undefined) updates.alt_text = altText;
  if (isActive !== undefined) updates.is_active = isActive;
  
  return await mutation.update('hero_video', id, updates);
}

// Delete hero video
export async function deleteHeroVideo(id) {
  return await mutation.delete('hero_video', id);
}
