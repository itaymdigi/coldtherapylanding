/**
 * Migrate Images from Vercel to Supabase Storage
 * 
 * This script:
 * 1. Fetches all records with image URLs from database
 * 2. Downloads images from old Vercel URLs
 * 3. Uploads them to Supabase Storage
 * 4. Updates database records with new Supabase URLs
 * 
 * Run with: node migrate-images-to-supabase.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Stats tracking
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
};

/**
 * Download image from URL
 */
async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    const contentType = response.headers.get('content-type');
    return { buffer, contentType };
  } catch (error) {
    throw new Error(`Failed to download: ${error.message}`);
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadToSupabase(buffer, contentType, folderPath, fileName) {
  const filePath = `${folderPath}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('assets')
    .upload(filePath, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: true, // Allow overwriting if file exists
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('assets')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Extract filename from URL
 */
function extractFileName(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  } catch {
    return `image-${Date.now()}.jpg`;
  }
}

/**
 * Migrate gallery images
 */
async function migrateGalleryImages() {
  console.log('\n📸 Migrating gallery images...');
  
  const { data: images, error } = await supabase
    .from('gallery_images')
    .select('*');

  if (error) {
    console.error('❌ Error fetching gallery images:', error.message);
    return;
  }

  if (!images || images.length === 0) {
    console.log('ℹ️  No gallery images to migrate');
    return;
  }

  for (const image of images) {
    stats.total++;
    const oldUrl = image.url;
    
    // Skip if already migrated to Supabase
    if (oldUrl.includes('supabase.co')) {
      console.log(`⏭️  Skipped (already on Supabase): ${image.id}`);
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n📥 Downloading: ${oldUrl}`);
      const { buffer, contentType } = await downloadImage(oldUrl);
      
      const fileName = extractFileName(oldUrl);
      console.log(`📤 Uploading: gallery/${fileName}`);
      const newUrl = await uploadToSupabase(buffer, contentType, 'gallery', fileName);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('gallery_images')
        .update({ url: newUrl })
        .eq('id', image.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`✅ Success! New URL: ${newUrl}`);
      stats.success++;
    } catch (error) {
      console.error(`❌ Failed for ${image.id}:`, error.message);
      stats.failed++;
    }
  }
}

/**
 * Migrate instructor photos
 */
async function migrateInstructorPhotos() {
  console.log('\n👥 Migrating instructor photos...');
  
  const { data: instructors, error } = await supabase
    .from('instructors')
    .select('*');

  if (error) {
    console.error('❌ Error fetching instructors:', error.message);
    return;
  }

  if (!instructors || instructors.length === 0) {
    console.log('ℹ️  No instructor photos to migrate');
    return;
  }

  for (const instructor of instructors) {
    stats.total++;
    const oldUrl = instructor.photo_url;
    
    if (!oldUrl) {
      stats.skipped++;
      continue;
    }

    // Skip if already migrated to Supabase
    if (oldUrl.includes('supabase.co')) {
      console.log(`⏭️  Skipped (already on Supabase): ${instructor.name}`);
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n📥 Downloading: ${oldUrl}`);
      const { buffer, contentType } = await downloadImage(oldUrl);
      
      const fileName = extractFileName(oldUrl);
      console.log(`📤 Uploading: instructors/${fileName}`);
      const newUrl = await uploadToSupabase(buffer, contentType, 'instructors', fileName);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('instructors')
        .update({ photo_url: newUrl })
        .eq('id', instructor.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`✅ Success! ${instructor.name} - ${newUrl}`);
      stats.success++;
    } catch (error) {
      console.error(`❌ Failed for ${instructor.name}:`, error.message);
      stats.failed++;
    }
  }
}

/**
 * Migrate breathing video thumbnails
 */
async function migrateBreathingVideoThumbnails() {
  console.log('\n🎥 Migrating breathing video thumbnails...');
  
  const { data: videos, error } = await supabase
    .from('breathing_videos')
    .select('*');

  if (error) {
    console.error('❌ Error fetching breathing videos:', error.message);
    return;
  }

  if (!videos || videos.length === 0) {
    console.log('ℹ️  No video thumbnails to migrate');
    return;
  }

  for (const video of videos) {
    const oldUrl = video.thumbnail_url;
    
    if (!oldUrl) {
      continue;
    }

    stats.total++;

    // Skip if already migrated to Supabase
    if (oldUrl.includes('supabase.co')) {
      console.log(`⏭️  Skipped (already on Supabase): ${video.title}`);
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n📥 Downloading: ${oldUrl}`);
      const { buffer, contentType } = await downloadImage(oldUrl);
      
      const fileName = extractFileName(oldUrl);
      console.log(`📤 Uploading: videos/${fileName}`);
      const newUrl = await uploadToSupabase(buffer, contentType, 'videos', fileName);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('breathing_videos')
        .update({ thumbnail_url: newUrl })
        .eq('id', video.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`✅ Success! ${video.title} - ${newUrl}`);
      stats.success++;
    } catch (error) {
      console.error(`❌ Failed for ${video.title}:`, error.message);
      stats.failed++;
    }
  }
}

/**
 * Migrate schedule images
 */
async function migrateScheduleImages() {
  console.log('\n📅 Migrating schedule images...');
  
  const { data: schedules, error } = await supabase
    .from('schedule_images')
    .select('*');

  if (error) {
    console.error('❌ Error fetching schedule images:', error.message);
    return;
  }

  if (!schedules || schedules.length === 0) {
    console.log('ℹ️  No schedule images to migrate');
    return;
  }

  for (const schedule of schedules) {
    stats.total++;
    const oldUrl = schedule.url;
    
    // Skip if already migrated to Supabase
    if (oldUrl.includes('supabase.co')) {
      console.log(`⏭️  Skipped (already on Supabase): ${schedule.id}`);
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n📥 Downloading: ${oldUrl}`);
      const { buffer, contentType } = await downloadImage(oldUrl);
      
      const fileName = extractFileName(oldUrl);
      console.log(`📤 Uploading: schedule/${fileName}`);
      const newUrl = await uploadToSupabase(buffer, contentType, 'schedule', fileName);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('schedule_images')
        .update({ url: newUrl })
        .eq('id', schedule.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`✅ Success! New URL: ${newUrl}`);
      stats.success++;
    } catch (error) {
      console.error(`❌ Failed for ${schedule.id}:`, error.message);
      stats.failed++;
    }
  }
}

/**
 * Migrate Dan photos
 */
async function migrateDanPhotos() {
  console.log('\n📸 Migrating Dan photos...');
  
  const { data: photos, error } = await supabase
    .from('dan_photo')
    .select('*');

  if (error) {
    console.error('❌ Error fetching Dan photos:', error.message);
    return;
  }

  if (!photos || photos.length === 0) {
    console.log('ℹ️  No Dan photos to migrate');
    return;
  }

  for (const photo of photos) {
    stats.total++;
    const oldUrl = photo.url;
    
    // Skip if already migrated to Supabase
    if (oldUrl.includes('supabase.co')) {
      console.log(`⏭️  Skipped (already on Supabase): ${photo.id}`);
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n📥 Downloading: ${oldUrl}`);
      const { buffer, contentType } = await downloadImage(oldUrl);
      
      const fileName = extractFileName(oldUrl);
      console.log(`📤 Uploading: about/${fileName}`);
      const newUrl = await uploadToSupabase(buffer, contentType, 'about', fileName);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('dan_photo')
        .update({ url: newUrl })
        .eq('id', photo.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`✅ Success! New URL: ${newUrl}`);
      stats.success++;
    } catch (error) {
      console.error(`❌ Failed for ${photo.id}:`, error.message);
      stats.failed++;
    }
  }
}

/**
 * Migrate hero videos
 */
async function migrateHeroVideos() {
  console.log('\n🎬 Migrating hero videos...');
  
  const { data: videos, error } = await supabase
    .from('hero_video')
    .select('*');

  if (error) {
    console.error('❌ Error fetching hero videos:', error.message);
    return;
  }

  if (!videos || videos.length === 0) {
    console.log('ℹ️  No hero videos to migrate');
    return;
  }

  for (const video of videos) {
    stats.total++;
    const oldUrl = video.url;
    
    // Skip if already migrated to Supabase
    if (oldUrl.includes('supabase.co')) {
      console.log(`⏭️  Skipped (already on Supabase): ${video.id}`);
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n📥 Downloading: ${oldUrl}`);
      const { buffer, contentType } = await downloadImage(oldUrl);
      
      const fileName = extractFileName(oldUrl);
      console.log(`📤 Uploading: hero/${fileName}`);
      const newUrl = await uploadToSupabase(buffer, contentType, 'hero', fileName);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('hero_video')
        .update({ url: newUrl })
        .eq('id', video.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`✅ Success! New URL: ${newUrl}`);
      stats.success++;
    } catch (error) {
      console.error(`❌ Failed for ${video.id}:`, error.message);
      stats.failed++;
    }
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting image migration from Vercel to Supabase Storage...\n');
  console.log(`Supabase URL: ${SUPABASE_URL}\n`);

  try {
    await migrateGalleryImages();
    await migrateInstructorPhotos();
    await migrateBreathingVideoThumbnails();
    await migrateScheduleImages();
    await migrateDanPhotos();
    await migrateHeroVideos();

    console.log('\n\n📊 Migration Summary:');
    console.log('═══════════════════════════════');
    console.log(`Total files processed: ${stats.total}`);
    console.log(`✅ Successfully migrated: ${stats.success}`);
    console.log(`⏭️  Skipped (already on Supabase): ${stats.skipped}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log('═══════════════════════════════');

    if (stats.failed > 0) {
      console.log('\n⚠️  Some files failed to migrate. Check the logs above for details.');
    } else if (stats.success > 0) {
      console.log('\n🎉 All files migrated successfully!');
    } else if (stats.skipped === stats.total) {
      console.log('\n✨ All files were already on Supabase Storage. Nothing to migrate!');
    } else {
      console.log('\n✨ Migration complete!');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
