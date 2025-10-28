/**
 * Run SQL migration via Supabase Management API
 */

import 'dotenv/config';

const projectRef = 'hqumvakozmicqfrbjssr';
const sql = `
ALTER TABLE practice_sessions 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_completed 
ON practice_sessions(user_id, completed_at DESC);

COMMENT ON COLUMN practice_sessions.completed_at 
IS 'Timestamp when the ice bath session was completed';
`;

console.log('\n📋 SQL Migration to run:\n');
console.log(sql);
console.log('\n🔗 Please run this SQL manually in Supabase SQL Editor:');
console.log(`https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
console.log('Steps:');
console.log('1. Click the link above');
console.log('2. Paste the SQL shown above');
console.log('3. Click "Run" button');
console.log('4. Verify you see "Success. No rows returned"\n');
