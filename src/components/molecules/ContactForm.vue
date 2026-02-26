<template>
  <div class="contact-form-container">
    <!-- Success Modal Overlay -->
    <Transition name="modal-fade">
      <div v-if="showSuccess" class="success-overlay" @click.self="showSuccess = false">
        <div class="success-modal">
          <div class="success-checkmark">
            <svg class="checkmark-svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2 class="success-title">Request Submitted!</h2>
          <p class="success-subtitle">
            We've received your cleaning request and will contact you within 24 hours.
          </p>
          <div v-if="submissionRef" class="success-ref">
            <span class="ref-label">Reference</span>
            <span class="ref-id">#{{ submissionRef }}</span>
          </div>
          <div class="success-actions">
            <router-link
              v-if="auth.isAuthenticated"
              to="/dashboard"
              class="btn btn-primary success-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M9 19V13H15V19M3 12L12 3L21 12H20V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V12H3Z"
                />
              </svg>
              Go to Dashboard
            </router-link>
            <button type="button" class="btn btn-outline success-btn" @click="resetForm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 5V19M5 12H19" />
              </svg>
              Submit Another Request
            </button>
          </div>
          <p class="success-note">
            📧 A confirmation has been sent to <strong>{{ lastEmail }}</strong>
          </p>
        </div>
      </div>
    </Transition>

    <!-- The Form -->
    <form v-if="!showSuccess" @submit.prevent="handleSubmit" class="contact-form" novalidate>
      <div class="form-header">
        <div class="form-icon">✨</div>
        <h2>Get Your Free Quote</h2>
        <p>Fill in the form below and we'll get back to you within 24 hours.</p>
      </div>

      <div class="form-row">
        <div class="form-group" :class="{ error: errors.firstName }">
          <label for="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            @blur="validateField('firstName')"
            placeholder="Jane"
            autocomplete="given-name"
          />
          <span v-if="errors.firstName" class="error-msg">{{ errors.firstName }}</span>
        </div>
        <div class="form-group" :class="{ error: errors.lastName }">
          <label for="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            @blur="validateField('lastName')"
            placeholder="Smith"
            autocomplete="family-name"
          />
          <span v-if="errors.lastName" class="error-msg">{{ errors.lastName }}</span>
        </div>
      </div>

      <div class="form-group" :class="{ error: errors.email }">
        <label for="email">Email Address *</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          @blur="validateField('email')"
          placeholder="jane@example.com"
          autocomplete="email"
        />
        <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
      </div>

      <div class="form-group" :class="{ error: errors.phone }">
        <label for="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          @blur="validateField('phone')"
          placeholder="(123) 456-7890"
          autocomplete="tel"
        />
        <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
      </div>

      <div class="form-group">
        <label for="service">Service Type</label>
        <select id="service" v-model="formData.service">
          <option value="">Select a service...</option>
          <option value="house">House Cleaning</option>
          <option value="office">Office Cleaning</option>
          <option value="deep">Deep Cleaning</option>
          <option value="movein">Move-In / Move-Out</option>
          <option value="construction">Post-Construction</option>
          <option value="eco">Eco-Friendly Clean</option>
        </select>
      </div>

      <div class="form-group">
        <label for="message">Additional Details</label>
        <textarea
          id="message"
          v-model="formData.message"
          placeholder="Tell us about your space, any special requirements, preferred dates..."
          rows="3"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary submit-btn" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner"></span>
        {{ isSubmitting ? 'Sending...' : 'Send My Request' }}
      </button>

      <Transition name="fade">
        <div v-if="submitError" class="status-msg error">
          <span>❌</span>
          {{ submitError }}
        </div>
      </Transition>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits<{
  (e: 'success', id?: string): void
}>()

const auth = useAuthStore()
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  message: '',
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitError = ref('')
const showSuccess = ref(false)
const submissionRef = ref('')
const lastEmail = ref('')
const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL

function validateField(field: string) {
  delete errors[field]
  if (field === 'firstName' && !formData.firstName.trim()) {
    errors.firstName = 'First name is required'
  }
  if (field === 'lastName' && !formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }
  if (field === 'email') {
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Please enter a valid email'
  }
  if (field === 'phone' && !formData.phone.trim()) {
    errors.phone = 'Phone number is required'
  }
}

function validateAll() {
  ;['firstName', 'lastName', 'email', 'phone'].forEach(validateField)
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateAll()) return
  isSubmitting.value = true
  submitError.value = ''

  try {
    let insertedId = ''

    // 1. Primary: Insert into Supabase
    if (hasSupabase) {
      const { data, error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          user_id: auth.user?.id ?? null,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service_type: formData.service || null,
          message: formData.message?.trim() || null,
        })
        .select('id')
        .single()

      if (dbError) throw dbError
      insertedId = data?.id || ''
    }

    // 2. Optional: Try sending email via Netlify function (fails gracefully in dev)
    try {
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service,
          message: formData.message?.trim(),
        }),
      })
    } catch {
      // Netlify function not available (dev mode) — that's fine, data is saved in DB
      console.info('Email function unavailable (dev mode) — submission saved to database.')
    }

    // 3. Show success
    lastEmail.value = formData.email.trim()
    submissionRef.value = insertedId ? insertedId.slice(0, 8).toUpperCase() : ''
    showSuccess.value = true
    emit('success', insertedId)
  } catch (e) {
    console.error('Submission error:', e)
    submitError.value = 'Something went wrong. Please call us at (123) 456-7890.'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  showSuccess.value = false
  submissionRef.value = ''
  lastEmail.value = ''
  submitError.value = ''
  Object.assign(formData, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
}
</script>

<style scoped>
.contact-form-container {
  padding: var(--space-8);
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.form-icon {
  font-size: 2rem;
  margin-bottom: var(--space-2);
}

.form-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.form-header p {
  font-size: 0.9rem;
  color: var(--gray-500);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-700);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-family: var(--font-sans);
  color: var(--gray-800);
  background: var(--gray-50);
  transition: all var(--transition-fast);
  outline: none;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--brand-primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}

.form-group.error input,
.form-group.error select {
  border-color: #ef4444;
  background: #fff5f5;
}

.form-group textarea {
  resize: vertical;
  min-height: 90px;
}

.error-msg {
  font-size: 0.78rem;
  color: #ef4444;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  padding: 0.9rem;
  font-size: 1rem;
  border-radius: var(--radius-md);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Status */
.status-msg {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
}

.status-msg.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* ── Success Modal ── */
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.success-modal {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-6);
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  animation: modal-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Animated checkmark */
.success-checkmark {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-4);
}

.checkmark-svg {
  width: 72px;
  height: 72px;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #16a34a;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #16a34a;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: stroke 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.success-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.success-subtitle {
  font-size: 0.95rem;
  color: var(--gray-500);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.success-ref {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--green-50);
  border: 1px solid var(--green-200);
  border-radius: var(--radius-full);
  padding: 0.4rem 1rem;
  margin-bottom: var(--space-6);
}

.ref-label {
  font-size: 0.8rem;
  color: var(--gray-500);
  font-weight: 500;
}

.ref-id {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--brand-primary-darker);
  font-family: monospace;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.success-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.75rem 1.2rem;
  font-size: 0.95rem;
  border-radius: var(--radius-md);
  text-decoration: none;
}

.success-note {
  font-size: 0.82rem;
  color: var(--gray-500);
  line-height: 1.5;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .success-modal {
    padding: var(--space-6) var(--space-4);
  }
}
</style>
