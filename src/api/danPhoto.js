/**
 * Dan Photo API
 * Replaces convex/danPhoto.ts
 */

import { supabase, query, mutation } from '../lib/supabase';

// Get active Dan photo
export async function getActiveDanPhoto() {
  const { data, error } = await supabase
    .from('dan_photo')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Get all Dan photos
export async function getAllDanPhotos() {
  return await query.getAll('dan_photo', {
    orderBy: 'created_at',
    ascending: false,
  });
}

// Add Dan photo
export async function addDanPhoto({ url, isActive }) {
  return await mutation.insert('dan_photo', {
    url,
    is_active: isActive !== undefined ? isActive : true,
  });
}

// Update Dan photo
export async function updateDanPhoto({ id, url, isActive }) {
  const updates = {};
  if (url !== undefined) updates.url = url;
  if (isActive !== undefined) updates.is_active = isActive;
  
  return await mutation.update('dan_photo', id, updates);
}

// Delete Dan photo
export async function deleteDanPhoto(id) {
  return await mutation.delete('dan_photo', id);
}
