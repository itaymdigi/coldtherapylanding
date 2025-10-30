/**
 * Supabase Client Configuration
 * Replaces Convex client
 */

import { createClient } from '@supabase/supabase-js';

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

const readEnvVar = (name) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && name in import.meta.env) {
    return import.meta.env[name];
  }

  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }

  return undefined;
};

const supabaseUrl = readEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = readEnvVar('VITE_SUPABASE_ANON_KEY');

const effectiveSupabaseUrl = supabaseUrl || (isTestEnv ? 'http://localhost:54321' : undefined);
const effectiveSupabaseAnonKey = supabaseAnonKey || (isTestEnv ? 'test-anon-key' : undefined);

if (!effectiveSupabaseUrl || !effectiveSupabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!effectiveSupabaseUrl,
    hasKey: !!effectiveSupabaseAnonKey,
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

if (!isTestEnv) {
  console.log('✅ Initializing Supabase client...');
}

export const supabase = createClient(effectiveSupabaseUrl, effectiveSupabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'cold-therapy-landing',
      'Accept': 'application/json',
    },
  },
});

if (!isTestEnv) {
  console.log('✅ Supabase client initialized successfully');
}

// Dedicated storage client for file uploads (no global headers)
export const storageClient = createClient(effectiveSupabaseUrl, effectiveSupabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  // No global headers to avoid interfering with file uploads
});

// Helper functions to match Convex patterns

/**
 * Query helper - SELECT operations
 */
export const query = {
  /**
   * Get all records from a table
   */
  async getAll(table, options = {}) {
    const { orderBy, ascending = false, limit } = options;
    
    let queryBuilder = supabase.from(table).select('*');
    
    // Only apply ordering if orderBy is specified
    if (orderBy) {
      queryBuilder = queryBuilder.order(orderBy, { ascending });
    }
    
    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single record by ID
   */
  async getById(table, id) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get records with filter
   */
  async getWhere(table, filters, options = {}) {
    const { orderBy, ascending = false, limit } = options;
    
    let queryBuilder = supabase.from(table).select('*');
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
    
    // Only apply ordering if orderBy is specified
    if (orderBy) {
      queryBuilder = queryBuilder.order(orderBy, { ascending });
    }
    
    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) throw error;
    return data || [];
  },
};

/**
 * Mutation helper - INSERT/UPDATE/DELETE operations
 */
export const mutation = {
  /**
   * Insert a new record
   */
  async insert(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  /**
   * Insert multiple records
   */
  async insertMany(table, dataArray) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(dataArray)
      .select();
    
    if (error) throw error;
    return result;
  },

  /**
   * Update a record by ID
   */
  async update(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete a record by ID
   */
  async delete(table, id) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  /**
   * Delete records with filter
   */
  async deleteWhere(table, filters) {
    let queryBuilder = supabase.from(table).delete();
    
    Object.entries(filters).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
    
    const { error } = await queryBuilder;
    
    if (error) throw error;
    return { success: true };
  },
};

/**
 * Real-time subscription helper
 */
export const subscribe = {
  /**
   * Subscribe to table changes
   */
  toTable(table, callback, filter = '*') {
    return supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: filter,
          schema: 'public',
          table: table,
        },
        callback
      )
      .subscribe();
  },

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel) {
    await supabase.removeChannel(channel);
  },
};

/**
 * File storage helper (replaces Convex file storage)
 */
export const storage = {
  /**
   * Upload a file
   */
  async upload(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  /**
   * Delete a file
   */
  async delete(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return { success: true };
  },

  /**
   * List files in a bucket
   */
  async list(bucket, path = '') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);
    
    if (error) throw error;
    return data;
  },
};

/**
 * Auth helper
 */
export const auth = {
  /**
   * Sign up with email and password
   */
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current user
   */
  async getUser(accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error) throw error;
    return user;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
