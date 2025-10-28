/**
 * Convex to Supabase Data Migration Script
 * 
 * This script migrates all data from Convex to Supabase
 * Run with: node migrate-to-supabase.js
 */

import 'dotenv/config';
import { ConvexHttpClient } from 'convex/browser';
import { createClient } from '@supabase/supabase-js';
import { api } from './convex/_generated/api.js';

// Convex setup
const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://shocking-anteater-916.convex.cloud';
const convex = new ConvexHttpClient(CONVEX_URL);

// Supabase setup
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hqumvakozmicqfrbjssr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper to convert Convex timestamps to ISO strings
const toISOString = (timestamp) => new Date(timestamp).toISOString();

// Migration functions for each table
async function migrateGalleryImages() {
  console.log('\n📸 Migrating gallery images...');
  try {
    const convexData = await convex.query(api.galleryImages.getGalleryImages);
    
    const supabaseData = convexData.map(item => ({
      url: item.url,
      order: item.order,
      alt_text: item.altText || null,
      created_at: toISOString(item._creationTime)
    }));

    const { data, error } = await supabase
      .from('gallery_images')
      .insert(supabaseData);

    if (error) throw error;
    console.log(`✅ Migrated ${supabaseData.length} gallery images`);
  } catch (error) {
    console.error('❌ Error migrating gallery images:', error.message);
  }
}

async function migrateBreathingVideos() {
  console.log('\n🎥 Migrating breathing videos...');
  try {
    const convexData = await convex.query(api.breathingVideos.getAllVideos);
    
    const supabaseData = convexData.map(item => ({
      title: item.title,
      description: item.description,
      video_url: item.videoUrl,
      thumbnail_url: item.thumbnailUrl || null,
      duration: item.duration,
      difficulty: item.difficulty,
      category: item.category,
      is_premium: item.isPremium,
      order: item.order,
      is_published: item.isPublished,
      views: item.views,
      created_at: toISOString(item.createdAt)
    }));

    const { data, error } = await supabase
      .from('breathing_videos')
      .insert(supabaseData);

    if (error) throw error;
    console.log(`✅ Migrated ${supabaseData.length} breathing videos`);
  } catch (error) {
    console.error('❌ Error migrating breathing videos:', error.message);
  }
}

async function migrateInstructors() {
  console.log('\n👨‍🏫 Migrating instructors...');
  try {
    const convexData = await convex.query(api.instructor.getAllInstructors);
    
    const supabaseData = convexData.map(item => ({
      name: item.name,
      title: item.title,
      bio: item.bio,
      photo_url: item.photoUrl,
      order: item.order,
      created_at: toISOString(item.createdAt)
    }));

    const { data, error } = await supabase
      .from('instructors')
      .insert(supabaseData);

    if (error) throw error;
    console.log(`✅ Migrated ${supabaseData.length} instructors`);
  } catch (error) {
    console.error('❌ Error migrating instructors:', error.message);
  }
}

async function migrateBookings() {
  console.log('\n📅 Migrating bookings...');
  try {
    const convexData = await convex.query(api.bookings.getAllBookings);
    
    const supabaseData = convexData.map(item => ({
      package_type: item.packageType,
      customer_name: item.customerName,
      customer_email: item.customerEmail,
      customer_phone: item.customerPhone,
      status: item.status,
      booked_at: toISOString(item.bookedAt)
    }));

    const { data, error } = await supabase
      .from('bookings')
      .insert(supabaseData);

    if (error) throw error;
    console.log(`✅ Migrated ${supabaseData.length} bookings`);
  } catch (error) {
    console.error('❌ Error migrating bookings:', error.message);
  }
}

async function migrateMedia() {
  console.log('\n🖼️ Migrating media library...');
  try {
    const convexData = await convex.query(api.media.getAllMedia);
    
    const supabaseData = convexData.map(item => ({
      file_name: item.fileName,
      file_type: item.fileType,
      mime_type: item.mimeType,
      file_size: item.fileSize,
      url: item.url,
      thumbnail_url: item.thumbnailUrl || null,
      uploaded_by: item.uploadedBy,
      uploaded_at: toISOString(item.uploadedAt),
      tags: item.tags || null,
      description: item.description || null
    }));

    const { data, error } = await supabase
      .from('media')
      .insert(supabaseData);

    if (error) throw error;
    console.log(`✅ Migrated ${supabaseData.length} media items`);
  } catch (error) {
    console.error('❌ Error migrating media:', error.message);
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting Convex to Supabase migration...\n');
  console.log(`Convex URL: ${CONVEX_URL}`);
  console.log(`Supabase URL: ${SUPABASE_URL}\n`);

  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_KEY environment variable is required!');
    console.error('Get it from: https://supabase.com/dashboard/project/hqumvakozmicqfrbjssr/settings/api');
    process.exit(1);
  }

  try {
    await migrateGalleryImages();
    await migrateBreathingVideos();
    await migrateInstructors();
    await migrateBookings();
    await migrateMedia();

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();
