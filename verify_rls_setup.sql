-- Verify RLS Setup - Run this to check current state
-- This will show you exactly what policies exist and their configuration

-- 1. Check all policies on signups table
SELECT 
    'Policy Details' as check_type,
    policyname,
    cmd as operation,
    roles::text as roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'signups';

-- 2. Check RLS status
SELECT 
    'RLS Status' as check_type,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'signups';

-- 3. Check table permissions for anon role
SELECT 
    'Table Permissions' as check_type,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND table_name = 'signups'
  AND grantee IN ('anon', 'authenticated', 'public');

-- 4. Try a direct test insert as anon role
-- This simulates what the web app does
SET ROLE anon;
INSERT INTO signups (email) 
VALUES ('test-anon-role@example.com')
ON CONFLICT (email) DO NOTHING
RETURNING id, email, created_at;
RESET ROLE;

-- 5. Show current signups count
SELECT 
    'Current Signups' as check_type,
    COUNT(*) as total_signups
FROM signups;

