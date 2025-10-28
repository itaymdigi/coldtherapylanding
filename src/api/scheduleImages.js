/**
 * Schedule Images API
 * Replaces convex/scheduleImages.ts
 */

import { supabase, query, mutation } from '../lib/supabase';

// Get active schedule image
export async function getActiveScheduleImage() {
  const { data, error } = await supabase
    .from('schedule_images')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

// Get all schedule images
export async function getAllScheduleImages() {
  return await query.getAll('schedule_images', {
    orderBy: 'created_at',
    ascending: false,
  });
}

// Add schedule image
export async function addScheduleImage({ url, title, description, isActive }) {
  return await mutation.insert('schedule_images', {
    url,
    title,
    description: description || null,
    is_active: isActive !== undefined ? isActive : true,
  });
}

// Update schedule image
export async function updateScheduleImage({ id, url, title, description, isActive }) {
  const updates = {};
  if (url !== undefined) updates.url = url;
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (isActive !== undefined) updates.is_active = isActive;
  
  return await mutation.update('schedule_images', id, updates);
}

// Delete schedule image
export async function deleteScheduleImage(id) {
  return await mutation.delete('schedule_images', id);
}
