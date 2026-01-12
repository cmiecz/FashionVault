#!/bin/bash

# Deploy Supabase Edge Function for Email Notifications
# Make sure you have Supabase CLI installed and are logged in
# SECURITY: Never commit API keys! Set them as environment variables

echo "Setting up email notification function..."

# Set the Resend API key
echo "⚠️  IMPORTANT: Replace YOUR_RESEND_API_KEY with your actual key"
echo "Get your API key from: https://resend.com/api-keys"
echo ""
echo "Run this command:"
echo "supabase secrets set RESEND_API_KEY=YOUR_ACTUAL_API_KEY"

# Set the notification email (replace with your email)
echo ""
echo "Then set your notification email:"
echo "supabase secrets set NOTIFICATION_EMAIL=your-email@example.com"
echo ""
echo "Finally, deploy the function with:"
echo "supabase functions deploy send-signup-notification --project-ref zrohbrzjkpqgfmovrddp"

