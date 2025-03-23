<template>
  <div class="contact-form-container">
    <form @submit.prevent="handleSubmit" class="contact-form">
      <h2>Get a Quote</h2>
      <div class="form-group">
        <label for="firstName">First Name *</label>
        <input
          type="text"
          id="firstName"
          v-model="formData.firstName"
          required
          placeholder="Enter your first name"
        />
      </div>

      <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input
          type="text"
          id="lastName"
          v-model="formData.lastName"
          required
          placeholder="Enter your last name"
        />
      </div>

      <div class="form-group">
        <label for="email">Email Address *</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="Enter your email address"
        />
      </div>

      <div class="form-group">
        <label for="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          required
          placeholder="Enter your phone number"
        />
      </div>

      <button type="submit" class="submit-button" :disabled="isSubmitting">
        {{ isSubmitting ? 'Sending...' : 'Submit' }}
      </button>

      <div v-if="submitStatus" :class="['status-message', submitStatus.type]">
        {{ submitStatus.message }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const isSubmitting = ref(false)
const submitStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const handleSubmit = async () => {
  isSubmitting.value = true
  submitStatus.value = null

  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    submitStatus.value = {
      type: 'success',
      message: 'Thank you! We will contact you soon.',
    }

    // Reset form
    formData.firstName = ''
    formData.lastName = ''
    formData.email = ''
    formData.phone = ''
  } catch (error) {
    submitStatus.value = {
      type: 'error',
      message: 'Sorry, there was an error sending your message. Please try again.',
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-form h2 {
  color: #1b5e20;
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2e7d32;
  font-weight: 500;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1b5e20;
}

.submit-button {
  background: #1b5e20;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: #2e7d32;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status-message {
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.status-message.success {
  background: #e8f5e9;
  color: #1b5e20;
}

.status-message.error {
  background: #ffebee;
  color: #c62828;
}

@media (max-width: 768px) {
  .contact-form-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
