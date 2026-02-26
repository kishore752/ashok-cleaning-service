<template>
  <section class="services-grid section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">What We Offer</span>
        <h2 class="section-title">Our <span class="text-gradient">Cleaning Services</span></h2>
        <p class="section-subtitle">
          From routine housekeeping to deep specialised cleans — we handle it all with care and
          expertise.
        </p>
      </div>

      <div class="grid">
        <div v-for="service in services" :key="service.id" class="service-card card">
          <div class="card-icon" :style="{ background: service.bg }">
            <span>{{ service.icon }}</span>
          </div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <router-link to="/services" class="card-link">
            Learn More
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const services = [
  {
    id: 1,
    icon: '🏠',
    bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    title: 'House Cleaning',
    description:
      'Regular and thorough home cleaning tailored to your schedule. Bedrooms, bathrooms, kitchen and living areas — spotless every time.',
  },
  {
    id: 2,
    icon: '🏢',
    bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    title: 'Office Cleaning',
    description:
      'Keep your workspace professional and hygienic. We work around your business hours to minimise disruption.',
  },
  {
    id: 3,
    icon: '✨',
    bg: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    title: 'Deep Cleaning',
    description:
      'Comprehensive top-to-bottom clean targeting grease, grime and built-up dirt in every corner and crevice.',
  },
  {
    id: 4,
    icon: '📦',
    bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    title: 'Move-In / Move-Out',
    description:
      'Get your property in perfect condition for new tenants or reclaim your deposit with our move-out deep clean.',
  },
  {
    id: 5,
    icon: '🔨',
    bg: 'linear-gradient(135deg, #ffe4e6, #fecdd3)',
    title: 'Post-Construction',
    description:
      'Dust, debris, and construction residue removed safely and efficiently so your newly built space is move-in ready.',
  },
  {
    id: 6,
    icon: '🌿',
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    title: 'Eco-Friendly Clean',
    description:
      'All-natural, non-toxic products that are safe for children, pets, and the environment — without compromising results.',
  },
]
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.service-card {
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  border: 1px solid var(--gray-100);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  transform: scaleX(0);
  transition: transform var(--transition-base);
  transform-origin: left;
}

.service-card:hover::before {
  transform: scaleX(1);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}

.service-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--gray-900);
}

.service-card p {
  font-size: 0.92rem;
  color: var(--gray-500);
  line-height: 1.65;
  flex: 1;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--brand-primary);
  text-decoration: none;
  transition: gap var(--transition-fast);
}

.card-link:hover {
  gap: var(--space-3);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
