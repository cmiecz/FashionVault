# Quick Email Notification Setup

Your Resend API key is already configured. Follow these steps to complete the setup:

## Step 1: Set Supabase Secrets

Run these commands in your terminal (make sure you have Supabase CLI installed and are logged in):

```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=re_oSg2yjaZ_JTGccg6LCtPjvZdpiDS7JpdZ

# Set your notification email
supabase secrets set NOTIFICATION_EMAIL=cass.miecz@gmail.com
```

## Step 2: Link Your Project

```bash
supabase link --project-ref zrohbrzjkpqgfmovrddp
```

## Step 3: Deploy the Edge Function

```bash
supabase functions deploy send-signup-notification --project-ref zrohbrzjkpqgfmovrddp
```

## Step 4: Create Database Webhook

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zrohbrzjkpqgfmovrddp
2. Navigate to **Database** > **Webhooks**
3. Click **Create a new webhook**
4. Configure:
   - **Name**: `signup-notification-webhook`
   - **Table**: `signups`
   - **Events**: Select `INSERT` only
   - **Type**: `HTTP Request`
   - **HTTP Request**:
     - **Method**: `POST`
     - **URL**: `https://zrohbrzjkpqgfmovrddp.supabase.co/functions/v1/send-signup-notification`
     - **HTTP Headers**: 
       - Key: `Authorization`
       - Value: `Bearer YOUR_SERVICE_ROLE_KEY` (get this from Settings > API in Supabase Dashboard)
       - Key: `Content-Type`
       - Value: `application/json`

## Step 5: Update Resend Email Domain

In the Edge Function file (`supabase/functions/send-signup-notification/index.ts`), update line 30:
- Change `'Fashion Vault <notifications@fashionvault.com>'` to use your verified Resend domain
- For testing, you can use Resend's test domain: `'onboarding@resend.dev'`

## Testing

1. Test the sign-up form on your website
2. Check your email inbox for the notification
3. Check Supabase function logs if there are any issues

## Troubleshooting

- **Function not deploying**: Make sure you're logged in with `supabase login`
- **Emails not sending**: Check Resend dashboard for API usage and verify your domain
- **Webhook not triggering**: Verify the service role key is correct in the webhook headers

