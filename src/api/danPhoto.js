/**
 * Dan Photo API
 * Enhanced with admin operations and file upload
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

// Upload Dan photo to Supabase Storage
export async function uploadDanPhoto(file) {
  const fileName = `dan-photo-${Date.now()}.${file.name.split('.').pop()}`;
  const filePath = `about/${fileName}`;
  
  const { error } = await supabase.storage
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

// Delete Dan photo file from Supabase Storage
export async function deleteDanPhotoFile(url) {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/about\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `about/${pathMatch[1]}`;
    
    const { error } = await supabase.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete Dan photo from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}

// Set Dan photo as active (deactivates all others)
export async function setActiveDanPhoto(id) {
  // First, deactivate all photos
  await supabase
    .from('dan_photo')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records
  
  // Then activate the selected photo
  return await updateDanPhoto({ id, isActive: true });
}
