/**
 * Authentication API
 * Replaces convex/auth.ts
 */

import { supabase, query, mutation } from '../lib/supabase';
// Note: bcryptjs is only used server-side. For browser, we'll use simple hashing temporarily
// In production, password hashing should be done server-side via Supabase Edge Functions

// Simple hash function using Web Crypto API (browser-compatible)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Register new user
export async function register({ email, password, name, phone, gender }) {
  // Check if user already exists
  const { data: existingUsers } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (existingUsers && existingUsers.length > 0) {
    throw new Error('User with this email already exists');
  }

  // Simple hash for now (in production, use Supabase Auth or Edge Functions)
  const passwordHash = await hashPassword(password);

  // Create new user
  const user = await mutation.insert('users', {
    email,
    name,
    phone: phone || null,
    gender: gender || null,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
    total_sessions: 0,
    total_duration: 0,
  });

  // Create session token
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await mutation.insert('session_tokens', {
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

// Login user
export async function login({ email, password }) {
  // Find user
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (!users || users.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = users[0];

  // Verify password
  const hashedInput = await hashPassword(password);
  const isValid = hashedInput === user.password_hash;
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await mutation.update('users', user.id, {
    last_login_at: new Date().toISOString(),
  });

  // Create session token
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await mutation.insert('session_tokens', {
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

// Verify token and get user
export async function verifyToken({ token }) {
  const { data: sessionToken, error } = await supabase
    .from('session_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !sessionToken || new Date(sessionToken.expires_at) < new Date()) {
    return null;
  }

  const user = await query.getById('users', sessionToken.user_id);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    totalSessions: user.total_sessions,
    totalDuration: user.total_duration,
  };
}

// Logout user
export async function logout({ token }) {
  await mutation.deleteWhere('session_tokens', { token });
  return { success: true };
}

// Admin login
export async function adminLogin({ password }) {
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  if (password !== ADMIN_PASSWORD) {
    throw new Error('Invalid admin password');
  }

  // Create admin session token
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

  await mutation.insert('admin_sessions', {
    token,
    created_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    last_activity_at: new Date().toISOString(),
  });

  return { token };
}

// Verify admin token
export async function verifyAdminToken({ token }) {
  const { data: adminSession, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !adminSession || new Date(adminSession.expires_at) < new Date()) {
    return false;
  }

  // Update last activity
  await mutation.update('admin_sessions', adminSession.id, {
    last_activity_at: new Date().toISOString(),
  });

  return true;
}

// Admin logout
export async function adminLogout({ token }) {
  await mutation.deleteWhere('admin_sessions', { token });
  return { success: true };
}
