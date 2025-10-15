import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get active Dan photo
export const getActiveDanPhoto = query({
  handler: async (ctx) => {
    const photo = await ctx.db
      .query("danPhoto")
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
    return photo;
  },
});

// Update Dan's photo
export const updateDanPhoto = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // Deactivate all existing photos
    const existingPhotos = await ctx.db.query("danPhoto").collect();
    for (const photo of existingPhotos) {
      await ctx.db.patch(photo._id, { isActive: false });
    }

    // Add new active photo
    const photoId = await ctx.db.insert("danPhoto", {
      url: args.url,
      isActive: true,
    });
    return photoId;
  },
});
