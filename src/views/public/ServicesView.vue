<template>
  <div class="services-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="section-label">Services</span>
        <h1>Expert Cleaning for <span class="text-gradient">Every Space</span></h1>
        <p>
          From cozy homes to large commercial offices — we have a tailored cleaning solution for
          you.
        </p>
        <router-link to="/contact" class="btn btn-primary" style="margin-top: var(--space-6)"
          >Book a Service</router-link
        >
      </div>
    </section>

    <!-- Detailed Service Cards -->
    <section class="section">
      <div class="container">
        <div class="services-list">
          <div v-for="(svc, i) in services" :key="svc.id" class="svc-card">
            <div class="svc-icon-col">
              <div class="svc-icon" :style="{ background: svc.bg }">{{ svc.icon }}</div>
              <div class="svc-price">{{ svc.price }}</div>
            </div>
            <div class="svc-content">
              <h2>{{ svc.title }}</h2>
              <p class="svc-desc">{{ svc.description }}</p>
              <ul class="svc-features">
                <li v-for="f in svc.features" :key="f">✓ {{ f }}</li>
              </ul>
              <router-link to="/contact" class="btn btn-outline svc-btn">Get a Quote →</router-link>
            </div>
            <div v-if="i % 2 === 1" class="svc-img-col">
              <img :src="svc.image" :alt="svc.title" />
            </div>
            <div v-else class="svc-img-col svc-img-left">
              <img :src="svc.image" :alt="svc.title" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section faq-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">FAQ</span>
          <h2 class="section-title">
            Frequently Asked <span class="text-gradient">Questions</span>
          </h2>
        </div>
        <div class="faq-list">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item" :class="{ open: openFaq === i }">
            <button class="faq-question" @click="openFaq = openFaq === i ? -1 : i">
              {{ faq.q }}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                class="faq-arrow"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <Transition name="faq-slide">
              <div v-if="openFaq === i" class="faq-answer">
                {{ faq.a }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA strip -->
    <section class="section-sm cta-strip">
      <div class="container cta-strip-inner">
        <p>Still have questions? Our team is happy to help.</p>
        <a href="tel:+11234567890" class="btn btn-primary">📞 Call (123) 456-7890</a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref(-1)

const services = [
  {
    id: 1,
    icon: '🏠',
    bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    title: 'House Cleaning',
    price: 'From $89',
    description:
      'Our regular residential cleaning covers all the essentials to keep your home fresh, tidy, and healthy — every single visit.',
    features: [
      'Vacuuming & mopping all floors',
      'Bathroom & toilet sanitisation',
      'Kitchen surfaces & appliances',
      'Dusting all furniture & shelves',
      'Making beds & tidying rooms',
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    id: 2,
    icon: '🏢',
    bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    title: 'Office Cleaning',
    price: 'From $149',
    description:
      'A clean office boosts productivity and impresses clients. We offer flexible scheduling — early morning, evening, or weekends.',
    features: [
      'Desks, screens & keyboards wiped',
      'Meeting rooms & common areas',
      'Kitchen & breakroom sanitation',
      'Rubbish removal & recycling',
      'Floor care & entrance mats',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    id: 3,
    icon: '✨',
    bg: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    title: 'Deep Cleaning',
    price: 'From $199',
    description:
      'A comprehensive top-to-bottom deep clean targeting built-up grime, grease, and areas often missed in regular cleans.',
    features: [
      'Inside ovens & microwaves',
      'Behind & under appliances',
      'Grout & tile scrubbing',
      'Window sills & blinds',
      'Baseboards & ceiling fans',
    ],
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80',
  },
  {
    id: 4,
    icon: '📦',
    bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    title: 'Move-In / Move-Out',
    price: 'From $249',
    description:
      "Whether you're moving in or moving out, we ensure the property is immaculate so you can reclaim your deposit or start fresh.",
    features: [
      'Full property deep clean',
      'Inside all cupboards & drawers',
      'Carpet shampooing (optional)',
      'Walls & light switches wiped',
      'Final inspection walkthrough',
    ],
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80',
  },
]

const faqs = [
  {
    q: 'How long does a typical clean take?',
    a: "A standard house clean takes 2–3 hours for a 2-bedroom home. Larger properties and deep cleans take longer. We'll give you an accurate time estimate when you book.",
  },
  {
    q: 'Do you bring your own cleaning supplies?',
    a: "Yes! We bring all our professional-grade, eco-friendly cleaning products and equipment. You don't need to provide anything. If you have a preference for specific products, just let us know.",
  },
  {
    q: 'Are your cleaners background checked?',
    a: "Absolutely. Every member of our team undergoes a rigorous background check and reference verification before they're hired. Your safety and peace of mind are our top priority.",
  },
  {
    q: "What if I'm not satisfied with the clean?",
    a: "We offer a 100% satisfaction guarantee. If you're not happy with any aspect of the clean, simply let us know within 24 hours and we'll come back and re-clean the area free of charge.",
  },
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
  max-width: 520px;
  margin: 0 auto;
}

/* Service list */
.services-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.svc-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-10);
  align-items: start;
  padding: var(--space-8);
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-100);
  transition: box-shadow var(--transition-slow);
}

.svc-card:hover {
  box-shadow: var(--shadow-xl);
}

.svc-icon-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.svc-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.svc-price {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--brand-primary);
  white-space: nowrap;
}

.svc-content h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: var(--space-3);
}

.svc-desc {
  color: var(--gray-500);
  line-height: 1.7;
  margin-bottom: var(--space-5);
  font-size: 0.96rem;
}

.svc-features {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.svc-features li {
  font-size: 0.88rem;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.svc-features li::first-letter {
  color: var(--brand-primary);
  font-weight: 700;
}

.svc-btn {
  border-radius: var(--radius-full);
}

.svc-img-col {
  width: 220px;
  flex-shrink: 0;
}

.svc-img-col img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

/* FAQ */
.faq-section {
  background: var(--gray-50);
}

.faq-list {
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.faq-item {
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-100);
  overflow: hidden;
}

.faq-item.open {
  border-color: var(--green-200);
  box-shadow: var(--shadow-sm);
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: var(--space-6);
  text-align: left;
  font-size: 0.97rem;
  font-weight: 600;
  color: var(--gray-800);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  transition: color var(--transition-fast);
}

.faq-item.open .faq-question {
  color: var(--brand-primary);
}

.faq-arrow {
  flex-shrink: 0;
  transition: transform 0.3s var(--ease-out);
}

.faq-item.open .faq-arrow {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 var(--space-6) var(--space-6);
  font-size: 0.92rem;
  color: var(--gray-500);
  line-height: 1.7;
}

.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.3s var(--ease-out);
  overflow: hidden;
}
.faq-slide-enter-from,
.faq-slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.faq-slide-enter-to,
.faq-slide-leave-from {
  max-height: 200px;
  opacity: 1;
}

/* CTA strip */
.cta-strip {
  background: var(--brand-light);
  border-top: 1px solid var(--green-200);
}

.cta-strip-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.cta-strip-inner p {
  font-size: 1rem;
  color: var(--brand-primary-darker);
  font-weight: 500;
}

@media (max-width: 900px) {
  .svc-card {
    grid-template-columns: 1fr;
  }
  .svc-icon-col {
    flex-direction: row;
  }
  .svc-img-col,
  .svc-img-left {
    display: none;
  }
}

@media (max-width: 600px) {
  .svc-features {
    grid-template-columns: 1fr;
  }
  .cta-strip-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
