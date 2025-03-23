<template>
  <svg
    width="250"
    height="60"
    viewBox="0 0 250 60"
    xmlns="http://www.w3.org/2000/svg"
    class="company-logo"
  >
    <!-- Background Circle with Gradient -->
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #2e7d32; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #4caf50; stop-opacity: 1" />
      </linearGradient>
    </defs>

    <!-- Background Circle -->
    <circle cx="30" cy="30" r="25" fill="url(#logoGradient)" />

    <!-- Broom Icon with Shadow -->
    <g filter="url(#shadow)">
      <path d="M25 35 L35 35 L40 20 L20 20 Z" fill="white" stroke="white" stroke-width="2" />
      <path d="M20 20 L40 20 L45 15 L15 15 Z" fill="white" stroke="white" stroke-width="2" />
    </g>

    <!-- Shadow Filter -->
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
        <feOffset dx="1" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Company Name with Improved Typography -->
    <text
      x="70"
      y="35"
      font-family="Arial, sans-serif"
      font-size="28"
      font-weight="bold"
      fill="#2c3e50"
      text-transform="uppercase"
      letter-spacing="0.5"
      filter="url(#textShadow)"
    >
      Ashok Cleaning
    </text>

    <!-- Tagline with Improved Typography -->
    <text
      x="70"
      y="50"
      font-family="Arial, sans-serif"
      font-size="14"
      font-weight="500"
      fill="#666"
      letter-spacing="0.2"
    >
      Professional Cleaning Services
    </text>

    <!-- Text Shadow Filter -->
    <defs>
      <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
        <feOffset dx="0" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.2" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
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
}
</style>
