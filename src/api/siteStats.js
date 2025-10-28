/**
 * Site Stats API
 * Replaces convex/siteStats.ts
 */

import { supabase } from '../lib/supabase';

// Get site stats
export async function getSiteStats() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'site_stats')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    // If no stats exist, return defaults
    return {
      totalSessions: 0,
      satisfactionRate: 0,
      totalClients: 0,
      averageTemp: 0,
    };
  }
  
  if (!data) {
    return {
      sessions: 0,
      satisfaction: 0,
      clients: 0,
      temp: 0,
    };
  }

  const parsed = JSON.parse(data.value);

  return {
    sessions: parsed.sessions ?? parsed.totalSessions ?? 0,
    satisfaction: parsed.satisfaction ?? parsed.satisfactionRate ?? 0,
    clients: parsed.clients ?? parsed.totalClients ?? 0,
    temp: parsed.temp ?? parsed.averageTemp ?? 0,
  };
}

// Update site stats
export async function updateSiteStats({ totalSessions, satisfactionRate, totalClients, averageTemp }) {
  const stats = {
    totalSessions,
    satisfactionRate,
    totalClients,
    averageTemp,
  };
  
  // Check if stats exist
  const { data: existing } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'site_stats')
    .single();
  
  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('settings')
      .update({ value: JSON.stringify(stats) })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('settings')
      .insert({ key: 'site_stats', value: JSON.stringify(stats) })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
