/**
 * Breathing Videos API
 * Enhanced with admin operations and file upload
 */

import { supabase, query, mutation } from '../lib/supabase';

// Get all published videos (free + premium)
export async function getAllVideos() {
  return await query.getWhere('breathing_videos', { is_published: true }, {
    orderBy: 'order',
    ascending: true,
  });
}

// Get all videos for admin (including unpublished)
export async function getAllVideosForAdmin() {
  return await query.getAll('breathing_videos', {
    orderBy: 'created_at',
    ascending: false,
  });
}

// Get free videos only
export async function getFreeVideos() {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('*')
    .eq('is_published', true)
    .eq('is_premium', false)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Get premium videos only
export async function getPremiumVideos() {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('*')
    .eq('is_published', true)
    .eq('is_premium', true)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Get video by ID
export async function getVideoById(id) {
  return await query.getById('breathing_videos', id);
}

// Get videos by category
export async function getVideosByCategory(category) {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Add new video (Admin)
export async function addVideo({
  title,
  description,
  videoUrl,
  thumbnailUrl,
  duration,
  difficulty,
  category,
  isPremium,
  order,
}) {
  return await mutation.insert('breathing_videos', {
    title,
    description,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl || null,
    duration,
    difficulty,
    category,
    is_premium: isPremium,
    order,
    is_published: true,
    views: 0,
  });
}

// Update video
export async function updateVideo({ id, ...updates }) {
  const supabaseUpdates = {};
  
  if (updates.title !== undefined) supabaseUpdates.title = updates.title;
  if (updates.description !== undefined) supabaseUpdates.description = updates.description;
  if (updates.videoUrl !== undefined) supabaseUpdates.video_url = updates.videoUrl;
  if (updates.thumbnailUrl !== undefined) supabaseUpdates.thumbnail_url = updates.thumbnailUrl;
  if (updates.duration !== undefined) supabaseUpdates.duration = updates.duration;
  if (updates.difficulty !== undefined) supabaseUpdates.difficulty = updates.difficulty;
  if (updates.category !== undefined) supabaseUpdates.category = updates.category;
  if (updates.isPremium !== undefined) supabaseUpdates.is_premium = updates.isPremium;
  if (updates.order !== undefined) supabaseUpdates.order = updates.order;
  if (updates.isPublished !== undefined) supabaseUpdates.is_published = updates.isPublished;
  
  return await mutation.update('breathing_videos', id, supabaseUpdates);
}

// Toggle publish status
export async function toggleVideoPublishStatus(id) {
  const video = await query.getById('breathing_videos', id);
  if (video) {
    return await mutation.update('breathing_videos', id, {
      is_published: !video.is_published,
    });
  }
}

// Toggle premium status
export async function toggleVideoPremiumStatus(id) {
  const video = await query.getById('breathing_videos', id);
  if (video) {
    return await mutation.update('breathing_videos', id, {
      is_premium: !video.is_premium,
    });
  }
}

// Increment video views
export async function incrementViews(id) {
  const video = await query.getById('breathing_videos', id);
  if (video) {
    return await mutation.update('breathing_videos', id, {
      views: video.views + 1,
    });
  }
}

// Delete video
export async function deleteVideo(id) {
  return await mutation.delete('breathing_videos', id);
}

// Upload video thumbnail to Supabase Storage
export async function uploadVideoThumbnail(file) {
  const fileName = `thumbnail-${Date.now()}.${file.name.split('.').pop()}`;
  const filePath = `breathing-videos/${fileName}`;
  
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

// Delete video thumbnail file from Supabase Storage
export async function deleteVideoThumbnail(url) {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/breathing-videos\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `breathing-videos/${pathMatch[1]}`;
    
    const { error } = await supabase.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete video thumbnail from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}

// Upload video file to Supabase Storage
export async function uploadVideoFile(file, onProgress) {
  // Validate file type
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
  if (!validVideoTypes.includes(file.type)) {
    throw new Error('Invalid video format. Please upload MP4, WebM, OGG, MOV, or AVI files.');
  }

  // Validate file size (max 500MB)
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    throw new Error('Video file size must be less than 500MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `video-${Date.now()}.${fileExt}`;
  const filePath = `breathing-videos/videos/${fileName}`;
  
  // Upload with progress tracking
  const { error, data } = await supabase.storage
    .from('assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: onProgress
    });
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('assets')
    .getPublicUrl(filePath);
    
  return publicUrl;
}

// Delete video file from Supabase Storage
export async function deleteVideoFile(url) {
  try {
    // Only delete if it's a Supabase storage URL
    if (!url.includes('supabase.co/storage')) return;
    
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/assets\/breathing-videos\/videos\/(.+)/);
    if (!pathMatch) return;
    
    const filePath = `breathing-videos/videos/${pathMatch[1]}`;
    
    const { error } = await supabase.storage
      .from('assets')
      .remove([filePath]);
      
    if (error) throw error;
  } catch (error) {
    console.warn('Failed to delete video file from storage:', error);
    // Continue with database deletion even if file deletion fails
  }
}

// Get video statistics
export async function getVideoStats() {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('is_premium, views, is_published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  const stats = {
    total: data.length,
    published: data.filter(v => v.is_published).length,
    free: data.filter(v => v.is_published && !v.is_premium).length,
    premium: data.filter(v => v.is_published && v.is_premium).length,
    totalViews: data.reduce((sum, v) => sum + (v.views || 0), 0),
  };
  
  return stats;
}

// Get all unique categories from existing videos
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('breathing_videos')
    .select('category')
    .not('category', 'is', null);
  
  if (error) throw error;
  
  // Get unique categories and count videos in each
  const categoryCounts = {};
  data.forEach(item => {
    const category = item.category;
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category]++;
  });
  
  // Convert to array and sort
  const categories = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category,
    videoCount: count
  })).sort((a, b) => a.name.localeCompare(b.name));
  
  return categories;
}

// Create a new category (validate and return formatted category name)
export async function createCategory(categoryName) {
  if (!categoryName || typeof categoryName !== 'string') {
    throw new Error('Category name is required');
  }
  
  // Format category name: trim, lowercase, replace spaces with hyphens
  const formattedCategory = categoryName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters except hyphens
  
  if (!formattedCategory) {
    throw new Error('Invalid category name');
  }
  
  // Check if category already exists
  const existingCategories = await getAllCategories();
  if (existingCategories.some(cat => cat.name === formattedCategory)) {
    throw new Error('Category already exists');
  }
  
  return formattedCategory;
}
