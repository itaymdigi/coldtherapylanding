/**
 * Instructors API
 * Replaces convex/instructor.ts
 */

import { query, mutation } from '../lib/supabase';

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
    created_at: new Date().toISOString(),
  });
}

// Update instructor
export async function updateInstructor({ id, name, title, bio, photoUrl, order }) {
  return await mutation.update('instructors', id, {
    name,
    title,
    bio,
    photo_url: photoUrl,
    order,
  });
}

// Delete instructor
export async function deleteInstructor(id) {
  return await mutation.delete('instructors', id);
}
