#!/bin/bash

# Quick deployment commands for Fashion Vault email notifications
# Run these commands one by one
# SECURITY: Never commit API keys! Set them as environment variables

echo "Step 1: Setting Resend API key..."
echo "⚠️  Replace YOUR_RESEND_API_KEY with your actual key from https://resend.com/api-keys"
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY

echo "Step 2: Setting notification email..."
supabase secrets set NOTIFICATION_EMAIL=cass.miecz@gmail.com

echo "Step 3: Linking Supabase project..."
supabase link --project-ref zrohbrzjkpqgfmovrddp

echo "Step 4: Deploying Edge Function..."
supabase functions deploy send-signup-notification --project-ref zrohbrzjkpqgfmovrddp

echo ""
echo "✅ Setup complete! Now create the database webhook in your Supabase Dashboard."
echo "See QUICK_EMAIL_SETUP.md for webhook configuration details."

