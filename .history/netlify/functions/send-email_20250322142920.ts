import { Handler } from '@netlify/functions'
import { createTransport } from 'nodemailer'

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }

  try {
    const { firstName, lastName, email, phone } = JSON.parse(event.body || '{}')

    // Create email transporter
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Only use this in development
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

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
