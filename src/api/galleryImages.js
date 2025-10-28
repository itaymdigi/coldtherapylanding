/**
 * Gallery Images API
 * Replaces convex/galleryImages.ts
 */

import { query, mutation } from '../lib/supabase';

// Get all gallery images
export async function getGalleryImages() {
  return await query.getAll('gallery_images', {
    orderBy: 'order',
    ascending: true,
  });
}

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
