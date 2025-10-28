/**
 * Bookings API
 * Replaces convex/bookings.ts
 */

import { query, mutation } from '../lib/supabase';

// Get all bookings
export async function getAllBookings() {
  return await query.getAll('bookings', {
    orderBy: 'booked_at',
    ascending: false,
  });
}

// Get bookings by status
export async function getBookingsByStatus(status) {
  return await query.getWhere('bookings', { status }, {
    orderBy: 'booked_at',
    ascending: false,
  });
}

// Create a new booking
export async function createBooking({ packageType, customerName, customerEmail, customerPhone }) {
  return await mutation.insert('bookings', {
    package_type: packageType,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    status: 'pending',
    booked_at: new Date().toISOString(),
  });
}

// Update booking status
export async function updateBookingStatus({ id, status }) {
  return await mutation.update('bookings', id, { status });
}

// Delete a booking
export async function deleteBooking(id) {
  return await mutation.delete('bookings', id);
}
