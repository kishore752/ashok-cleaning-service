<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sendContactEmail } from '@/services/emailService'

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: any
          AutocompleteService: any
          PlacesServiceStatus: {
            OK: string
            ERROR: string
            INVALID_REQUEST: string
            OVER_QUERY_LIMIT: string
            REQUEST_DENIED: string
            UNKNOWN_ERROR: string
            ZERO_RESULTS: string
          }
        }
      }
    }
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface Place {
  address_components: AddressComponent[]
  formatted_address: string
}

interface Prediction {
  description: string
  place_id: string
}

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
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

const addressAutocomplete = ref<any>(null)
const addressInput = ref<HTMLInputElement | null>(null)
const postcodeInput = ref<HTMLInputElement | null>(null)
const isPostcodeValid = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const selectedService = ref('')

const initGooglePlaces = () => {
  console.log('Initializing Google Places...')
  if (addressInput.value && window.google?.maps?.places) {
    console.log('Google Places API is available')
    const options = {
      componentRestrictions: { country: 'gb' },
      fields: ['address_components', 'formatted_address'],
      types: ['address'],
    }

    try {
      addressAutocomplete.value = new window.google.maps.places.Autocomplete(
        addressInput.value,
        options,
      )
      console.log('Autocomplete initialized successfully')

      // Show suggestions when typing
      addressInput.value.addEventListener('input', () => {
        const inputValue = addressInput.value?.value
        console.log('Input value changed:', inputValue)
        if (inputValue && inputValue.length > 0) {
          isLoading.value = true
          console.log('Fetching place predictions...')
          const service = new window.google.maps.places.AutocompleteService()
          service.getPlacePredictions(
            {
              input: inputValue,
              componentRestrictions: { country: 'gb' },
              types: ['address'],
            },
            (predictions: Prediction[] | null, status: string) => {
              console.log('Predictions response:', { predictions, status })
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                console.log('Successfully got predictions:', predictions)
              } else {
                console.log('Error getting predictions:', status)
              }
              isLoading.value = false
            },
          )
        } else {
          isLoading.value = false
        }
      })

      addressAutocomplete.value.addListener('place_changed', () => {
        console.log('Place changed event triggered')
        try {
          const place = addressAutocomplete.value?.getPlace() as Place
          console.log('Selected place:', place)
          if (place.address_components) {
            // Find postcode from address components
            const postcodeComponent = place.address_components.find((component: AddressComponent) =>
              component.types.includes('postal_code'),
            )
            if (postcodeComponent) {
              formData.value.postcode = postcodeComponent.long_name
              console.log('Updated postcode:', postcodeComponent.long_name)
              validatePostcode(postcodeComponent.long_name)
            }

            // Create address without postcode
            const addressComponents = place.address_components.filter(
              (component: AddressComponent) => !component.types.includes('postal_code'),
            )
            formData.value.address = addressComponents
              .map((component: AddressComponent) => component.long_name)
              .join(', ')
            console.log('Updated address:', formData.value.address)

            // Close the dropdown
            if (addressInput.value) {
              addressInput.value.blur()
            }
          }
        } catch (error) {
          console.error('Error getting place details:', error)
        } finally {
          isLoading.value = false
        }
      })
    } catch (error) {
      console.error('Error initializing Google Places:', error)
    }
  } else {
    console.error('Google Places API not available')
  }
}

const validatePostcode = (postcode: string) => {
  // UK postcode validation regex
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
  isPostcodeValid.value = postcodeRegex.test(postcode)
}

const handlePostcodeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  validatePostcode(target.value)
}

const verifyRecaptcha = async () => {
  return new Promise<string>((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute('6LeC4v4qAAAAANk9WzyXviWSUE8FKOBEEc5jymLy', {
          action: 'submit',
        })
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  })
}

const handleSubmit = async () => {
  if (!isPostcodeValid.value) {
    alert('Please enter a valid UK postcode')
    return
  }

  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const recaptchaToken = await verifyRecaptcha()

    // Send email notification
    await sendContactEmail({
      ...formData.value,
      recaptchaToken,
    })

    // Show success message
    alert('Thank you for your message. We will get back to you shortly!')

    // Reset form
    formData.value = {
      name: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      service: '',
      preferredDate: '',
      comments: '',
    }
    isPostcodeValid.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error submitting the form. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  console.log('Component mounted, checking Google Maps API...')
  // Wait for Google Maps API to load
  if (window.google?.maps?.places) {
    console.log('Google Maps API is available on mount')
    initGooglePlaces()
  } else {
    console.log('Waiting for Google Maps API to load...')
    const checkGoogleMaps = setInterval(() => {
      if (window.google?.maps?.places) {
        console.log('Google Maps API loaded, initializing...')
        initGooglePlaces()
        clearInterval(checkGoogleMaps)
      }
    }, 100)
  }

  // Check for pre-selected service
  const service = localStorage.getItem('selectedService')
  if (service) {
    selectedService.value = service
    formData.value.service = service
    // Clear the localStorage after getting the value
    localStorage.removeItem('selectedService')
  }
})
</script>

<template>
  <div class="contact-view">
    <div class="contact-container">
      <h1>Contact Us</h1>
      <p class="subtitle">Fill out the form below and we'll get back to you shortly</p>

      <form
        @submit.prevent="handleSubmit"
        class="contact-form"
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-recaptcha="true"
      >
        <!-- Hidden input for Netlify -->
        <input type="hidden" name="form-name" value="contact" />

        <!-- Rest of your form fields -->
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input
            id="name"
            v-model="formData.name"
            name="name"
            type="text"
            required
            placeholder="Enter your full name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address *</label>
          <input
            id="email"
            v-model="formData.email"
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input
            id="phone"
            v-model="formData.phone"
            name="phone"
            type="tel"
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div class="form-group">
          <label for="address">Address *</label>
          <div class="address-input-container">
            <input
              ref="addressInput"
              id="address"
              v-model="formData.address"
              name="address"
              type="text"
              required
              placeholder="Start typing your address..."
              autocomplete="off"
              class="address-input"
            />
            <div v-if="isLoading" class="loading-indicator">
              <div class="spinner"></div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="postcode">Postcode *</label>
          <input
            ref="postcodeInput"
            id="postcode"
            v-model="formData.postcode"
            name="postcode"
            type="text"
            required
            placeholder="Enter postcode"
            @input="handlePostcodeChange"
            :class="{ invalid: formData.postcode && !isPostcodeValid }"
          />
          <span v-if="formData.postcode && !isPostcodeValid" class="error-message">
            Please enter a valid UK postcode
          </span>
        </div>

        <div class="form-group">
          <label for="service">Service Required *</label>
          <select id="service" v-model="formData.service" name="service" required>
            <option value="">Select a service</option>
            <option v-for="service in services" :key="service" :value="service">
              {{ service }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="preferredDate">Preferred Date *</label>
          <input
            id="preferredDate"
            v-model="formData.preferredDate"
            name="preferredDate"
            type="date"
            required
          />
        </div>

        <div class="form-group">
          <label for="comments">Additional Details (Max 200 words)</label>
          <textarea
            id="comments"
            v-model="formData.comments"
            name="comments"
            rows="6"
            maxlength="1000"
            placeholder="Please describe your requirements in detail..."
          ></textarea>
          <div class="word-count">
            {{ formData.comments.split(/\s+/).filter((word) => word.length > 0).length }}/200 words
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
        </button>

        <div class="recaptcha-notice">
          <p>
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
              >Privacy Policy</a
            >
            and
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"
              >Terms of Service</a
            >
            apply.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: url('/images/contact-bg.jpg') center/cover no-repeat fixed;
}

.contact-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
  z-index: 1;
}

.contact-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 max(1rem, env(safe-area-inset-left));
}

h1 {
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  text-align: center;
  color: #ffffff;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.contact-form {
  background: rgba(255, 255, 255, 0.85);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 0.5rem;
}

select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1);
}

input.invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.word-count {
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.submit-button {
  width: 100%;
  background: #1b5e20;
  color: white;
  border: none;
  font-weight: 600;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1b5e20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.recaptcha-notice {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

.recaptcha-notice a {
  color: #1b5e20;
  text-decoration: none;
}

.recaptcha-notice a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .contact-container {
    margin: 1rem auto;
  }

  .contact-form {
    padding: 1.5rem;
    margin: 0 0.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .contact-form {
    padding: 1rem;
  }

  .submit-button {
    padding: 0.75rem;
    font-size: 1rem;
  }
}
</style>
