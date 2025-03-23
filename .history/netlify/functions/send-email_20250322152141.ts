import { Handler } from '@netlify/functions'
import sgMail from '@sendgrid/mail'

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }

  try {
    const { firstName, lastName, email, phone } = JSON.parse(event.body || '{}')

    // Initialize SendGrid with your API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

    const msg = {
      to: process.env.ADMIN_EMAIL || '',
      from: process.env.SENDGRID_FROM_EMAIL || '',
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    }

    await sgMail.send(msg)

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

export { handler }
