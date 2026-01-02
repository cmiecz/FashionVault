-- Migration: Create signups table for waitlist
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at DESC);

-- Enable Row Level Security
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts (for sign-ups) but no reads (for privacy)
-- Drop existing policy if it exists, then recreate
DROP POLICY IF EXISTS "Allow public inserts" ON signups;
CREATE POLICY "Allow public inserts" ON signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

