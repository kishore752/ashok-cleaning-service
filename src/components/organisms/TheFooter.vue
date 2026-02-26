<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-grid">
        <!-- Brand -->
        <div class="footer-col brand-col">
          <CompanyLogo class="footer-logo" />
          <p class="brand-desc">
            Professional, eco-friendly cleaning services for homes and offices. Licensed, insured,
            and satisfaction guaranteed since 2014.
          </p>
          <div class="social-links">
            <a href="#" class="social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" class="social-btn" aria-label="Instagram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" class="social-btn" aria-label="Google">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 11h8.533C20.178 6.164 16.565 3 12 3a9 9 0 100 18c4.255 0 7.861-2.797 8.73-6.5H12v-3.5z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Services -->
        <div class="footer-col">
          <h4>Our Services</h4>
          <ul class="footer-links">
            <li><router-link to="/services">House Cleaning</router-link></li>
            <li><router-link to="/services">Office Cleaning</router-link></li>
            <li><router-link to="/services">Deep Cleaning</router-link></li>
            <li><router-link to="/services">Move-In / Move-Out</router-link></li>
            <li><router-link to="/services">Post-Construction</router-link></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/services">Services</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4>Contact Us</h4>
          <ul class="contact-info">
            <li>
              <span class="contact-icon">📞</span>
              <a href="tel:+11234567890">(123) 456-7890</a>
            </li>
            <li>
              <span class="contact-icon">✉️</span>
              <a href="mailto:info@ashok-cleaning-services.com">info@ashok-cleaning-services.com</a>
            </li>
            <li>
              <span class="contact-icon">📍</span>
              <span>Serving Your Local Area</span>
            </li>
            <li>
              <span class="contact-icon">🕐</span>
              <span>Mon – Sat: 7am – 7pm</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© {{ new Date().getFullYear() }} Ashok Cleaning Services. All rights reserved.</p>
        <p class="footer-badges">
          <span>🛡️ Licensed & Insured</span>
          <span>🌿 Eco-Friendly</span>
          <span>⭐ 5-Star Rated</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import CompanyLogo from '../atoms/CompanyLogo.vue'
</script>

<style scoped>
.footer {
  background: linear-gradient(160deg, #0f4c23 0%, #15803d 60%, #166534 100%);
  color: rgba(255, 255, 255, 0.9);
}

.footer-top {
  padding: var(--space-16) 0 var(--space-12);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: var(--space-10);
}

.footer-logo {
  height: 50px;
  width: auto;
  filter: brightness(0) invert(1);
  margin-bottom: var(--space-4);
}

.brand-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  opacity: 0.8;
  margin-bottom: var(--space-5);
}

.social-links {
  display: flex;
  gap: var(--space-3);
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  transition: all var(--transition-base);
  text-decoration: none;
}

.social-btn:hover {
  background: var(--brand-primary);
  color: #fff;
  transform: translateY(-3px);
}

.footer-col h4 {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--green-300);
  margin-bottom: var(--space-5);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer-links a {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  transition: all var(--transition-fast);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.footer-links a:hover {
  color: #fff;
  transform: translateX(4px);
}

.contact-info {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: 0.9rem;
}

.contact-icon {
  font-size: 0.95rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.contact-info a,
.contact-info span {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
  transition: color var(--transition-fast);
}

.contact-info a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: var(--space-5) 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.footer-bottom p {
  font-size: 0.85rem;
  opacity: 0.7;
}

.footer-badges {
  display: flex;
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
  .brand-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
  }
  .footer-badges {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
