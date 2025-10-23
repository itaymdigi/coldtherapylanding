import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Simple hash function (in production, use bcrypt or similar)
function hashPassword(password: string): string {
  // This is a simple hash - in production use proper bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Register new user
export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      email: args.email,
      name: args.name,
      phone: args.phone,
      gender: args.gender || 'male',
      passwordHash: hashPassword(args.password),
      createdAt: Date.now(),
      totalSessions: 0,
      totalDuration: 0,
    });

    // Create session token
    const token = generateToken();
    await ctx.db.insert('sessionTokens', {
      userId,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      createdAt: Date.now(),
    });

    return {
      success: true,
      token,
      user: {
        id: userId,
        email: args.email,
        name: args.name,
        phone: args.phone,
        gender: args.gender || 'male',
      },
    };
  },
});

// Login user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (user.passwordHash !== hashPassword(args.password)) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    // Create new session token
    const token = generateToken();
    await ctx.db.insert('sessionTokens', {
      userId: user._id,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      createdAt: Date.now(),
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        gender: user.gender || 'male',
        totalSessions: user.totalSessions,
        totalDuration: user.totalDuration,
      },
    };
  },
});

// Verify token and get user
export const verifyToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionToken = await ctx.db
      .query('sessionTokens')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!sessionToken || sessionToken.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(sessionToken.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      gender: user.gender || 'male',
      totalSessions: user.totalSessions,
      totalDuration: user.totalDuration,
      lastLoginAt: user.lastLoginAt,
    };
  },
});

// Logout user
export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionToken = await ctx.db
      .query('sessionTokens')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (sessionToken) {
      await ctx.db.delete(sessionToken._id);
    }

    return { success: true };
  },
});

// Admin authentication
// Note: In production, store admin password hash in environment variable
const ADMIN_PASSWORD_HASH = hashPassword('Coldislife'); // TODO: Move to env variable

export const adminLogin = mutation({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin password
    if (hashPassword(args.password) !== ADMIN_PASSWORD_HASH) {
      throw new Error('Invalid admin password');
    }

    // Create admin session token
    const token = generateToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await ctx.db.insert('adminSessions', {
      token,
      createdAt: Date.now(),
      expiresAt,
      lastActivityAt: Date.now(),
    });

    return {
      success: true,
      token,
      expiresAt,
    };
  },
});

export const verifyAdminToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { valid: false };
    }

    return {
      valid: true,
      expiresAt: session.expiresAt,
    };
  },
});

// Update admin session activity (separate mutation)
export const updateAdminActivity = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (session && session.expiresAt > Date.now()) {
      await ctx.db.patch(session._id, {
        lastActivityAt: Date.now(),
      });
    }

    return { success: true };
  },
});

export const adminLogout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});
