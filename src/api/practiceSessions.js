/**
 * Practice Sessions API
 * Replaces convex/practiceSessions.ts
 */

import { supabase, query, mutation } from '../lib/supabase';

// Save a completed practice session
export async function saveSession({
  token,
  duration,
  temperature,
  notes,
  mood,
  rating,
  pauseCount,
}) {
  // Verify token
  const { data: sessionToken, error: tokenError } = await supabase
    .from('session_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenError || !sessionToken || new Date(sessionToken.expires_at) < new Date()) {
    throw new Error('Invalid or expired token');
  }

  const user = await query.getById('users', sessionToken.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if this is a personal best
  const previousSessions = await query.getWhere(
    'practice_sessions',
    { user_id: sessionToken.user_id },
    { orderBy: 'completed_at' }
  );

  const isPersonalBest = previousSessions.every((session) => session.duration < duration);

  // Create session record
  const session = await mutation.insert('practice_sessions', {
    user_id: sessionToken.user_id,
    duration,
    temperature: temperature || null,
    notes: notes || null,
    mood: mood || null,
    rating: rating || null,
    completed_at: new Date().toISOString(),
    pause_count: pauseCount,
    personal_best: isPersonalBest,
  });

  // Update user stats
  await mutation.update('users', sessionToken.user_id, {
    total_sessions: user.total_sessions + 1,
    total_duration: user.total_duration + duration,
  });

  return {
    success: true,
    sessionId: session.id,
    isPersonalBest,
  };
}

// Get user's session history
export async function getUserSessions({ token, limit = 50 }) {
  // Verify token
  const { data: sessionToken, error: tokenError } = await supabase
    .from('session_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenError || !sessionToken || new Date(sessionToken.expires_at) < new Date()) {
    return null;
  }

  // Get sessions
  const { data: sessions, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', sessionToken.user_id)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return sessions || [];
}

// Get user statistics
export async function getUserStats({ token }) {
  // Verify token
  const { data: sessionToken, error: tokenError } = await supabase
    .from('session_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenError || !sessionToken || new Date(sessionToken.expires_at) < new Date()) {
    return null;
  }

  const user = await query.getById('users', sessionToken.user_id);
  if (!user) {
    return null;
  }

  // Get all sessions
  const sessions = await query.getWhere(
    'practice_sessions',
    { user_id: sessionToken.user_id },
    { orderBy: 'completed_at' }
  );

  // Calculate stats
  const longestSession = Math.max(...sessions.map((s) => s.duration), 0);
  const averageSession =
    sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0;

  // Get last 7 days sessions
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSessions = sessions.filter(
    (s) => new Date(s.completed_at) > sevenDaysAgo
  );

  // Get current streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const dayEnd = new Date(checkDate);
    dayEnd.setHours(23, 59, 59, 999);

    const hasSession = sortedSessions.some((s) => {
      const sessionDate = new Date(s.completed_at);
      return sessionDate >= checkDate && sessionDate <= dayEnd;
    });

    if (hasSession) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return {
    totalSessions: user.total_sessions,
    totalDuration: user.total_duration,
    longestSession,
    averageSession: Math.round(averageSession),
    recentSessionsCount: recentSessions.length,
    currentStreak: streak,
    personalBests: sessions.filter((s) => s.personal_best).length,
  };
}

// Delete a session
export async function deleteSession({ token, sessionId }) {
  // Verify token
  const { data: sessionToken, error: tokenError } = await supabase
    .from('session_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (tokenError || !sessionToken || new Date(sessionToken.expires_at) < new Date()) {
    throw new Error('Invalid or expired token');
  }

  const session = await query.getById('practice_sessions', sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  // Verify ownership
  if (session.user_id !== sessionToken.user_id) {
    throw new Error('Unauthorized');
  }

  const user = await query.getById('users', sessionToken.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Update user stats
  await mutation.update('users', sessionToken.user_id, {
    total_sessions: Math.max(0, user.total_sessions - 1),
    total_duration: Math.max(0, user.total_duration - session.duration),
  });

  // Delete session
  await mutation.delete('practice_sessions', sessionId);

  return { success: true };
}
