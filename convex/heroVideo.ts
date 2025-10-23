import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get active hero video
export const getActiveHeroVideo = query({
  handler: async (ctx) => {
    const videos = await ctx.db
      .query('heroVideo')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
    return videos[0] || null;
  },
});

// Get all hero videos
export const getAllHeroVideos = query({
  handler: async (ctx) => {
    return await ctx.db.query('heroVideo').collect();
  },
});

// Upload/Add hero video
export const uploadHeroVideo = mutation({
  args: {
    url: v.string(),
    altText: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // If this video is set to active, deactivate all others
    if (args.isActive) {
      const existingVideos = await ctx.db.query('heroVideo').collect();
      for (const video of existingVideos) {
        await ctx.db.patch(video._id, { isActive: false });
      }
    }

    const videoId = await ctx.db.insert('heroVideo', {
      url: args.url,
      altText: args.altText,
      isActive: args.isActive,
    });
    return videoId;
  },
});

// Update hero video
export const updateHeroVideo = mutation({
  args: {
    id: v.id('heroVideo'),
    url: v.optional(v.string()),
    altText: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // If setting this video to active, deactivate all others
    if (updates.isActive) {
      const existingVideos = await ctx.db.query('heroVideo').collect();
      for (const video of existingVideos) {
        if (video._id !== id) {
          await ctx.db.patch(video._id, { isActive: false });
        }
      }
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete hero video
export const deleteHeroVideo = mutation({
  args: { id: v.id('heroVideo') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
