/**
 * Instructors API
 * Enhanced with admin operations and file upload
 */

import { mutation, query, storageClient } from '../lib/supabase';

// Get all instructors
export async function getAllInstructors() {
  console.log('👥 Fetching instructors from Supabase...');
  try {
    const data = await query.getAll('instructors', {
      orderBy: 'order',
      ascending: true,
    });
    console.log('✅ Instructors fetched successfully:', data.length, 'instructors');
    console.log('📋 Instructors:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching instructors:', error);
    throw error;
  }
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
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `instructors/${fileName}`;
    
    console.log('Uploading file:', { fileName, filePath, fileSize: file.size, fileType: file.type });
    
    // Add timeout to prevent hanging
    const uploadPromise = storageClient.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timeout - please try again')), 30000)
    );
    
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);
    
    if (error) {
      console.error('Supabase storage error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    console.log('✅ Upload successful:', data);
    
    // Get public URL
    const { data: { publicUrl } } = storageClient.storage
      .from('assets')
      .getPublicUrl(filePath);
    
    console.log('📸 Photo URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

// Delete instructor photo file from Supabase Storage
export async function deleteInstructorPhoto(url) {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/instructors\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `instructors/${pathMatch[1]}`;
    
    const { error } = await storageClient.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete instructor photo from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}
