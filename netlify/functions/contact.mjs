import nodemailer from 'nodemailer'

export const handler = async function (event, context) {
  // Log request details
  console.log('Function invoked with method:', event.httpMethod)
  console.log('Headers:', event.headers)

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    // Log environment variables (without sensitive data)
    console.log('Environment check:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasNotificationEmail: !!process.env.NOTIFICATION_EMAIL,
    })

    const formData = JSON.parse(event.body)
    console.log('Received form data:', {
      ...formData,
      email: '***@***.com', // Hide actual email for security
    })

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Address:</strong> ${formData.address}</p>
        <p><strong>Postcode:</strong> ${formData.postcode}</p>
        <p><strong>Service:</strong> ${formData.service}</p>
        <p><strong>Preferred Date:</strong> ${formData.preferredDate}</p>
        <p><strong>Comments:</strong> ${formData.comments}</p>
      `,
    }

    // Send email
    console.log('Attempting to send email...')
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Email sent successfully',
      }),
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error.message,
      }),
    }
  }
}
