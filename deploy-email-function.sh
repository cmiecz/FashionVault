#!/bin/bash

# Deploy Supabase Edge Function for Email Notifications
# Make sure you have Supabase CLI installed and are logged in

echo "Setting up email notification function..."

# Set the Resend API key
supabase secrets set RESEND_API_KEY=REDACTED_API_KEY

# Set the notification email (replace with your email)
# You'll need to run this command with your actual email:
# supabase secrets set NOTIFICATION_EMAIL=your-email@example.com

echo "Please run the following command with your notification email:"
echo "supabase secrets set NOTIFICATION_EMAIL=your-email@example.com"
echo ""
echo "Then deploy the function with:"
echo "supabase functions deploy send-signup-notification --project-ref zrohbrzjkpqgfmovrddp"

