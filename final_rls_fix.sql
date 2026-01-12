-- FINAL RLS FIX - Run this entire script
-- This will completely fix the RLS issue

-- Step 1: Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'signups') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON signups';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Step 2: Grant direct INSERT permission to anon and authenticated roles
GRANT INSERT ON TABLE signups TO anon;
GRANT INSERT ON TABLE signups TO authenticated;

-- Step 3: Ensure RLS is enabled
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a PERMISSIVE policy (not restrictive)
-- Using PERMISSIVE ensures it allows the operation
CREATE POLICY "anon_insert_signups" ON signups
    AS PERMISSIVE
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "authenticated_insert_signups" ON signups
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Step 5: Verify grants
SELECT 
    'Grants' as info,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND table_name = 'signups'
  AND grantee IN ('anon', 'authenticated');

-- Step 6: Verify policies
SELECT 
    'Policies' as info,
    policyname,
    cmd as operation,
    roles::text,
    permissive,
    with_check
FROM pg_policies 
WHERE tablename = 'signups';

-- Step 7: Test as anon role
SET ROLE anon;
INSERT INTO signups (email) 
VALUES ('final-test@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, created_at;
RESET ROLE;

SELECT 'SUCCESS! If you see a row above, the fix worked!' as result;

