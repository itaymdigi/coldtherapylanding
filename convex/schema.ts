import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Gallery Images
  galleryImages: defineTable({
    url: v.string(),
    order: v.number(),
    altText: v.optional(v.string()),
  }),

  // Schedule/Event Images
  scheduleImages: defineTable({
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  // Dan's Photo
  danPhoto: defineTable({
    url: v.string(),
    isActive: v.boolean(),
  }),

  // Hero Video
  heroVideo: defineTable({
    url: v.string(),
    isActive: v.boolean(),
    altText: v.optional(v.string()),
  }),

  // Contact Form Submissions
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    submittedAt: v.number(),
  }),

  // Package Bookings
  bookings: defineTable({
    packageType: v.string(), // "10-entries", "6-months", "monthly"
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    status: v.string(), // "pending", "confirmed", "cancelled"
    bookedAt: v.number(),
  }),

  // Settings/Configuration
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }),

  // Breathing Videos
  breathingVideos: defineTable({
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(), // YouTube/Vimeo URL or uploaded video
    thumbnailUrl: v.optional(v.string()),
    duration: v.number(), // in minutes
    difficulty: v.string(), // "beginner", "intermediate", "advanced"
    category: v.string(), // "wim-hof", "box-breathing", "4-7-8", etc.
    isPremium: v.boolean(), // Free or requires subscription
    order: v.number(),
    isPublished: v.boolean(),
    views: v.number(),
    createdAt: v.number(),
  }),

  // User Subscriptions
  subscriptions: defineTable({
    userId: v.string(), // User email or ID
    userName: v.string(),
    userEmail: v.string(),
    plan: v.string(), // "monthly", "yearly"
    status: v.string(), // "active", "cancelled", "expired", "trial"
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    autoRenew: v.boolean(),
  }),

  // Payment Transactions
  payments: defineTable({
    userId: v.string(),
    userEmail: v.string(),
    amount: v.number(),
    currency: v.string(),
    plan: v.string(),
    status: v.string(), // "pending", "completed", "failed", "refunded"
    stripePaymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // User Progress/Watch History
  videoProgress: defineTable({
    userId: v.string(),
    videoId: v.id('breathingVideos'),
    progress: v.number(), // percentage watched
    completed: v.boolean(),
    lastWatchedAt: v.number(),
  }),

  // Media Library
  media: defineTable({
    fileName: v.string(),
    fileType: v.string(), // "image" or "video"
    mimeType: v.string(), // "image/jpeg", "video/mp4", etc.
    fileSize: v.number(), // in bytes
    url: v.string(), // base64 or external URL
    thumbnailUrl: v.optional(v.string()),
    uploadedBy: v.string(),
    uploadedAt: v.number(),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  }),

  // Users for Live Practice
  users: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()), // Changed from required to optional to match inferred schema
    gender: v.optional(v.string()), // "male" or "female"
    passwordHash: v.string(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    totalSessions: v.number(),
    totalDuration: v.number(), // in seconds
  }).index('by_email', ['email']),

  // Practice Sessions
  practiceSessions: defineTable({
    userId: v.id('users'),
    duration: v.number(), // in seconds
    temperature: v.optional(v.number()), // water temperature in Celsius
    notes: v.optional(v.string()),
    mood: v.optional(v.string()), // "excellent", "good", "neutral", "challenging"
    rating: v.optional(v.number()), // star rating from 1-5
    completedAt: v.number(),
    pauseCount: v.number(), // how many times user paused
    personalBest: v.boolean(), // is this a personal record
  })
    .index('by_user', ['userId'])
    .index('by_user_completed', ['userId', 'completedAt']),

  // Session Tokens for authentication
  sessionTokens: defineTable({
    userId: v.id('users'),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_token', ['token'])
    .index('by_user', ['userId']),

  // Admin Sessions for admin panel authentication
  adminSessions: defineTable({
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    lastActivityAt: v.number(),
  }).index('by_token', ['token']),

  // Instructors
  instructors: defineTable({
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    photoUrl: v.string(),
    order: v.number(),
    createdAt: v.number(),
  }),
});
