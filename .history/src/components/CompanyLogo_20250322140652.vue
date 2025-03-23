<template>
  <svg
    width="400"
    height="100"
    viewBox="0 0 400 100"
    xmlns="http://www.w3.org/2000/svg"
    class="company-logo"
  >
    <!-- Background Circle -->
    <circle cx="50" cy="50" r="45" fill="#1B5E20" stroke="#2E7D32" stroke-width="3" />

    <!-- Mop Handle -->
    <rect x="45" y="20" width="10" height="40" fill="#8B5E3C" />

    <!-- Mop Head -->
    <path d="M30 60 Q50 90, 70 60" stroke="#FFF" stroke-width="6" fill="none" />

    <!-- Sparkles -->
    <polygon points="20,20 25,35 40,40 25,45 20,60 15,45 0,40 15,35" fill="#FFF" />
    <polygon points="80,30 85,45 100,50 85,55 80,70 75,55 60,50 75,45" fill="#FFF" />

    <!-- Bubbles -->
    <circle cx="20" cy="70" r="5" fill="#D9F3FF" />
    <circle cx="80" cy="75" r="6" fill="#D9F3FF" />
    <circle cx="45" cy="80" r="4" fill="#D9F3FF" />

    <!-- Company Name -->
    <text
      x="120"
      y="35"
      font-family="Arial, sans-serif"
      font-size="28"
      font-weight="bold"
      fill="#1B5E20"
      text-transform="uppercase"
      letter-spacing="0.6"
    >
      Ashok Cleaning Service
    </text>

    <!-- Tagline -->
    <text
      x="120"
      y="55"
      font-family="Arial, sans-serif"
      font-size="14"
      font-weight="600"
      fill="#2E7D32"
      letter-spacing="0.3"
      text-transform="uppercase"
    >
      Professional Cleaning Services
    </text>

    <!-- Location/Contact Info -->
    <text
      x="120"
      y="70"
      font-family="Arial, sans-serif"
      font-size="12"
      font-weight="500"
      fill="#43A047"
      letter-spacing="0.2"
    >
      Serving Your Area • Licensed & Insured
    </text>
  </svg>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
.company-logo {
  display: block;
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  transition: transform 0.3s ease;
}

.company-logo:hover {
  transform: scale(1.02);
}
</style>
