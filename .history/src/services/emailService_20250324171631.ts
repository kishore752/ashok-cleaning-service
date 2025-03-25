interface ContactFormData {
  name: string
  email: string
  phone: string
  address: string
  postcode: string
  service: string
  preferredDate: string
  comments: string
  recaptchaToken: string
}

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
