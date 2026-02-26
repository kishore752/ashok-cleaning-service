import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Resend is used for transactional email. Twilio for SMS.
// Both require env vars set in Netlify dashboard (not VITE_ prefix).
// If neither is configured, we still log to DB.

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

interface NotifyPayload {
  userId?: string
  email?: string
  phone?: string
  type: 'confirmation' | 'update' | 'promo' | 'reminder'
  title: string
  body: string
  channels?: ('email' | 'sms')[]
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const payload: NotifyPayload = JSON.parse(event.body || '{}')

    if (!payload.title || !payload.type) {
      return { statusCode: 400, body: JSON.stringify({ error: 'title and type are required' }) }
    }

    const channels = payload.channels || ['email']
    const results: Record<string, string> = {}

    // ── Check consent ──────────────────────────────────────
    // If we have a userId, check their profile preferences.
    // Marketing (promo) channels are ONLY sent if user has opted in.
    let profile: {
      email_notifications: boolean
      email_promos: boolean
      sms_optin: boolean
    } | null = null

    if (payload.userId) {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('email_notifications, email_promos, sms_optin')
        .eq('id', payload.userId)
        .single()
      profile = data
    }

    // Evaluate consent per channel
    const shouldSendEmail = channels.includes('email') && shouldSend('email', payload.type, profile)
    const shouldSendSms = channels.includes('sms') && shouldSend('sms', payload.type, profile)

    // ── Send email via Resend ───────────────────────────────
    if (shouldSendEmail && payload.email && process.env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Ashok Cleaning <noreply@ashok-cleaning.com>',
            to: [payload.email],
            subject: payload.title,
            html: buildEmailHtml(payload.title, payload.body),
          }),
        })
        results.email = res.ok ? 'sent' : `failed (${res.status})`
      } catch (e) {
        results.email = `error: ${e instanceof Error ? e.message : String(e)}`
      }
    } else if (shouldSendEmail) {
      results.email = 'skipped (no API key or no email)'
    } else {
      results.email = 'skipped (not consented or not requested)'
    }

    // ── Send SMS via Twilio ─────────────────────────────────
    if (shouldSendSms && payload.phone && process.env.TWILIO_ACCOUNT_SID) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`
        const body = new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER || '',
          To: payload.phone,
          Body: `${payload.title}\n${payload.body}`.slice(0, 1600),
        })
        const res = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(
                `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
              ).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        })
        results.sms = res.ok ? 'sent' : `failed (${res.status})`
      } catch (e) {
        results.sms = `error: ${e instanceof Error ? e.message : String(e)}`
      }
    } else if (shouldSendSms) {
      results.sms = 'skipped (no credentials or no phone)'
    } else {
      results.sms = 'skipped (not consented or not requested)'
    }

    // ── Log to DB ───────────────────────────────────────────
    await supabaseAdmin.from('notification_logs').insert({
      user_id: payload.userId || null,
      email: payload.email || null,
      type: payload.type,
      title: payload.title,
      body: payload.body,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, channels: results }),
    }
  } catch (error) {
    console.error('Notify error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error' }),
    }
  }
}

/**
 * Decide if a particular channel + notification type is allowed.
 * - Transactional (confirmation, update, reminder): always allowed.
 * - Promo: requires opt-in.
 */
function shouldSend(
  channel: 'email' | 'sms',
  type: string,
  profile: { email_notifications: boolean; email_promos: boolean; sms_optin: boolean } | null,
): boolean {
  // No profile → guest; always send transactional, never promo
  if (!profile) return type !== 'promo'

  if (type === 'promo') {
    return channel === 'email' ? profile.email_promos : profile.sms_optin
  }

  // Transactional: for email, honour email_notifications; for SMS, honour sms_optin
  if (channel === 'sms') return profile.sms_optin
  return profile.email_notifications
}

function buildEmailHtml(title: string, body: string): string {
  return `
    <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h2 style="color: #15803d; font-size: 22px; margin: 0;">Ashok Cleaning Services</h2>
      </div>
      <h1 style="font-size: 20px; color: #1f2937; margin-bottom: 12px;">${escapeHtml(title)}</h1>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">${escapeHtml(body)}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        You received this because you have an account with Ashok Cleaning Services.
        <br/>Manage your preferences in your
        <a href="${process.env.SITE_URL || 'https://ashok-cleaning.netlify.app'}/dashboard" style="color: #16a34a;">dashboard</a>.
      </p>
    </div>
  `
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export { handler }
