<template>
  <svg
    width="250"
    height="60"
    viewBox="0 0 250 60"
    xmlns="http://www.w3.org/2000/svg"
    class="company-logo"
  >
    <!-- Background Circle with Enhanced Gradient -->
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #1b5e20; stop-opacity: 1" />
        <stop offset="50%" style="stop-color: #2e7d32; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #4caf50; stop-opacity: 1" />
      </linearGradient>

      <!-- Enhanced Shadow Filter -->
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
        <feOffset dx="1" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Enhanced Text Shadow Filter -->
      <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" />
        <feOffset dx="0" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background Circle with Enhanced Shadow -->
    <circle cx="30" cy="30" r="25" fill="url(#logoGradient)" filter="url(#shadow)" />

    <!-- Broom Icon with Enhanced Design -->
    <g filter="url(#shadow)">
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
      <!-- Added Detail Lines -->
      <path d="M30 35 L30 20" stroke="white" stroke-width="1" opacity="0.5" />
    </g>

    <!-- Company Name with Enhanced Typography -->
    <text
      x="70"
      y="35"
      font-family="Arial, sans-serif"
      font-size="28"
      font-weight="bold"
      fill="#1B5E20"
      text-transform="uppercase"
      letter-spacing="0.5"
      filter="url(#textShadow)"
    >
      Ashok Cleaning
    </text>

    <!-- Tagline with Enhanced Typography -->
    <text
      x="70"
      y="50"
      font-family="Arial, sans-serif"
      font-size="14"
      font-weight="500"
      fill="#2E7D32"
      letter-spacing="0.2"
    >
      Professional Cleaning Services
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style>
