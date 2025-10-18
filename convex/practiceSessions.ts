import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save a completed practice session
export const saveSession = mutation({
  args: {
    token: v.string(),
    duration: v.number(),
    temperature: v.optional(v.number()),
    notes: v.optional(v.string()),
    mood: v.optional(v.string()),
    pauseCount: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify token
    const sessionToken = await ctx.db
      .query("sessionTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!sessionToken || sessionToken.expiresAt < Date.now()) {
      throw new Error("Invalid or expired token");
    }

    const user = await ctx.db.get(sessionToken.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if this is a personal best
    const previousSessions = await ctx.db
      .query("practiceSessions")
      .withIndex("by_user", (q) => q.eq("userId", sessionToken.userId))
      .collect();

    const isPersonalBest = previousSessions.every(
      (session) => session.duration < args.duration
    );

    // Create session record
    const sessionId = await ctx.db.insert("practiceSessions", {
      userId: sessionToken.userId,
      duration: args.duration,
      temperature: args.temperature,
      notes: args.notes,
      mood: args.mood,
      completedAt: Date.now(),
      pauseCount: args.pauseCount,
      personalBest: isPersonalBest,
    });

    // Update user stats
    await ctx.db.patch(sessionToken.userId, {
      totalSessions: user.totalSessions + 1,
      totalDuration: user.totalDuration + args.duration,
    });

    return {
      success: true,
      sessionId,
      isPersonalBest,
    };
  },
});

// Get user's session history
export const getUserSessions = query({
  args: {
    token: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify token
    const sessionToken = await ctx.db
      .query("sessionTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!sessionToken || sessionToken.expiresAt < Date.now()) {
      return null;
    }

    // Get sessions
    const sessions = await ctx.db
      .query("practiceSessions")
      .withIndex("by_user_completed", (q) => q.eq("userId", sessionToken.userId))
      .order("desc")
      .take(args.limit || 50);

    return sessions;
  },
});

// Get user statistics
export const getUserStats = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify token
    const sessionToken = await ctx.db
      .query("sessionTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!sessionToken || sessionToken.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(sessionToken.userId);
    if (!user) {
      return null;
    }

    // Get all sessions
    const sessions = await ctx.db
      .query("practiceSessions")
      .withIndex("by_user", (q) => q.eq("userId", sessionToken.userId))
      .collect();

    // Calculate stats
    const longestSession = Math.max(...sessions.map((s) => s.duration), 0);
    const averageSession =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
        : 0;

    // Get last 7 days sessions
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSessions = sessions.filter(
      (s) => s.completedAt > sevenDaysAgo
    );

    // Get current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = today.getTime();

    const sortedSessions = [...sessions].sort(
      (a, b) => b.completedAt - a.completedAt
    );

    for (let i = 0; i < 30; i++) {
      const dayStart = checkDate - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const hasSession = sortedSessions.some(
        (s) => s.completedAt >= dayStart && s.completedAt < dayEnd
      );

      if (hasSession) {
        streak++;
      } else if (i > 0) {
        // Allow missing today if checking streak
        break;
      }
    }

    return {
      totalSessions: user.totalSessions,
      totalDuration: user.totalDuration,
      longestSession,
      averageSession: Math.round(averageSession),
      recentSessionsCount: recentSessions.length,
      currentStreak: streak,
      personalBests: sessions.filter((s) => s.personalBest).length,
    };
  },
});

// Delete a session
export const deleteSession = mutation({
  args: {
    token: v.string(),
    sessionId: v.id("practiceSessions"),
  },
  handler: async (ctx, args) => {
    // Verify token
    const sessionToken = await ctx.db
      .query("sessionTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!sessionToken || sessionToken.expiresAt < Date.now()) {
      throw new Error("Invalid or expired token");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Verify ownership
    if (session.userId !== sessionToken.userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(sessionToken.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user stats
    await ctx.db.patch(sessionToken.userId, {
      totalSessions: Math.max(0, user.totalSessions - 1),
      totalDuration: Math.max(0, user.totalDuration - session.duration),
    });

    // Delete session
    await ctx.db.delete(args.sessionId);

    return { success: true };
  },
});
