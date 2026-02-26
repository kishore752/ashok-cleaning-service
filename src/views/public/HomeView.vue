<script setup lang="ts">
import { ref } from 'vue'
import ImageSlider from '@/components/organisms/ImageSlider.vue'
import ServicesGrid from '@/components/organisms/ServicesGrid.vue'
import StatsCounter from '@/components/organisms/StatsCounter.vue'
import WhyChooseUs from '@/components/organisms/WhyChooseUs.vue'
import TestimonialsSection from '@/components/organisms/TestimonialsSection.vue'
import ContactForm from '@/components/molecules/ContactForm.vue'

const showForm = ref(false)
const showSuccess = ref(false)

const handleFormSuccess = () => {
  showForm.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 4000)
}
</script>

<template>
  <div>
    <!-- Hero Slider -->
    <ImageSlider />

    <!-- Hero CTA Band -->
    <div class="hero-band">
      <div class="container hero-band-inner">
        <div class="hero-band-text">
          <p>
            🏆 <strong>Trusted by 500+ clients</strong> across the area. Licensed, Insured &
            Eco-Friendly.
          </p>
        </div>
        <button class="btn btn-primary" @click="showForm = true">Get a Free Quote</button>
      </div>
    </div>

    <!-- Services -->
    <ServicesGrid />

    <!-- Stats -->
    <StatsCounter />

    <!-- Why Choose Us -->
    <WhyChooseUs />

    <!-- Testimonials -->
    <TestimonialsSection />

    <!-- Final CTA -->
    <section class="cta-banner section">
      <div class="container cta-inner">
        <div class="cta-text">
          <h2>Ready for a Spotless Space?</h2>
          <p>
            Book your first clean today and experience the Ashok difference. No contracts, no
            hassle.
          </p>
        </div>
        <div class="cta-actions">
          <button class="btn btn-white" @click="showForm = true">Get a Free Quote</button>
          <a href="tel:+11234567890" class="btn btn-outline-white">📞 Call Us Now</a>
        </div>
      </div>
    </section>

    <!-- Quote Modal -->
    <Transition name="modal-fade">
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-content">
          <button class="modal-close" @click="showForm = false" aria-label="Close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <ContactForm @success="handleFormSuccess" />
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="showSuccess" class="toast">✅ Thank you! We'll be in touch within 24 hours.</div>
    </Transition>
  </div>
</template>

<style scoped>
/* Hero Band */
.hero-band {
  background: #fff;
  border-bottom: 1px solid var(--gray-100);
  padding: var(--space-5) 0;
}

.hero-band-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero-band-text p {
  font-size: 0.95rem;
  color: var(--gray-700);
}

/* CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, #14532d 0%, #16a34a 60%, #22c55e 100%);
  position: relative;
  overflow: hidden;
}

.cta-banner::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.cta-text h2 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: var(--space-2);
}

.cta-text p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  max-width: 480px;
}

.cta-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.btn-outline-white {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all var(--transition-base);
}

.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-4);
}

.modal-content {
  background: #fff;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 540px;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gray-100);
  border: none;
  color: var(--gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 1;
}

.modal-close:hover {
  background: var(--gray-200);
  color: var(--gray-900);
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

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s var(--ease-out);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content {
  transform: scale(0.92) translateY(20px);
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

@media (max-width: 700px) {
  .hero-band-inner {
    flex-direction: column;
    text-align: center;
  }
  .cta-inner {
    flex-direction: column;
    text-align: center;
  }
  .cta-actions {
    justify-content: center;
  }
  .toast {
    left: 1rem;
    right: 1rem;
    text-align: center;
  }
}
</style>
