/**
 * Media API
 * Replaces convex/media.ts
 */

import { query, mutation } from '../lib/supabase';

// Get all media
export async function getAllMedia() {
  return await query.getAll('media', {
    orderBy: 'uploaded_at',
    ascending: false,
  });
}

// Upload media
export async function uploadMedia({
  fileName,
  fileType,
  mimeType,
  fileSize,
  url,
  thumbnailUrl,
  uploadedBy,
  tags,
  description,
}) {
  return await mutation.insert('media', {
    file_name: fileName,
    file_type: fileType,
    mime_type: mimeType,
    file_size: fileSize,
    url,
    thumbnail_url: thumbnailUrl || null,
    uploaded_by: uploadedBy,
    uploaded_at: new Date().toISOString(),
    tags: tags || null,
    description: description || null,
  });
}

// Delete media
export async function deleteMedia(id) {
  return await mutation.delete('media', id);
}
