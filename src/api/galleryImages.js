/**
 * Gallery Images API
 * Replaces convex/galleryImages.ts
 */

import { query, mutation } from '../lib/supabase';

// Get all gallery images
export const getGalleryImages = async () => {
  console.log('🖼️ Loading gallery images...');
  try {
    console.log('🔍 Fetching gallery images from Supabase...');
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
