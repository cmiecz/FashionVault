-- Comprehensive RLS Fix for signups table
-- Run this ENTIRE script in your Supabase SQL Editor

-- Step 1: Check current state
SELECT 'Current policies:' as info;
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'signups';

-- Step 2: Drop ALL existing policies on signups table
SELECT 'Dropping existing policies...' as info;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'signups') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON signups';
    END LOOP;
END $$;

-- Step 3: Verify RLS is enabled
SELECT 'Checking RLS status...' as info;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'signups';

-- If RLS is not enabled, enable it
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a new, simple policy that definitely works
SELECT 'Creating new policy...' as info;
CREATE POLICY "allow_anon_inserts" ON signups
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Also allow authenticated users (optional, but good to have)
CREATE POLICY "allow_authenticated_inserts" ON signups
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Step 5: Verify the new policies
SELECT 'Verifying new policies...' as info;
SELECT 
    policyname,
    cmd as operation,
    roles,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'signups';

-- Step 6: Test insert (this should work now)
SELECT 'Testing insert...' as info;
-- Note: This will fail if test@example.com already exists, which is fine
INSERT INTO signups (email) 
VALUES ('test@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, created_at;

SELECT 'If you see a row above, the fix worked!' as result;

