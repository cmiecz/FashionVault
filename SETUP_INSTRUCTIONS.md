# Fashion Vault Sign-up Setup Instructions

This guide will help you set up the waitlist sign-up functionality with Supabase and email notifications.

## Prerequisites

- A Supabase account (free tier works)
- A Resend account for email notifications (free tier works)
- Your Supabase project URL and anon key

## Step 1: Create the Database Table

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_migration.sql`
4. Click **Run** to execute the migration

This will create the `signups` table with proper security policies.

## Step 2: Get Your Supabase Credentials

1. In your Supabase Dashboard, go to **Settings** > **API**
2. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy your **anon public** key

## Step 3: Update the Frontend Configuration

1. Open `scripts.js`
2. Find these lines near the top of the Supabase initialization:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace `YOUR_SUPABASE_URL` with your actual Supabase Project URL
4. Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key

## Step 4: Set Up Resend for Email Notifications

1. Sign up for a free account at [resend.com](https://resend.com)
2. Get your API key from the Resend dashboard
3. Verify your domain (or use their test domain for development)

## Step 5: Deploy the Edge Function

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Set the environment variables:
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key_here
   supabase secrets set NOTIFICATION_EMAIL=your-email@example.com
   ```

5. Deploy the function:
   ```bash
   supabase functions deploy send-signup-notification
   ```

## Step 6: Create the Database Webhook

1. In your Supabase Dashboard, go to **Database** > **Webhooks**
2. Click **Create a new webhook**
3. Configure:
   - **Name**: `signup-notification-webhook`
   - **Table**: `signups`
   - **Events**: Select `INSERT` only
   - **Type**: `HTTP Request`
   - **HTTP Request**:
     - **Method**: `POST`
     - **URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-signup-notification`
     - **HTTP Headers**: 
       - Key: `Authorization`
       - Value: `Bearer YOUR_SERVICE_ROLE_KEY` (get this from Settings > API)
       - Key: `Content-Type`
       - Value: `application/json`

## Step 7: Test the Sign-up Flow

1. Open your website
2. Click any "Sign up" button
3. Enter a test email address
4. Submit the form
5. Check:
   - The success message appears
   - Your email inbox receives a notification
   - The signup appears in your Supabase `signups` table

## Troubleshooting

### Sign-up form doesn't open
- Check browser console for JavaScript errors
- Verify that `scripts.js` is loading correctly

### "Sign-up is not yet configured" message
- Make sure you've updated `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `scripts.js`
- Verify the values are correct (no extra spaces or quotes)

### Email notifications not working
- Check the Supabase function logs in the Dashboard
- Verify your Resend API key is correct
- Make sure the webhook is properly configured
- Check that the `NOTIFICATION_EMAIL` environment variable is set

### Database errors
- Verify the `signups` table was created successfully
- Check that Row Level Security policies are set up correctly
- Ensure the anon key has insert permissions

## Security Notes

- The anon key is safe to use in frontend code (it's public)
- Never expose your service role key in frontend code
- The webhook uses the service role key for authentication
- Email addresses are stored securely in Supabase

