import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

// Initialize Resend client
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || 'your-email@example.com';

interface SignupPayload {
  type: 'INSERT';
  table: string;
  record: {
    id: string;
    email: string;
    created_at: string;
  };
}

Deno.serve(async (req: Request) => {
  // Verify the request is from Supabase
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload: SignupPayload = await req.json();
    
    // Only process INSERT events on the signups table
    if (payload.type !== 'INSERT' || payload.table !== 'signups') {
      return new Response(
        JSON.stringify({ message: 'Event not processed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, created_at } = payload.record;

    // Send email notification via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
        body: JSON.stringify({
          from: 'onboarding@resend.dev', // Use Resend test domain, or update with your verified domain
        to: [NOTIFICATION_EMAIL],
        subject: 'New Waitlist Sign-up - Fashion Vault',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #D4A574; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                .info-row { margin: 10px 0; }
                .label { font-weight: bold; color: #2A2320; }
                .value { color: #6B6360; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Waitlist Sign-up</h1>
                </div>
                <div class="content">
                  <p>Someone has joined the Fashion Vault waitlist!</p>
                  <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Signed up at:</span>
                    <span class="value">${new Date(created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `New Waitlist Sign-up\n\nEmail: ${email}\nSigned up at: ${new Date(created_at).toLocaleString()}`,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email notification' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ message: 'Email notification sent successfully', emailId: emailData.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing signup notification:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

