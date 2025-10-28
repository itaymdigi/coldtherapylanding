/**
 * Gallery Images API
 * Replaces convex/galleryImages.ts
 */

import { createClient } from '@supabase/supabase-js';

// Create Supabase client directly to avoid import issues
const supabaseUrl = 'https://hqumvakozmicqfrbjssr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdW12YWtvem1pY3FmcmJqc3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzYxNjUsImV4cCI6MjA3NzIxMjE2NX0.GdNY6Kf-LkIZ1DPQkq8ezphzliWBacbC64XSW54qc5Y';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
