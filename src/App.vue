<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <div class="app-container">
    <TheHeader />

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Ashok Cleaning Services. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  --text-color: #2c3e50;
  --light-text: #ecf0f1;
  --background-overlay: rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body,
html {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: url('/images/background.jpg') center/cover no-repeat fixed;
  min-height: 100vh;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  z-index: 0;
  pointer-events: none;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Navigation styles */
.nav {
  background: rgba(44, 62, 80, 0.95);
  padding: 1rem 0;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--light-text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--light-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--secondary-color);
}

/* Footer styles */
.footer {
  background: rgba(44, 62, 80, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--light-text);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--light-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--secondary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive styles */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Add subtle shadow to cards and sections */
.card,
.section {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Enhance text contrast */
h1,
h2,
h3,
h4,
h5,
h6 {
  color: #2e7d32;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Add subtle hover effects */
a,
button {
  transition: all 0.3s ease;
}

/* Improve form elements */
input,
textarea,
select {
  font-size: 16px !important;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
  min-height: 44px;
  appearance: none;
  -webkit-appearance: none;
}

/* Add subtle animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Improve form elements for mobile */
input,
textarea,
select {
  font-size: 16px !important; /* Prevents zoom on iOS */
  max-width: 100%;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 6px;
}

/* Better button touch targets */
button {
  min-height: 44px;
  padding: 10px 20px;
  touch-action: manipulation;
  cursor: pointer;
}

/* Improve mobile tap targets */
a {
  padding: 8px 0;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

/* Responsive text sizing */
@media (max-width: 768px) {
  h1 {
    font-size: 1.75rem !important;
  }

  h2 {
    font-size: 1.5rem !important;
  }

  h3 {
    font-size: 1.25rem !important;
  }

  p,
  li {
    font-size: 0.95rem !important;
  }
}

/* Safe area insets for modern iOS devices */
@supports (padding: max(0px)) {
  .app-container {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

.footer {
  background: #1b5e20;
  color: white;
  padding: 2rem max(1rem, env(safe-area-inset-right)) max(2rem, env(safe-area-inset-bottom))
    max(1rem, env(safe-area-inset-left));
  width: 100%;
  margin: 0;
  position: relative;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.footer p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .footer {
    padding: 1.5rem max(1rem, env(safe-area-inset-right)) max(1.5rem, env(safe-area-inset-bottom))
      max(1rem, env(safe-area-inset-left));
  }

  .footer-content {
    padding: 0 0.5rem;
  }

  .footer p {
    font-size: 0.85rem !important;
  }
}
</style>
