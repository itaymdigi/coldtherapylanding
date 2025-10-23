import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get all instructors
export const getAllInstructors = query({
  handler: async (ctx) => {
    const instructors = await ctx.db.query('instructors').order('desc').collect();

    // Resolve storage IDs to URLs for each instructor using the dedicated function
    const instructorsWithUrls = await Promise.all(
      instructors.map(async (instructor) => {
        let photoUrl = instructor.photoUrl;

        // If photoUrl is a storage ID (not a full URL), resolve it
        if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('data:')) {
          try {
            const url = await ctx.storage.getUrl(photoUrl);
            photoUrl =
              url ||
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInstructor%3C/text%3E%3C/svg%3E';
          } catch {
            // Use default image if URL resolution fails
            photoUrl =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInstructor%3C/text%3E%3C/svg%3E';
          }
        }

        return {
          ...instructor,
          photoUrl,
        };
      })
    );

    return instructorsWithUrls;
  },
});

// Add new instructor
export const addInstructor = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    photoUrl: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const instructorId = await ctx.db.insert('instructors', {
      name: args.name,
      title: args.title,
      bio: args.bio,
      photoUrl: args.photoUrl,
      order: args.order,
      createdAt: Date.now(),
    });
    return instructorId;
  },
});

// Update instructor
export const updateInstructor = mutation({
  args: {
    id: v.id('instructors'),
    name: v.string(),
    title: v.string(),
    bio: v.string(),
    photoUrl: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Don't update createdAt - it should remain unchanged
    await ctx.db.patch(id, {
      name: updates.name,
      title: updates.title,
      bio: updates.bio,
      photoUrl: updates.photoUrl,
      order: updates.order,
    });
    return id;
  },
});

// Delete instructor
export const deleteInstructor = mutation({
  args: {
    id: v.id('instructors'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
