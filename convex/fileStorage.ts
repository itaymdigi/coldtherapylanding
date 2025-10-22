import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Convex File Storage System
 * 
 * This module provides a comprehensive file storage solution using Convex's built-in file storage.
 * It handles file uploads, metadata management, and retrieval.
 * 
 * Features:
 * - Upload files with automatic metadata tracking
 * - Support for images, videos, and documents
 * - File categorization and tagging
 * - Storage usage tracking
 * - File deletion and cleanup
 */

// Generate a storage URL for uploaded files
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata after upload
export const saveFileMetadata = mutation({
  args: {
    storageId: v.string(),
    fileName: v.string(),
    fileType: v.string(), // 'image', 'video', 'document'
    mimeType: v.string(),
    fileSize: v.number(),
    category: v.optional(v.string()), // 'instructor', 'gallery', 'hero', 'schedule', etc.
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    uploadedBy: v.string(), // user email or 'admin'
  },
  handler: async (ctx, args) => {
    const fileId = await ctx.db.insert('media', {
      fileName: args.fileName,
      fileType: args.fileType,
      mimeType: args.mimeType,
      fileSize: args.fileSize,
      url: args.storageId, // Store the storage ID
      thumbnailUrl: undefined,
      uploadedBy: args.uploadedBy,
      uploadedAt: Date.now(),
      tags: args.tags,
      description: args.description,
    });

    return fileId;
  },
});

// Get file URL from storage ID
export const getFileUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get all files with optional filtering
export const getAllFiles = query({
  args: {
    fileType: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('media');

    // Apply filters
    const files = await query.collect();

    // Filter by fileType if provided
    let filtered = files;
    if (args.fileType) {
      filtered = filtered.filter((f) => f.fileType === args.fileType);
    }

    // Apply limit if provided
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    // Get URLs for all files
    const filesWithUrls = await Promise.all(
      filtered.map(async (file) => {
        const url = await ctx.storage.getUrl(file.url);
        return {
          ...file,
          url: url || file.url,
        };
      })
    );

    return filesWithUrls;
  },
});

// Get file by ID
export const getFileById = query({
  args: {
    fileId: v.id('media'),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) return null;

    const url = await ctx.storage.getUrl(file.url);
    return {
      ...file,
      url: url || file.url,
    };
  },
});

// Delete file
export const deleteFile = mutation({
  args: {
    fileId: v.id('media'),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Delete from storage
    await ctx.storage.delete(file.url);

    // Delete metadata
    await ctx.db.delete(args.fileId);

    return { success: true };
  },
});

// Get storage statistics
export const getStorageStats = query({
  handler: async (ctx) => {
    const files = await ctx.db.query('media').collect();

    const stats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.fileSize, 0),
      byType: {} as Record<string, { count: number; size: number }>,
      recentUploads: files
        .sort((a, b) => b.uploadedAt - a.uploadedAt)
        .slice(0, 10)
        .map((f) => ({
          id: f._id,
          fileName: f.fileName,
          fileType: f.fileType,
          fileSize: f.fileSize,
          uploadedAt: f.uploadedAt,
        })),
    };

    // Calculate stats by type
    files.forEach((file) => {
      if (!stats.byType[file.fileType]) {
        stats.byType[file.fileType] = { count: 0, size: 0 };
      }
      stats.byType[file.fileType].count++;
      stats.byType[file.fileType].size += file.fileSize;
    });

    return stats;
  },
});

// Search files by name or tags
export const searchFiles = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const files = await ctx.db.query('media').collect();

    const searchLower = args.searchTerm.toLowerCase();
    const filtered = files.filter(
      (file) =>
        file.fileName.toLowerCase().includes(searchLower) ||
        file.description?.toLowerCase().includes(searchLower) ||
        file.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );

    // Get URLs for filtered files
    const filesWithUrls = await Promise.all(
      filtered.map(async (file) => {
        const url = await ctx.storage.getUrl(file.url);
        return {
          ...file,
          url: url || file.url,
        };
      })
    );

    return filesWithUrls;
  },
});

// Update file metadata
export const updateFileMetadata = mutation({
  args: {
    fileId: v.id('media'),
    fileName: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { fileId, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(fileId, cleanUpdates);
    return fileId;
  },
});
