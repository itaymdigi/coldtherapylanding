import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get active schedule image
export const getActiveScheduleImage = query({
  handler: async (ctx) => {
    const image = await ctx.db
      .query('scheduleImages')
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();
    return image;
  },
});

// Get all schedule images
export const getAllScheduleImages = query({
  handler: async (ctx) => {
    return await ctx.db.query('scheduleImages').collect();
  },
});

// Add schedule image
export const addScheduleImage = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Deactivate all other schedule images
    const existingImages = await ctx.db.query('scheduleImages').collect();
    for (const img of existingImages) {
      await ctx.db.patch(img._id, { isActive: false });
    }

    // Add new active image
    const imageId = await ctx.db.insert('scheduleImages', {
      url: args.url,
      title: args.title,
      description: args.description,
      isActive: true,
    });
    return imageId;
  },
});

// Update schedule image
export const updateScheduleImage = mutation({
  args: {
    id: v.id('scheduleImages'),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // If setting this as active, deactivate others
    if (updates.isActive === true) {
      const allImages = await ctx.db.query('scheduleImages').collect();
      for (const img of allImages) {
        if (img._id !== id) {
          await ctx.db.patch(img._id, { isActive: false });
        }
      }
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete schedule image
export const deleteScheduleImage = mutation({
  args: { id: v.id('scheduleImages') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
