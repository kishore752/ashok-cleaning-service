import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

interface EmailPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  service?: string
  message?: string
}

const SERVICE_LABELS: Record<string, string> = {
  house: 'House Cleaning',
  office: 'Office Cleaning',
  deep: 'Deep Cleaning',
  movein: 'Move-In / Move-Out',
  construction: 'Post-Construction',
  eco: 'Eco-Friendly Clean',
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { firstName, lastName, email, phone, service, message } = JSON.parse(
      event.body || '{}',
    ) as EmailPayload

    if (!firstName || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Sanitise
    const safeName = `${firstName.trim()} ${lastName?.trim() || ''}`.trim()
    const safeEmail = email.trim().toLowerCase()
    const safePhone = phone.trim()
    const safeService = service ? SERVICE_LABELS[service] || service : 'Not specified'
    const safeMessage = message?.trim() || 'No additional details'

    // ── 1. Send admin notification via Resend (or fallback SMTP) ──
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || ''

    if (process.env.RESEND_API_KEY && adminEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Ashok Cleaning <noreply@ashok-cleaning.com>',
          to: [adminEmail],
          subject: `New Quote Request: ${safeName} — ${safeService}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #15803d;">New Quote Request</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(safeName)}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(safePhone)}">${escapeHtml(safePhone)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Service</td><td style="padding: 8px 0;">${escapeHtml(safeService)}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Message</td><td style="padding: 8px 0;">${escapeHtml(safeMessage)}</td></tr>
              </table>
            </div>
          `,
        }),
      })
    } else if (
      process.env.SENDGRID_API_KEY &&
      process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key'
    ) {
      // Fallback to legacy SendGrid
      const sgMail = (await import('@sendgrid/mail')).default
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      await sgMail.send({
        to: adminEmail,
        from: process.env.SENDGRID_FROM_EMAIL || '',
        subject: `New Quote: ${safeName}`,
        html: `<h2>New Quote</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Service:</strong> ${safeService}</p><p><strong>Message:</strong> ${safeMessage}</p>`,
      })
    }

    // ── 2. Send confirmation email to customer ──
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Ashok Cleaning <noreply@ashok-cleaning.com>',
          to: [safeEmail],
          subject: 'We received your quote request!',
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px;">
              <h2 style="color: #15803d;">Thank you, ${escapeHtml(firstName.trim())}!</h2>
              <p style="color: #4b5563; line-height: 1.7;">
                We've received your request for <strong>${escapeHtml(safeService)}</strong> and our team will get back to you within 24 hours.
              </p>
              <p style="color: #4b5563;">If you need immediate help, call us at <a href="tel:+11234567890" style="color: #16a34a;">(123) 456-7890</a>.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">Ashok Cleaning Services</p>
            </div>
          `,
        }),
      })
    }

    // ── 3. Log to notification_logs if supabase is configured ──
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabaseAdmin.from('notification_logs').insert({
        email: safeEmail,
        type: 'confirmation',
        title: 'Quote request received',
        body: `${safeName} requested ${safeService}`,
      })
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export { handler }
