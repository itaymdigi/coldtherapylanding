import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all payments (Admin)
export const getAllPayments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("payments")
      .order("desc")
      .collect();
  },
});

// Get user payments
export const getUserPayments = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .order("desc")
      .collect();
  },
});

// Create payment record
export const createPayment = mutation({
  args: {
    userId: v.string(),
    userEmail: v.string(),
    amount: v.number(),
    currency: v.string(),
    plan: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      userId: args.userId,
      userEmail: args.userEmail,
      amount: args.amount,
      currency: args.currency,
      plan: args.plan,
      status: "pending",
      stripePaymentIntentId: args.stripePaymentIntentId,
      createdAt: Date.now(),
    });
    return paymentId;
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
