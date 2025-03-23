<script setup lang="ts">
import ImageSlider from '@/components/ImageSlider.vue'
</script>

<template>
  <main>
    <ImageSlider />
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to Ashok Cleaning Service</h1>
        <p>Professional cleaning services for your home and office</p>
        <router-link to="/contact" class="cta-button">Get a Quote</router-link>
      </div>
    </section>
    <!-- Rest of your existing content -->
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}

.hero {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5rem;
  color: #1b5e20;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  color: #2e7d32;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #1b5e20;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background: #2e7d32;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }
}
</style>
