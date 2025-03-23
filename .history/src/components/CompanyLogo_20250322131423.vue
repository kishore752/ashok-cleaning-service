<template>
  <svg
    width="200"
    height="60"
    viewBox="0 0 200 60"
    xmlns="http://www.w3.org/2000/svg"
    class="company-logo"
  >
    <!-- Background Circle -->
    <circle cx="30" cy="30" r="25" fill="#4CAF50" />

    <!-- Broom Icon -->
    <path d="M25 35 L35 35 L40 20 L20 20 Z" fill="white" stroke="white" stroke-width="2" />
    <path d="M20 20 L40 20 L45 15 L15 15 Z" fill="white" stroke="white" stroke-width="2" />

    <!-- Company Name -->
    <text
      x="70"
      y="38"
      font-family="Arial, sans-serif"
      font-size="24"
      font-weight="bold"
      fill="#333"
    >
      Ashok Cleaning
    </text>

    <!-- Tagline -->
    <text x="70" y="50" font-family="Arial, sans-serif" font-size="12" fill="#666">
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
}
</style>
