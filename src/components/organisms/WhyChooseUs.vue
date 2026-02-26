<template>
  <section class="why-us section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Why Us</span>
        <h2 class="section-title">Why Choose <span class="text-gradient">Ashok Cleaning?</span></h2>
        <p class="section-subtitle">
          We go beyond just cleaning — we deliver trust, quality, and peace of mind with every
          visit.
        </p>
      </div>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-item">
          <div class="feature-icon">{{ feature.icon }}</div>
          <div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: '🌿',
    title: 'Eco-Friendly Products',
    desc: 'We use non-toxic, biodegradable cleaning solutions that are safe for your family, pets, and the planet.',
  },
  {
    icon: '🛡️',
    title: 'Licensed & Insured',
    desc: 'Fully licensed and comprehensively insured, so you have complete peace of mind every time we visit.',
  },
  {
    icon: '📅',
    title: 'Flexible Scheduling',
    desc: 'We work around your timetable — early mornings, evenings, or weekends. Your convenience is our priority.',
  },
  {
    icon: '✅',
    title: 'Background-Checked Staff',
    desc: 'Every cleaner is rigorously vetted, trained, and background-checked before they enter your home.',
  },
  {
    icon: '⭐',
    title: 'Satisfaction Guaranteed',
    desc: 'Not happy? We come back and re-clean for free. We stand behind every job, no questions asked.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: "No hidden fees, no surprises. Clear, upfront quotes so you always know exactly what you're paying.",
  },
]
</script>

<style scoped>
.why-us {
  background: var(--gray-50);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
  padding: var(--space-8);
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-100);
  transition: all var(--transition-slow);
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--green-200);
}

.feature-icon {
  font-size: 2rem;
  width: 54px;
  height: 54px;
  border-radius: var(--radius-md);
  background: var(--green-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-item h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.feature-item p {
  font-size: 0.88rem;
  color: var(--gray-500);
  line-height: 1.65;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
