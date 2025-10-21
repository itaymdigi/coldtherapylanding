import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Check if user has active subscription
export const checkSubscription = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query('subscriptions')
      .filter((q) =>
        q.and(q.eq(q.field('userEmail'), args.userEmail), q.eq(q.field('status'), 'active'))
      )
      .first();

    if (!subscription) return null;

    // Check if subscription is expired (just return null, don't update in query)
    if (subscription.endDate < Date.now()) {
      return null;
    }

    return subscription;
  },
});

// Mark subscription as expired (separate mutation)
export const markSubscriptionExpired = mutation({
  args: { id: v.id('subscriptions') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'expired' });
  },
});

// Get user's subscription
export const getUserSubscription = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('subscriptions')
      .filter((q) => q.eq(q.field('userEmail'), args.userEmail))
      .order('desc')
      .first();
  },
});

// Get all subscriptions (Admin)
export const getAllSubscriptions = query({
  handler: async (ctx) => {
    return await ctx.db.query('subscriptions').order('desc').collect();
  },
});

// Create subscription
export const createSubscription = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    plan: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const duration = args.plan === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

    const subscriptionId = await ctx.db.insert('subscriptions', {
      userId: args.userId,
      userName: args.userName,
      userEmail: args.userEmail,
      plan: args.plan,
      status: 'active',
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      startDate: now,
      endDate: now + duration,
      autoRenew: true,
    });

    return subscriptionId;
  },
});

// Update subscription status
export const updateSubscriptionStatus = mutation({
  args: {
    id: v.id('subscriptions'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Cancel subscription
export const cancelSubscription = mutation({
  args: { id: v.id('subscriptions') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: 'cancelled',
      autoRenew: false,
    });
  },
});

// Renew subscription
export const renewSubscription = mutation({
  args: { id: v.id('subscriptions') },
  handler: async (ctx, args) => {
    const subscription = await ctx.db.get(args.id);
    if (!subscription) return;

    const duration =
      subscription.plan === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const newEndDate = subscription.endDate + duration;

    await ctx.db.patch(args.id, {
      status: 'active',
      endDate: newEndDate,
    });
  },
});
