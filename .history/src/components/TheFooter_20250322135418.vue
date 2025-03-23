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
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #43a047 70%, #4caf50 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.footer-section:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.footer-logo {
  height: 45px;
  filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.company-description {
  line-height: 1.7;
  opacity: 0.9;
  font-size: 0.95rem;
}

h3 {
  color: white;
  margin-bottom: 1.2rem;
  font-size: 1.3rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.footer-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.3s ease;
  display: block;
  margin-bottom: 0.8rem;
  padding: 0.3rem 0;
  position: relative;
}

.footer-link:hover {
  opacity: 1;
  transform: translateX(5px);
}

.footer-link::before {
  content: '→';
  position: absolute;
  left: -15px;
  opacity: 0;
  transition: all 0.3s ease;
}

.footer-link:hover::before {
  opacity: 1;
  left: -10px;
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-section {
    text-align: center;
    padding: 1.2rem;
  }

  .footer-logo {
    margin: 0 auto;
  }

  h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-link:hover {
    transform: translateX(0);
  }

  .footer-link::before {
    display: none;
  }
}
</style>
