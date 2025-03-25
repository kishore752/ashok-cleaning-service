<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const form = ref({
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
              form.value.postcode = postcodeComponent.long_name
              console.log('Updated postcode:', postcodeComponent.long_name)
              validatePostcode(postcodeComponent.long_name)
            }

            // Create address without postcode
            const addressComponents = place.address_components.filter(
              (component: AddressComponent) => !component.types.includes('postal_code'),
            )
            form.value.address = addressComponents
              .map((component: AddressComponent) => component.long_name)
              .join(', ')
            console.log('Updated address:', form.value.address)

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
        const token = await window.grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', {
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

    // Handle form submission with recaptcha token
    console.log('Form submitted:', {
      ...form.value,
      recaptchaToken,
    })

    // Reset form
    form.value = {
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
})
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
          <div class="address-input-container">
            <input
              ref="addressInput"
              id="address"
              v-model="form.address"
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
            v-model="form.postcode"
            type="text"
            required
            placeholder="Enter postcode"
            @input="handlePostcodeChange"
            :class="{ invalid: form.postcode && !isPostcodeValid }"
          />
          <span v-if="form.postcode && !isPostcodeValid" class="error-message">
            Please enter a valid UK postcode
          </span>
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

input.invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.address-input-container {
  position: relative;
  width: 100%;
}

.address-input {
  width: 100%;
  padding-right: 40px; /* Make room for the spinner */
}

.loading-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
