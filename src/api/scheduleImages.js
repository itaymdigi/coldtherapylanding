/**
 * Schedule Images API
 * Enhanced with admin operations
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

// Set active schedule
export async function setActiveSchedule({ id }) {
  // First, set all schedules to inactive
  await supabase
    .from('schedule_images')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records
  
  // Then set the selected one as active
  return await mutation.update('schedule_images', id, { is_active: true });
}

// Upload schedule image to Supabase Storage
export async function uploadScheduleImage(file) {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `schedule/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('assets')
    .getPublicUrl(filePath);
    
  return publicUrl;
}

// Delete schedule image file from Supabase Storage
export async function deleteScheduleImageFile(url) {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/schedule\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `schedule/${pathMatch[1]}`;
    
    const { error } = await supabase.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete file from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}
