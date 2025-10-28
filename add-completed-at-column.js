/**
 * Add completed_at column to practice_sessions table
 * Run with: node add-completed-at-column.js
 */

import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

// Parse Supabase connection string
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Could not parse project ref from SUPABASE_URL');
  process.exit(1);
}

// Construct direct PostgreSQL connection string
// Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
console.log('\n⚠️  Direct PostgreSQL connection required');
console.log('Please provide your database password from:');
console.log(`https://supabase.com/dashboard/project/${projectRef}/settings/database\n`);

const readline = await import('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter database password: ', async (password) => {
  rl.close();

  const connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Add completed_at column
    console.log('1. Adding completed_at column...');
    await client.query(`
      ALTER TABLE practice_sessions 
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW();
    `);
    console.log('✅ Column added!\n');

    // Create index
    console.log('2. Creating index...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_completed 
      ON practice_sessions(user_id, completed_at DESC);
    `);
    console.log('✅ Index created!\n');

    // Add comment
    console.log('3. Adding documentation...');
    await client.query(`
      COMMENT ON COLUMN practice_sessions.completed_at 
      IS 'Timestamp when the ice bath session was completed';
    `);
    console.log('✅ Documentation added!\n');

    // Verify
    console.log('4. Verifying table structure...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'practice_sessions'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Table structure:');
    console.table(result.rows);

    console.log('\n🎉 Migration completed successfully!');
    console.log('You can now save practice sessions at /live-practice\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nAlternative: Run this SQL manually in Supabase SQL Editor:');
    console.error(`https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
    console.error('SQL:');
    console.error(`
ALTER TABLE practice_sessions 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_completed 
ON practice_sessions(user_id, completed_at DESC);

COMMENT ON COLUMN practice_sessions.completed_at 
IS 'Timestamp when the ice bath session was completed';
    `);
  } finally {
    await client.end();
  }
});
