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
});
