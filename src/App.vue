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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

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
  color: #333;
  background-color: #f9f9f9;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  filter: brightness(1.1);
}

@supports (-webkit-touch-callout: none) {
  /* CSS specific to iOS devices */
  body {
    background-attachment: scroll;
  }
}

main {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
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

/* Add a subtle pattern overlay */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%232e7d32" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  pointer-events: none;
  z-index: 0;
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
