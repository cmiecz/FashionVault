-- Test if anonymous inserts work
-- Run this in Supabase SQL Editor to verify the setup

-- First, check if the table exists and has data
SELECT COUNT(*) as total_signups FROM signups;

-- Check the RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'signups';

-- Try a test insert (this should work if RLS is set up correctly)
-- Note: This will fail if the email already exists due to UNIQUE constraint
INSERT INTO signups (email) 
VALUES ('test@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING *;

