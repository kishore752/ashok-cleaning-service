<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <CompanyLogo class="footer-logo" />
        <p class="company-description">
          Professional cleaning services you can trust. Quality work, guaranteed satisfaction.
        </p>
      </div>
      <div class="footer-section">
        <h3>Contact Us</h3>
        <p>Phone: (123) 456-7890</p>
        <p>Email: info@ashok-cleaning-services.com</p>
        <p>Address: Your Address Here</p>
      </div>
      <div class="footer-section">
        <h3>Quick Links</h3>
        <router-link to="/services" class="footer-link">Services</router-link>
        <router-link to="/about" class="footer-link">About Us</router-link>
        <router-link to="/contact" class="footer-link">Contact</router-link>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Ashok Cleaning Services. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import CompanyLogo from './CompanyLogo.vue'
</script>

<style scoped>
.footer {
  background-color: #1b5e20;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.footer-logo {
  height: 45px;
  filter: brightness(0) invert(1);
}

.company-description {
  line-height: 1.6;
  opacity: 0.9;
}

h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.footer-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-link:hover {
  opacity: 1;
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-logo {
    margin: 0 auto;
  }
}
</style>
