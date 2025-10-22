import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get all instructors
export const getAllInstructors = query({
  handler: async (ctx) => {
    const instructors = await ctx.db.query('instructors').order('desc').collect();
    return instructors;
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
    await ctx.db.patch(id, updates);
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
