<template>
  <svg
    width="400"
    height="100"
    viewBox="0 0 400 100"
    xmlns="http://www.w3.org/2000/svg"
    class="company-logo"
  >
    <!-- Background Circle with Gradient -->
    <defs>
      <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #1b5e20; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #2e7d32; stop-opacity: 1" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#circleGradient)" stroke="#2E7D32" stroke-width="3" />

    <!-- Mop Handle with Shadow -->
    <rect x="45" y="20" width="10" height="40" fill="#8B5E3C" />
    <rect
      x="45"
      y="20"
      width="10"
      height="40"
      fill="#8B5E3C"
      opacity="0.3"
      transform="translate(2,2)"
    />

    <!-- Mop Head with Enhanced Design -->
    <path
      d="M30 60 Q50 90, 70 60"
      stroke="#FFF"
      stroke-width="6"
      fill="none"
      stroke-linecap="round"
    />
    <path
      d="M30 60 Q50 90, 70 60"
      stroke="#FFF"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
      opacity="0.5"
    />

    <!-- Enhanced Sparkles -->
    <polygon points="20,20 25,35 40,40 25,45 20,60 15,45 0,40 15,35" fill="#FFF" />
    <polygon points="80,30 85,45 100,50 85,55 80,70 75,55 60,50 75,45" fill="#FFF" />
    <polygon
      points="20,20 25,35 40,40 25,45 20,60 15,45 0,40 15,35"
      fill="#FFF"
      opacity="0.3"
      transform="translate(2,2)"
    />
    <polygon
      points="80,30 85,45 100,50 85,55 80,70 75,55 60,50 75,45"
      fill="#FFF"
      opacity="0.3"
      transform="translate(2,2)"
    />

    <!-- Enhanced Bubbles -->
    <circle cx="20" cy="70" r="5" fill="#FFF" opacity="0.8" />
    <circle cx="80" cy="75" r="6" fill="#FFF" opacity="0.8" />
    <circle cx="45" cy="80" r="4" fill="#FFF" opacity="0.8" />
    <circle cx="20" cy="70" r="3" fill="#FFF" opacity="0.4" transform="translate(2,2)" />
    <circle cx="80" cy="75" r="4" fill="#FFF" opacity="0.4" transform="translate(2,2)" />
    <circle cx="45" cy="80" r="2" fill="#FFF" opacity="0.4" transform="translate(2,2)" />

    <!-- Company Name with White Color -->
    <text
      x="120"
      y="35"
      font-family="Arial, sans-serif"
      font-size="28"
      font-weight="bold"
      fill="#FFFFFF"
      text-transform="uppercase"
      letter-spacing="0.6"
      filter="url(#textShadow)"
    >
      Ashok Cleaning Service
    </text>

    <!-- Tagline with White Color -->
    <text
      x="120"
      y="55"
      font-family="Arial, sans-serif"
      font-size="14"
      font-weight="600"
      fill="#FFFFFF"
      letter-spacing="0.3"
      text-transform="uppercase"
      opacity="0.9"
    >
      Professional Cleaning Services
    </text>

    <!-- Location/Contact Info with White Color -->
    <text
      x="120"
      y="70"
      font-family="Arial, sans-serif"
      font-size="12"
      font-weight="500"
      fill="#FFFFFF"
      letter-spacing="0.2"
      opacity="0.8"
    >
      Serving Your Area • Licensed & Insured
    </text>
  </svg>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.logo-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.logo {
  width: 200px;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2e7d32;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .logo {
    width: 150px;
    height: 150px;
  }

  .logo-text {
    font-size: 2rem;
  }
}
</style>
