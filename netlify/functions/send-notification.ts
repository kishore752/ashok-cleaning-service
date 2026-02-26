import { Handler } from '@netlify/functions'
import sgMail from '@sendgrid/mail'

/**
 * Notification service: send emails for updates, promos, and reminders.
 * Call via POST with body: { to, type, title, body? }
 * Or use from cron / Supabase webhook to send ads or updates based on user interactions.
 */
const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const authHeader = event.headers['authorization']
  const secret = process.env.NOTIFICATION_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { to, type, title, body: emailBody } = body as {
      to?: string
      type?: 'confirmation' | 'update' | 'promo' | 'reminder'
      title?: string
      body?: string
    }

    if (!to || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "to" or "title"' }),
      }
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

    const from = process.env.SENDGRID_FROM_EMAIL || ''
    const html = emailBody ? emailBody.replace(/\n/g, '<br/>') : ''

    await sgMail.send({
      to,
      from,
      subject: title,
      html: html || `<p>${title}</p>`,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent', type }),
    }
  } catch (error) {
    console.error('Send notification error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' }),
    }
  }
}

export { handler }
