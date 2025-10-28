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
    isAdmin: user.is_admin,
  };
}

async function upsertUserProfile({ id, email, name, phone, gender, is_admin }) {
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
      is_admin: is_admin !== undefined ? is_admin : existingUser?.is_admin || false,
      last_login_at: new Date().toISOString(),
    });
  } catch {
    await mutation.insert('users', {
      id,
      email,
      name: name || null,
      phone: phone || null,
      gender: gender || null,
      is_admin: is_admin || false,
      created_at: new Date().toISOString(),
      total_sessions: 0,
      total_duration: 0,
    });
  }
}

export async function register({ email, password, name, phone, gender, is_admin }) {
  const data = await supabaseAuth.signUp(email, password, {
    name,
    phone,
    gender,
    is_admin,
  });

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
    is_admin,
  });

  const profile = await query.getById('users', authUser.id);

  return {
    token: session.access_token,
    user: mapDbUserToProfile(profile),
  };
}

export async function login({ email, password, name, phone, gender, is_admin }) {
  const data = await supabaseAuth.signIn(email, password);

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
    is_admin: is_admin !== undefined ? is_admin : authUser.user_metadata?.is_admin,
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

export async function verifyToken({ token }) {
  if (!token) {
    return null;
  }

  try {
    const authUser = await supabaseAuth.getUser(token);

    if (!authUser) {
      return null;
    }

    let profile;

    try {
      profile = await query.getById('users', authUser.id);
    } catch {
      await upsertUserProfile({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name,
        phone: authUser.user_metadata?.phone,
        gender: authUser.user_metadata?.gender,
      });

      profile = await query.getById('users', authUser.id);
    }

    return mapDbUserToProfile(profile);
  } catch {
    return null;
  }
}

// Admin login using Supabase Auth
export async function adminLogin({ email, password }) {
  try {
    // Use regular Supabase auth to sign in
    const data = await supabaseAuth.signIn(email, password);
    
    const authUser = data?.user;
    const session = data?.session;

    if (!authUser || !session) {
      throw new Error('Invalid email or password');
    }

    // Check if user is admin
    const profile = await query.getById('users', authUser.id);
    if (!profile || !profile.is_admin) {
      // Sign out the user since they're not admin
      await supabaseAuth.signOut();
      throw new Error('Access denied. User is not an administrator.');
    }

    // Update last login
    await mutation.update('users', authUser.id, {
      last_login_at: new Date().toISOString(),
    });

    return { 
      token: session.access_token,
      user: mapDbUserToProfile(profile)
    };
  } catch (error) {
    throw new Error(`Admin login failed: ${error.message}`);
  }
}

// Verify admin token
export async function verifyAdminToken({ token }) {
  try {
    // Verify the Supabase auth token
    const authUser = await supabaseAuth.getUser(token);
    
    if (!authUser) {
      return false;
    }

    // Check if user is admin in the database
    const profile = await query.getById('users', authUser.id);
    if (!profile || !profile.is_admin) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Admin logout
export async function adminLogout() {
  try {
    await supabaseAuth.signOut();
    return { success: true };
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}
