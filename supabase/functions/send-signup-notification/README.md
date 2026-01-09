# Send Signup Notification Edge Function

This Supabase Edge Function sends an email notification via Resend whenever a new signup is added to the `signups` table.

## Setup Instructions

### 1. Deploy the Function

```bash
# Make sure you have the Supabase CLI installed
supabase functions deploy send-signup-notification
```

### 2. Set Environment Variables

Set these secrets in your Supabase project:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
supabase secrets set NOTIFICATION_EMAIL=your-email@example.com
```

### 3. Create a Database Webhook

In your Supabase Dashboard:

1. Go to **Database** > **Webhooks**
2. Click **Create a new webhook**
3. Configure:
   - **Name**: `signup-notification-webhook`
   - **Table**: `signups`
   - **Events**: Select `INSERT`
   - **Type**: `HTTP Request`
   - **HTTP Request**:
     - **Method**: `POST`
     - **URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-signup-notification`
     - **HTTP Headers**: 
       - `Authorization`: `Bearer YOUR_SERVICE_ROLE_KEY`
       - `Content-Type`: `application/json`

### 4. Resend Setup

1. Sign up for a free account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain (or use their test domain for development)
4. Update the `from` email in `index.ts` to match your verified domain

### 5. Test

1. Add a test signup through your website
2. Check your email inbox for the notification
3. Check the Supabase function logs for any errors

## Notes

- The function uses the Supabase service role key for authentication
- Make sure your Resend API key has the correct permissions
- The notification email address can be changed via the `NOTIFICATION_EMAIL` environment variable

