import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all published videos (free + premium)
export const getAllVideos = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('breathingVideos')
      .filter((q) => q.eq(q.field('isPublished'), true))
      .order('asc')
      .collect();
  },
});

// Get free videos only
export const getFreeVideos = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('breathingVideos')
      .filter((q) => q.and(q.eq(q.field('isPublished'), true), q.eq(q.field('isPremium'), false)))
      .order('asc')
      .collect();
  },
});

// Get premium videos only
export const getPremiumVideos = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('breathingVideos')
      .filter((q) => q.and(q.eq(q.field('isPublished'), true), q.eq(q.field('isPremium'), true)))
      .order('asc')
      .collect();
  },
});

// Get video by ID
export const getVideoById = query({
  args: { id: v.id('breathingVideos') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get videos by category
export const getVideosByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('breathingVideos')
      .filter((q) =>
        q.and(q.eq(q.field('isPublished'), true), q.eq(q.field('category'), args.category))
      )
      .collect();
  },
});

// Add new video (Admin)
export const addVideo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.number(),
    difficulty: v.string(),
    category: v.string(),
    isPremium: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const videoId = await ctx.db.insert('breathingVideos', {
      ...args,
      isPublished: true, // Auto-publish videos
      views: 0,
      createdAt: Date.now(),
    });
    return videoId;
  },
});

// Update video
export const updateVideo = mutation({
  args: {
    id: v.id('breathingVideos'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    difficulty: v.optional(v.string()),
    category: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    order: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Increment video views
export const incrementViews = mutation({
  args: { id: v.id('breathingVideos') },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (video) {
      await ctx.db.patch(args.id, { views: video.views + 1 });
    }
  },
});

// Delete video
export const deleteVideo = mutation({
  args: { id: v.id('breathingVideos') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
