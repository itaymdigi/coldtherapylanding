import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all media files
export const getAllMedia = query({
  handler: async (ctx) => {
    return await ctx.db.query('media').order('desc').collect();
  },
});

// Get media by type
export const getMediaByType = query({
  args: { fileType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('media')
      .filter((q) => q.eq(q.field('fileType'), args.fileType))
      .order('desc')
      .collect();
  },
});

// Get media by ID
export const getMediaById = query({
  args: { id: v.id('media') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Upload media file
export const uploadMedia = mutation({
  args: {
    fileName: v.string(),
    fileType: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    uploadedBy: v.string(),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const mediaId = await ctx.db.insert('media', {
      fileName: args.fileName,
      fileType: args.fileType,
      mimeType: args.mimeType,
      fileSize: args.fileSize,
      url: args.url,
      thumbnailUrl: args.thumbnailUrl,
      uploadedBy: args.uploadedBy,
      uploadedAt: Date.now(),
      tags: args.tags,
      description: args.description,
    });
    return mediaId;
  },
});

// Update media
export const updateMedia = mutation({
  args: {
    id: v.id('media'),
    fileName: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete media
export const deleteMedia = mutation({
  args: { id: v.id('media') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Search media by tags or filename
export const searchMedia = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allMedia = await ctx.db.query('media').collect();
    const searchLower = args.searchTerm.toLowerCase();

    return allMedia.filter(
      (media) =>
        media.fileName.toLowerCase().includes(searchLower) ||
        media.description?.toLowerCase().includes(searchLower) ||
        media.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  },
});
