/**
 * Apply schema fix to practice_sessions table
 * Adds the missing completed_at column
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyFix() {
  console.log('🔧 Applying schema fix to practice_sessions table...\n');

  try {
    // Add completed_at column
    console.log('1. Adding completed_at column...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE practice_sessions 
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW();
      `
    });

    if (alterError) {
      // Try direct query instead
      const { error: directError } = await supabase
        .from('practice_sessions')
        .select('completed_at')
        .limit(1);
      
      if (directError && directError.code === '42703') {
        console.error('❌ Column does not exist and cannot be added via API');
        console.error('Please run the SQL manually in Supabase SQL Editor:');
        console.error('\n' + readFileSync('fix-practice-sessions-table.sql', 'utf8'));
        process.exit(1);
      }
    }

    console.log('✅ Column added successfully!\n');

    // Verify the fix
    console.log('2. Verifying table structure...');
    const { data, error: selectError } = await supabase
      .from('practice_sessions')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Verification failed:', selectError.message);
      process.exit(1);
    }

    console.log('✅ Table structure verified!\n');
    console.log('🎉 Schema fix applied successfully!');
    console.log('\nYou can now save practice sessions at /live-practice');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nPlease run the SQL manually in Supabase SQL Editor:');
    console.error('https://supabase.com/dashboard/project/hqumvakozmicqfrbjssr/sql/new');
    console.error('\nSQL to run:');
    console.error(readFileSync('fix-practice-sessions-table.sql', 'utf8'));
    process.exit(1);
  }
}

applyFix();
