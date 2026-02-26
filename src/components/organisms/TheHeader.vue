<template>
  <header :class="['header', { scrolled: isScrolled, 'menu-open': menuOpen }]">
    <div class="header-inner container">
      <!-- Logo -->
      <router-link to="/" class="logo-link" @click="menuOpen = false">
        <CompanyLogo class="logo" />
      </router-link>

      <!-- Desktop Nav -->
      <nav class="nav-desktop" aria-label="Main navigation">
        <!-- Home link always visible -->
        <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
        <router-link to="/services" class="nav-link" active-class="active">Services</router-link>
        <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        <router-link to="/contact" class="nav-link" active-class="active">Contact</router-link>

        <template v-if="auth.loading">
          <span class="nav-auth-loading" aria-hidden="true">...</span>
        </template>
        <template v-else-if="auth.isAuthenticated">
          <!-- Dashboard always visible for authenticated users -->
          <router-link to="/dashboard" class="nav-link" active-class="active"
            >Dashboard</router-link
          >
          <!-- Employee link for staff -->
          <router-link v-if="auth.isEmployee" to="/employee" class="nav-link" active-class="active"
            >Employee</router-link
          >
          <!-- Admin link for admins -->
          <router-link v-if="auth.isAdmin" to="/admin" class="nav-link" active-class="active"
            >Admin</router-link
          >

          <!-- User avatar menu -->
          <div class="user-menu-wrap" ref="userMenuRef">
            <button
              :class="['user-menu-btn', { open: userMenuOpen }]"
              @click.stop="userMenuOpen = !userMenuOpen"
              :aria-expanded="userMenuOpen"
              aria-haspopup="true"
              aria-label="Account menu"
            >
              <span class="user-initial">{{ userInitial }}</span>
              <svg
                class="user-menu-chevron"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="userMenuOpen" class="user-dropdown" role="menu">
                <span class="user-dropdown-name">{{
                  auth.profile?.full_name || auth.user?.email
                }}</span>
                <button
                  type="button"
                  class="user-dropdown-item"
                  role="menuitem"
                  @click.stop="handleSignOut"
                >
                  <svg
                    class="dropdown-item-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Sign out
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/signup" class="btn btn-outline nav-cta">Sign up</router-link>
          <router-link to="/contact" class="btn btn-primary nav-cta">Get a Free Quote</router-link>
        </template>
      </nav>

      <!-- Hamburger -->
      <button
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Nav Drawer -->
    <Transition name="drawer">
      <nav v-if="menuOpen" class="nav-mobile" aria-label="Mobile navigation">
        <router-link to="/" class="mobile-link" @click="menuOpen = false">Home</router-link>
        <router-link to="/services" class="mobile-link" @click="menuOpen = false"
          >Services</router-link
        >
        <router-link to="/about" class="mobile-link" @click="menuOpen = false">About</router-link>
        <router-link to="/contact" class="mobile-link" @click="menuOpen = false"
          >Contact</router-link
        >
        <template v-if="auth.isAuthenticated">
          <router-link to="/dashboard" class="mobile-link" @click="menuOpen = false"
            >Dashboard</router-link
          >
          <router-link
            v-if="auth.isEmployee"
            to="/employee"
            class="mobile-link"
            @click="menuOpen = false"
            >Employee</router-link
          >
          <router-link v-if="auth.isAdmin" to="/admin" class="mobile-link" @click="menuOpen = false"
            >Admin</router-link
          >
          <button type="button" class="mobile-link mobile-signout" @click="handleSignOut">
            Sign out
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="mobile-link" @click="menuOpen = false">Login</router-link>
          <router-link to="/signup" class="mobile-link" @click="menuOpen = false"
            >Sign up</router-link
          >
          <router-link to="/contact" class="btn btn-primary mobile-cta" @click="menuOpen = false"
            >Get a Free Quote</router-link
          >
        </template>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import CompanyLogo from '../atoms/CompanyLogo.vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const isScrolled = ref(false)
const menuOpen = ref(false)
const userMenuOpen = ref(false)
const signingOut = ref(false)

const userMenuRef = ref<HTMLElement | null>(null)

const userInitial = computed(() => {
  const name = auth.profile?.full_name || auth.user?.email
  if (name && name.includes('@')) return name.slice(0, 2).toUpperCase()
  return name ? name.slice(0, 1).toUpperCase() : '?'
})

function onDocumentClick(e: MouseEvent) {
  // Don't close if we're in the middle of signing out
  if (signingOut.value) return
  if (userMenuOpen.value && userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') userMenuOpen.value = false
}

/**
 * Sign out handler — closes menus first, then signs out and navigates.
 * Uses .stop modifier on the click to prevent onDocumentClick from interfering.
 * Uses nextTick to ensure Vue has processed the reactive state changes before navigating.
 */
async function handleSignOut() {
  signingOut.value = true
  userMenuOpen.value = false
  menuOpen.value = false

  try {
    await auth.signOut()
    // Wait for Vue to process the reactive state change (isAuthenticated → false)
    await nextTick()
  } catch (e) {
    console.error('Sign out failed:', e)
  } finally {
    signingOut.value = false
    // Navigate to home — the nav will now correctly show "Home" not "Dashboard"
    router.push('/')
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 80
}

const handleResize = () => {
  if (window.innerWidth > 768) menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%);
  transition: all var(--transition-base);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo {
  height: 52px;
  width: auto;
  transition: transform var(--transition-base);
}
.logo:hover {
  transform: scale(1.03);
}

/* ── Desktop nav ── */
.nav-desktop {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.nav-link {
  padding: 0.45rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.header.scrolled .nav-link {
  color: var(--gray-700);
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.header.scrolled .nav-link:hover,
.header.scrolled .nav-link.active {
  background: var(--brand-light);
  color: var(--brand-primary);
}

.nav-cta {
  margin-left: var(--space-4);
  font-size: 0.9rem;
  padding: 0.55rem 1.3rem;
}

/* ── User menu ── */
.user-menu-wrap {
  position: relative;
  margin-left: var(--space-2);
}

.user-menu-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
}

.header.scrolled .user-menu-btn {
  border-color: var(--gray-300);
  background: var(--gray-100);
  color: var(--gray-800);
}

.user-initial {
  line-height: 1;
}

.user-menu-chevron {
  flex-shrink: 0;
  margin-left: 2px;
  transition: transform var(--transition-fast);
}

.user-menu-btn.open .user-menu-chevron {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: var(--space-2);
  z-index: 1100;
}

.user-dropdown-name {
  display: block;
  padding: var(--space-2) var(--space-3);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-700);
  border-bottom: 1px solid var(--gray-100);
  margin-bottom: var(--space-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  text-align: left;
  font-size: 0.9rem;
  color: var(--gray-700);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.user-dropdown-item:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.dropdown-item-icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.nav-auth-loading {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  padding: 0 0.5rem;
}

.header.scrolled .nav-auth-loading {
  color: var(--gray-500);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.mobile-signout {
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

/* ── Hamburger ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 0.5rem;
  transition: background var(--transition-fast);
}

.header.scrolled .hamburger {
  background: var(--brand-light);
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.header.scrolled .hamburger span {
  background: var(--brand-primary);
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── Mobile drawer ── */
.nav-mobile {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6) var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.header.scrolled .nav-mobile {
  border-top-color: var(--gray-200);
}

.mobile-link {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  transition: all var(--transition-fast);
}

.header.scrolled .mobile-link {
  color: var(--gray-700);
}

.mobile-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.header.scrolled .mobile-link:hover {
  background: var(--brand-light);
  color: var(--brand-primary);
}

.mobile-cta {
  margin-top: var(--space-2);
  text-align: center;
  justify-content: center;
}

/* Drawer animation */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s var(--ease-out);
  overflow: hidden;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.drawer-enter-to,
.drawer-leave-from {
  opacity: 1;
  max-height: 500px;
}

@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}
</style>
