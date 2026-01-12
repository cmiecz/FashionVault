-- Fix RLS Policy for signups table
-- Run this in your Supabase SQL Editor

-- First, let's check the current policy
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'signups';

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow public inserts" ON signups;

-- Recreate the policy with explicit permissions
-- This allows anonymous users to insert any email
CREATE POLICY "Allow public inserts" ON signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
    policyname,
    cmd as operation,
    roles,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'signups';

-- Test that RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'signups';

