<template>
  <div class="contact-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="section-label">Contact</span>
        <h1>Let's Get Your Space <span class="text-gradient">Sparkling Clean</span></h1>
        <p>Reach out by form, phone, or email — we'll get back to you within a few hours.</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section">
      <div class="container contact-grid">
        <!-- Info Panel -->
        <aside class="info-panel">
          <div class="info-card">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you. Fill out the form or use any of the contact methods below.
            </p>

            <ul class="contact-methods">
              <li>
                <div class="cm-icon">📞</div>
                <div>
                  <strong>Phone</strong>
                  <a href="tel:+11234567890">(123) 456-7890</a>
                </div>
              </li>
              <li>
                <div class="cm-icon">✉️</div>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:info@ashok-cleaning-services.com"
                    >info@ashok-cleaning-services.com</a
                  >
                </div>
              </li>
              <li>
                <div class="cm-icon">📍</div>
                <div>
                  <strong>Service Area</strong>
                  <span>Serving Your Local Area</span>
                </div>
              </li>
            </ul>

            <div class="hours-block">
              <h3>🕐 Business Hours</h3>
              <table class="hours-table">
                <tr v-for="h in hours" :key="h.day">
                  <td>{{ h.day }}</td>
                  <td>{{ h.time }}</td>
                </tr>
              </table>
            </div>

            <div class="trust-strip">
              <div class="trust-item">✅ Free Quote</div>
              <div class="trust-item">🛡️ Insured</div>
              <div class="trust-item">💯 Guaranteed</div>
            </div>
          </div>
        </aside>

        <!-- Form -->
        <div class="form-panel">
          <div class="form-wrapper">
            <ContactForm @success="handleSuccess" />
          </div>
        </div>
      </div>
    </section>

    <!-- Leave a review (when logged in and backend enabled) -->
    <section v-if="showReviewForm" class="section review-section">
      <div class="container">
        <ReviewForm @submitted="reviewSubmitted = true" />
        <p v-if="reviewSubmitted" class="review-thanks">Thanks for your review!</p>
      </div>
    </section>

    <!-- Map Placeholder -->
    <div class="map-placeholder">
      <div class="map-inner">
        <div class="map-pin">📍</div>
        <h3>Serving Your Local Area</h3>
        <p>Contact us to check coverage for your specific address</p>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="slide-up">
      <div v-if="showSuccess" class="toast">
        ✅ Message received! We'll be in touch within a few hours.
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ContactForm from '@/components/molecules/ContactForm.vue'
import ReviewForm from '@/components/molecules/ReviewForm.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const showSuccess = ref(false)
const reviewSubmitted = ref(false)
const showReviewForm = computed(() => !!import.meta.env.VITE_SUPABASE_URL && auth.isAuthenticated)

const handleSuccess = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 4000)
}

const hours = [
  { day: 'Monday – Friday', time: '7:00 AM – 7:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 5:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
  padding: var(--space-20) 0 var(--space-16);
  text-align: center;
}

.page-hero h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  margin: var(--space-4) 0;
}

.page-hero p {
  font-size: 1.1rem;
  color: var(--gray-500);
  max-width: 480px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: var(--space-10);
  align-items: start;
}

/* Info panel */
.info-card {
  background: linear-gradient(160deg, #14532d 0%, #16a34a 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  color: #fff;
  position: sticky;
  top: calc(var(--header-height) + var(--space-6));
}

.info-card h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: var(--space-3);
}

.info-card > p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  line-height: 1.65;
  margin-bottom: var(--space-6);
}

.contact-methods {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.contact-methods li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.cm-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.contact-methods strong {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
}

.contact-methods a,
.contact-methods span {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.92rem;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-methods a:hover {
  color: #fff;
}

.hours-block {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: var(--space-5);
  margin-bottom: var(--space-5);
}

.hours-block h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.hours-table {
  width: 100%;
  border-collapse: collapse;
}

.hours-table td {
  padding: var(--space-2) 0;
  font-size: 0.87rem;
  color: rgba(255, 255, 255, 0.8);
}

.hours-table td:last-child {
  text-align: right;
  font-weight: 500;
}

.trust-strip {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.trust-item {
  padding: 0.3rem 0.7rem;
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* Form panel */
.form-wrapper {
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-100);
}

/* Map */
.map-placeholder {
  height: 260px;
  background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-inner {
  text-align: center;
}

.map-pin {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.map-inner h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.map-inner p {
  color: var(--gray-500);
  font-size: 0.9rem;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--brand-primary);
  color: #fff;
  padding: 0.9rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: var(--shadow-lg);
  z-index: 3000;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s var(--ease-out);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.review-section {
  background: var(--gray-50);
}
.review-thanks {
  margin-top: var(--space-4);
  color: var(--brand-primary-darker);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .info-card {
    position: static;
  }
}

@media (max-width: 600px) {
  .toast {
    left: 1rem;
    right: 1rem;
    text-align: center;
  }
}
</style>
