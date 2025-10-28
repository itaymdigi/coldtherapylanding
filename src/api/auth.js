/**
 * Authentication API
 * Refactored to rely on Supabase Auth sessions
 */

import { auth as supabaseAuth, query, mutation } from '../lib/supabase.js';

function mapDbUserToProfile(user) {
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

async function upsertUserProfile({ id, email, name, phone, gender }) {
  if (!id || !email) {
    throw new Error('Missing required user identifiers');
  }

  try {
    const existingUser = await query.getById('users', id);
    await mutation.update('users', id, {
      email,
      name: name || existingUser?.name || null,
      phone: phone || existingUser?.phone || null,
      gender: gender || existingUser?.gender || null,
      last_login_at: new Date().toISOString(),
    });
  } catch {
    await mutation.insert('users', {
      id,
      email,
      name: name || null,
      phone: phone || null,
      gender: gender || null,
      created_at: new Date().toISOString(),
      total_sessions: 0,
      total_duration: 0,
    });
  }
}

export async function register({ email, password, name, phone, gender }) {
  const { data, error } = await supabaseAuth.signUp(email, password, {
    name,
    phone,
    gender,
  });

  if (error) {
    throw error;
  }

  const authUser = data?.user;
  const session = data?.session;

  if (!authUser || !session) {
    throw new Error('Registration incomplete. Please confirm your email.');
  }

  await upsertUserProfile({
    id: authUser.id,
    email: authUser.email,
    name,
    phone,
    gender,
  });

  const profile = await query.getById('users', authUser.id);

  return {
    token: session.access_token,
    user: mapDbUserToProfile(profile),
  };
}

export async function login({ email, password, name, phone, gender }) {
  const { data, error } = await supabaseAuth.signIn(email, password);

  if (error) {
    throw error;
  }

  const authUser = data?.user;
  const session = data?.session;

  if (!authUser || !session) {
    throw new Error('Unable to sign in. Please try again.');
  }

  await upsertUserProfile({
    id: authUser.id,
    email: authUser.email,
    name: name || authUser.user_metadata?.name,
    phone: phone || authUser.user_metadata?.phone,
    gender: gender || authUser.user_metadata?.gender,
  });

  const profile = await query.getById('users', authUser.id);

  return {
    token: session.access_token,
    user: mapDbUserToProfile(profile),
  };
}

export async function getCurrentUser() {
  const user = await supabaseAuth.getUser();

  if (!user) {
    return null;
  }

  const profile = await query.getById('users', user.id);
  return mapDbUserToProfile(profile);
}

export async function logout() {
  await supabaseAuth.signOut();
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
