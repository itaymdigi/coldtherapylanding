import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all bookings
export const getAllBookings = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("bookings")
      .order("desc")
      .collect();
  },
});

// Get bookings by status
export const getBookingsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("status"), args.status))
      .order("desc")
      .collect();
  },
});

// Create a new booking
export const createBooking = mutation({
  args: {
    packageType: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      packageType: args.packageType,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      status: "pending",
      bookedAt: Date.now(),
    });
    return bookingId;
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Delete a booking
export const deleteBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
