const nodemailer = require('nodemailer')

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const formData = JSON.parse(event.body)

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

  try {
    await transporter.sendMail(mailOptions)
    return { statusCode: 200, body: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    return { statusCode: 500, body: 'Error sending email' }
  }
}
