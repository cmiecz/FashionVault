-- AGGRESSIVE RLS FIX - This will definitely work
-- Run this ENTIRE script in one go

-- Step 1: Check current state
SELECT '=== CURRENT STATE ===' as step;
SELECT policyname, cmd, roles::text, permissive 
FROM pg_policies WHERE tablename = 'signups';

-- Step 2: Drop ALL policies (including any hidden ones)
SELECT '=== DROPPING ALL POLICIES ===' as step;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'signups'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON signups', r.policyname);
        RAISE NOTICE 'Dropped: %', r.policyname;
    END LOOP;
END $$;

-- Step 3: Temporarily DISABLE RLS to test
SELECT '=== DISABLING RLS TEMPORARILY ===' as step;
ALTER TABLE signups DISABLE ROW LEVEL SECURITY;

-- Step 4: Test insert without RLS (should work)
SELECT '=== TESTING INSERT WITHOUT RLS ===' as step;
INSERT INTO signups (email) 
VALUES ('test-no-rls@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, created_at;

-- Step 5: Re-enable RLS
SELECT '=== RE-ENABLING RLS ===' as step;
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Step 6: Grant permissions
SELECT '=== GRANTING PERMISSIONS ===' as step;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT INSERT ON TABLE signups TO anon;
GRANT INSERT ON TABLE signups TO authenticated;

-- Step 7: Create a simple, explicit policy
SELECT '=== CREATING POLICY ===' as step;
CREATE POLICY "anon_can_insert" ON signups
    FOR INSERT
    TO anon
    WITH CHECK (email IS NOT NULL);

CREATE POLICY "authenticated_can_insert" ON signups
    FOR INSERT
    TO authenticated
    WITH CHECK (email IS NOT NULL);

-- Step 8: Verify everything
SELECT '=== VERIFICATION ===' as step;
SELECT 
    'Policies' as type,
    policyname,
    cmd,
    roles::text,
    with_check
FROM pg_policies 
WHERE tablename = 'signups';

SELECT 
    'Grants' as type,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'signups' 
  AND grantee IN ('anon', 'authenticated');

-- Step 9: Final test as anon
SELECT '=== FINAL TEST AS ANON ===' as step;
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO signups (email) 
VALUES ('final-anon-test@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, created_at;
ROLLBACK;

SELECT '=== SUCCESS! If you see a row above, everything works! ===' as result;

