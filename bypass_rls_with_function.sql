-- BYPASS RLS USING A FUNCTION
-- This creates a function that runs with elevated privileges, bypassing RLS
-- Run this entire script

-- Step 1: Drop existing function if it exists
DROP FUNCTION IF EXISTS public.insert_signup(TEXT);

-- Step 2: Create a function that inserts signups
-- SECURITY DEFINER means it runs with the creator's privileges (bypasses RLS)
CREATE OR REPLACE FUNCTION public.insert_signup(email_address TEXT)
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
    v_email TEXT;
    v_created_at TIMESTAMPTZ;
BEGIN
    INSERT INTO public.signups (email)
    VALUES (email_address)
    ON CONFLICT ON CONSTRAINT signups_email_key DO NOTHING
    RETURNING signups.id, signups.email, signups.created_at
    INTO v_id, v_email, v_created_at;
    
    IF v_id IS NOT NULL THEN
        RETURN QUERY SELECT v_id, v_email, v_created_at;
    END IF;
END;
$$;

-- Step 3: Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.insert_signup(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.insert_signup(TEXT) TO authenticated;

-- Step 4: Test the function
SELECT * FROM public.insert_signup('test-function@example.com');

-- Step 5: Verify it worked
SELECT 'SUCCESS! Function created and tested.' as result;
SELECT COUNT(*) as total_signups FROM signups;

