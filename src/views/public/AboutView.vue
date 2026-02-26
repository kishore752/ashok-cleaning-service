<template>
  <div class="about-page">
    <!-- Page Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="section-label">About Us</span>
        <h1>Cleaning with <span class="text-gradient">Care & Commitment</span></h1>
        <p>
          Family-owned and operated since 2014, we've built our reputation one spotless room at a
          time.
        </p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="section story-section">
      <div class="container story-grid">
        <div class="story-image">
          <img
            src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=700&q=80"
            alt="Ashok cleaning team at work"
          />
          <div class="experience-badge">
            <span class="years">10+</span>
            <span>Years of<br />Excellence</span>
          </div>
        </div>
        <div class="story-content">
          <span class="section-label">Our Story</span>
          <h2 class="section-title" style="text-align: left; margin-bottom: var(--space-5)">
            From a Single Bucket to 500+ Happy Clients
          </h2>
          <p>
            Ashok Cleaning Services was founded in 2014 with a simple belief: every home and
            workplace deserves to be genuinely clean — not just surface clean, but deeply, healthily
            clean.
          </p>
          <p>
            What started as a one-person operation with a single cleaning kit has grown into a
            trusted team of 15 trained professionals, serving hundreds of homes and businesses
            across the area each week.
          </p>
          <p>
            We treat every property as if it were our own, using only eco-friendly, non-toxic
            products that are safe for your family, pets, and the environment.
          </p>
          <div class="trust-badges">
            <div class="trust-badge">🛡️ Licensed & Insured</div>
            <div class="trust-badge">🌿 Eco-Certified</div>
            <div class="trust-badge">⭐ 5-Star Rated</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section mv-section">
      <div class="container">
        <div class="mv-grid">
          <div class="mv-card">
            <div class="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To deliver consistently excellent, eco-friendly cleaning services that improve health,
              reduce stress, and create spaces people love to live and work in.
            </p>
          </div>
          <div class="mv-card">
            <div class="mv-icon">🌟</div>
            <h3>Our Vision</h3>
            <p>
              To be the most trusted cleaning service in our community — known not just for spotless
              results, but for the warmth, reliability, and integrity we bring to every job.
            </p>
          </div>
          <div class="mv-card">
            <div class="mv-icon">💚</div>
            <h3>Our Values</h3>
            <p>
              Honesty. Quality. Environmental Responsibility. Respect for your home. We hold
              ourselves to the highest standards because your trust is our most valuable asset.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section team-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Meet the Team</span>
          <h2 class="section-title">
            The People Behind the <span class="text-gradient">Sparkle</span>
          </h2>
          <p class="section-subtitle">
            Every member of our team is background-checked, trained, and passionate about delivering
            exceptional results.
          </p>
        </div>
        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="team-card card">
            <div class="member-avatar" :style="{ background: member.color }">
              {{ member.initials }}
            </div>
            <h3>{{ member.name }}</h3>
            <span class="member-role">{{ member.role }}</span>
            <p>{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-sm about-cta">
      <div class="container about-cta-inner">
        <h2>Ready to Experience the Difference?</h2>
        <p>Join hundreds of happy clients who trust Ashok Cleaning Services every week.</p>
        <router-link to="/contact" class="btn btn-primary">Book Your Clean Today</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const team = [
  {
    name: 'Ashok Patel',
    initials: 'AP',
    role: 'Founder & Lead Cleaner',
    color: 'linear-gradient(135deg, #15803d, #22c55e)',
    bio: 'Founded the company in 2014 with a passion for quality and a commitment to eco-friendly practices. Personally oversees every major job.',
  },
  {
    name: 'Priya Sharma',
    initials: 'PS',
    role: 'Operations Manager',
    color: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    bio: '10 years in hospitality management. Priya ensures every team member is trained to our exacting standards and every client is delighted.',
  },
  {
    name: 'Michael Torres',
    initials: 'MT',
    role: 'Senior Cleaning Specialist',
    color: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    bio: 'Our post-construction and deep-clean expert. Michael brings meticulous attention to detail that consistently earns 5-star reviews.',
  },
]
</script>

<style scoped>
/* Hero */
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

/* Story */
.story-section {
  background: #fff;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.story-image {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.story-image img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  display: block;
}

.experience-badge {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--brand-primary);
  color: #fff;
  padding: 1rem 1.4rem;
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.experience-badge .years {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
}

.experience-badge span:last-child {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.85;
  letter-spacing: 0.05em;
}

.story-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.story-content p {
  color: var(--gray-600);
  line-height: 1.75;
  font-size: 0.97rem;
}

.trust-badges {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-2);
}

.trust-badge {
  padding: 0.4rem 0.9rem;
  background: var(--brand-light);
  color: var(--brand-primary-darker);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 600;
}

/* Mission/Vision */
.mv-section {
  background: var(--gray-50);
}

.mv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.mv-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  border: 1px solid var(--gray-100);
  transition: all var(--transition-slow);
}

.mv-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.mv-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
}

.mv-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: var(--space-3);
}

.mv-card p {
  font-size: 0.9rem;
  color: var(--gray-500);
  line-height: 1.7;
}

/* Team */
.team-section {
  background: #fff;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.team-card {
  padding: var(--space-8);
  text-align: center;
  border: 1px solid var(--gray-100);
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  box-shadow: var(--shadow-md);
}

.team-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.member-role {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--brand-primary);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: var(--space-3);
}

.team-card p {
  font-size: 0.88rem;
  color: var(--gray-500);
  line-height: 1.65;
}

/* CTA */
.about-cta {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.about-cta-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.about-cta-inner h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
}

.about-cta-inner p {
  color: var(--gray-500);
  font-size: 1rem;
}

@media (max-width: 1024px) {
  .mv-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .story-grid {
    grid-template-columns: 1fr;
  }
  .story-image img {
    height: 320px;
  }
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
  .mv-grid {
    grid-template-columns: 1fr;
  }
}
</style>
