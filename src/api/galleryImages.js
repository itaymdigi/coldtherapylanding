/**
 * Gallery Images API
 * Enhanced with admin operations
 */

import { mutation, storageClient, supabase } from '../lib/supabase';

// Get all gallery images
export const getGalleryImages = async () => {
  console.log('🖼️ Loading gallery images...');
  try {
    console.log('🔍 Fetching gallery images from Supabase...');
    
    // Force no cache by adding timestamp
    const response = await supabase
      .from('gallery_images')
      .select('*')
      .order('order', { ascending: true });
    
    if (response.error) {
      console.error('❌ Error fetching gallery images:', response.error);
      throw response.error;
    }
    
    console.log('✅ Gallery images fetched successfully:', response.data.length, 'images');
    console.log('📋 Image URLs:', response.data.map(img => img.url));
    
    // Return data immediately
    return response.data;
  } catch (error) {
    console.error('❌ Error in getGalleryImages:', error);
    throw error;
  }
};

// Add a new gallery image
export async function addGalleryImage({ url, order, altText }) {
  return await mutation.insert('gallery_images', {
    url,
    order,
    alt_text: altText || null,
  });
}

// Update a gallery image
export async function updateGalleryImage({ id, url, order, altText }) {
  const updates = {};
  if (url !== undefined) updates.url = url;
  if (order !== undefined) updates.order = order;
  if (altText !== undefined) updates.alt_text = altText;
  
  return await mutation.update('gallery_images', id, updates);
}

// Delete a gallery image
export async function deleteGalleryImage(id) {
  return await mutation.delete('gallery_images', id);
}

// Upload image to Supabase Storage
export async function uploadGalleryImage(file) {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `gallery/${fileName}`;
    
    console.log('Uploading gallery file:', { fileName, filePath, fileSize: file.size, fileType: file.type });
    
    const { data, error } = await storageClient.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (error) {
      console.error('Supabase storage error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    console.log('Gallery upload successful:', data);
    
    // Get public URL
    const { data: { publicUrl } } = storageClient.storage
      .from('assets')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Gallery upload error details:', error);
    throw error;
  }
}

// Delete image from Supabase Storage
export async function deleteGalleryImageFile(url) {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/gallery\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `gallery/${pathMatch[1]}`;
    
    const { error } = await storageClient.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete file from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}
