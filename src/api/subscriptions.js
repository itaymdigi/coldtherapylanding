/**
 * Subscriptions API
 * Replaces convex/subscriptions.ts
 */

import { supabase, query, mutation } from '../lib/supabase';

// Check subscription
export async function checkSubscription({ userEmail }) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_email', userEmail)
    .eq('status', 'active')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Get all subscriptions
export async function getAllSubscriptions() {
  return await query.getAll('subscriptions', {
    orderBy: 'created_at',
    ascending: false,
  });
}

// Create subscription
export async function createSubscription({
  userId,
  userName,
  userEmail,
  plan,
  status,
  stripeCustomerId,
  stripeSubscriptionId,
  startDate,
  endDate,
  autoRenew,
}) {
  return await mutation.insert('subscriptions', {
    user_id: userId,
    user_name: userName,
    user_email: userEmail,
    plan,
    status,
    stripe_customer_id: stripeCustomerId || null,
    stripe_subscription_id: stripeSubscriptionId || null,
    start_date: startDate,
    end_date: endDate,
    auto_renew: autoRenew !== undefined ? autoRenew : true,
  });
}

// Update subscription
export async function updateSubscription({ id, status, endDate, autoRenew }) {
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (endDate !== undefined) updates.end_date = endDate;
  if (autoRenew !== undefined) updates.auto_renew = autoRenew;
  
  return await mutation.update('subscriptions', id, updates);
}

// Cancel subscription
export async function cancelSubscription(id) {
  return await mutation.update('subscriptions', id, {
    status: 'cancelled',
  });
}
