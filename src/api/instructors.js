/**
 * Instructors API
 * Enhanced with admin operations and file upload
 */

import { supabase, query, mutation } from '../lib/supabase';

// Get all instructors
export async function getAllInstructors() {
  return await query.getAll('instructors', {
    orderBy: 'order',
    ascending: true,
  });
}

// Add new instructor
export async function addInstructor({ name, title, bio, photoUrl, order }) {
  return await mutation.insert('instructors', {
    name,
    title,
    bio,
    photo_url: photoUrl,
    order,
  });
}

// Update instructor
export async function updateInstructor({ id, name, title, bio, photoUrl, order }) {
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (title !== undefined) updates.title = title;
  if (bio !== undefined) updates.bio = bio;
  if (photoUrl !== undefined) updates.photo_url = photoUrl;
  if (order !== undefined) updates.order = order;
  
  return await mutation.update('instructors', id, updates);
}

// Delete instructor
export async function deleteInstructor(id) {
  return await mutation.delete('instructors', id);
}

// Upload instructor photo to Supabase Storage
export async function uploadInstructorPhoto(file) {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `instructors/${fileName}`;
  
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

// Delete instructor photo file from Supabase Storage
export async function deleteInstructorPhoto(url) {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/instructors\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `instructors/${pathMatch[1]}`;
    
    const { error } = await supabase.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete instructor photo from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}
