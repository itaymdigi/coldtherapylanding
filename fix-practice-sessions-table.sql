-- Fix practice_sessions table - add missing completed_at column
-- This column is required for tracking when ice bath sessions were completed

-- Add completed_at column if it doesn't exist
ALTER TABLE practice_sessions 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for performance (user_id + completed_at queries)
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_completed 
ON practice_sessions(user_id, completed_at DESC);

-- Add comment for documentation
COMMENT ON COLUMN practice_sessions.completed_at IS 'Timestamp when the ice bath session was completed';
