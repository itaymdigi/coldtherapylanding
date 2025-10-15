import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    videoId: v.id("breathingVideos"),
    progress: v.number(), // percentage watched
    completed: v.boolean(),
    lastWatchedAt: v.number(),
  }),
});
