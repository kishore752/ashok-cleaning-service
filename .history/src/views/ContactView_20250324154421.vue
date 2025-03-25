<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  service: '',
  preferredDate: '',
  comments: '',
})

const services = [
  'Residential Cleaning',
  'Office Cleaning',
  'Deep Cleaning',
  'Post-Construction Cleaning',
  'Carpet Cleaning',
  'Window Cleaning',
]

const handleSubmit = () => {
  // Handle form submission
  console.log('Form submitted:', form.value)
  // Reset form
  form.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    service: '',
    preferredDate: '',
    comments: '',
  }
}
</script>

<template>
  <div class="contact-view">
    <div class="contact-container">
      <h1>Contact Us</h1>
      <p class="subtitle">Fill out the form below and we'll get back to you shortly</p>

      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter your full name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter your email address"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div class="form-group">
          <label for="address">Address *</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            required
            placeholder="Enter your address"
          />
        </div>

        <div class="form-group">
          <label for="service">Service Required *</label>
          <select id="service" v-model="form.service" required>
            <option value="">Select a service</option>
            <option v-for="service in services" :key="service" :value="service">
              {{ service }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="preferredDate">Preferred Date *</label>
          <input id="preferredDate" v-model="form.preferredDate" type="date" required />
        </div>

        <div class="form-group">
          <label for="comments">Additional Details (Max 200 words)</label>
          <textarea
            id="comments"
            v-model="form.comments"
            rows="6"
            maxlength="1000"
            placeholder="Please describe your requirements in detail..."
          ></textarea>
          <div class="word-count">
            {{ form.comments.split(/\s+/).filter((word) => word.length > 0).length }}/200 words
          </div>
        </div>

        <button type="submit" class="submit-button">Submit Request</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  min-height: 100vh;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1b5e20;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #333;
}

input,
select,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.word-count {
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.submit-button {
  background: #1b5e20;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover {
  background: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .contact-view {
    padding: 2rem 1rem;
  }

  .contact-container {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
