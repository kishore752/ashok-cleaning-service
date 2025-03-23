<template>
  <svg
    width="300"
    height="60"
    viewBox="0 0 300 60"
    xmlns="http://www.w3.org/2000/svg"
    class="company-logo"
  >
    <!-- Enhanced Gradients and Filters -->
    <defs>
      <!-- Main Logo Gradient -->
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #1b5e20; stop-opacity: 1" />
        <stop offset="40%" style="stop-color: #2e7d32; stop-opacity: 1" />
        <stop offset="70%" style="stop-color: #43a047; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #4caf50; stop-opacity: 1" />
      </linearGradient>

      <!-- Glow Effect -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="glow"
        />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Enhanced Shadow Filter -->
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="1" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Enhanced Text Shadow Filter -->
      <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
        <feOffset dx="0" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background Circle with Enhanced Effects -->
    <circle cx="30" cy="30" r="25" fill="url(#logoGradient)" filter="url(#glow)" />

    <!-- Broom Icon with Enhanced Design -->
    <g filter="url(#shadow)">
      <!-- Main Broom Parts -->
      <path
        d="M25 35 L35 35 L40 20 L20 20 Z"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M20 20 L40 20 L45 15 L15 15 Z"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <!-- Detail Lines -->
      <path d="M30 35 L30 20" stroke="white" stroke-width="1" opacity="0.6" />
      <path d="M25 35 L35 35" stroke="white" stroke-width="1" opacity="0.4" />
    </g>

    <!-- Company Name with Enhanced Typography -->
    <text
      x="70"
      y="32"
      font-family="Arial, sans-serif"
      font-size="36"
      font-weight="bold"
      fill="white"
      text-transform="uppercase"
      letter-spacing="1"
      filter="url(#textShadow)"
    >
      Ashok
    </text>

    <!-- Professional Tagline -->
    <text
      x="70"
      y="48"
      font-family="Arial, sans-serif"
      font-size="14"
      font-weight="600"
      fill="white"
      letter-spacing="0.5"
      text-transform="uppercase"
      filter="url(#textShadow)"
    >
      Professional Cleaning Services
    </text>

    <!-- Location/Contact Info -->
    <text
      x="70"
      y="58"
      font-family="Arial, sans-serif"
      font-size="12"
      font-weight="500"
      fill="white"
      letter-spacing="0.3"
      filter="url(#textShadow)"
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
