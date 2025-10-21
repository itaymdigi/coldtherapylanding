import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all gallery images
export const getGalleryImages = query({
  handler: async (ctx) => {
    const images = await ctx.db.query('galleryImages').order('asc').collect();
    return images;
  },
});

// Add a new gallery image
export const addGalleryImage = mutation({
  args: {
    url: v.string(),
    order: v.number(),
    altText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const imageId = await ctx.db.insert('galleryImages', {
      url: args.url,
      order: args.order,
      altText: args.altText,
    });
    return imageId;
  },
});

// Update a gallery image
export const updateGalleryImage = mutation({
  args: {
    id: v.id('galleryImages'),
    url: v.string(),
    order: v.optional(v.number()),
    altText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete a gallery image
export const deleteGalleryImage = mutation({
  args: { id: v.id('galleryImages') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
