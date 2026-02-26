<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Sign In</h1>
      <p class="subtitle">Access your account to view history and manage preferences.</p>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div class="form-group form-group-row">
          <label for="password">Password</label>
          <a href="#" class="forgot-link" @click.prevent="showForgot = true">Forgot password?</a>
        </div>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
          class="password-input"
        />
        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <button type="submit" class="btn btn-primary full-width" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      <p class="footer-link">
        Don't have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>

    <!-- Forgot password modal -->
    <AppModal
      :show="showForgot"
      title="Reset password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      @close="showForgot = false"
    >
      <form @submit.prevent="handleForgotSubmit" class="auth-form">
        <div class="form-group">
          <label for="forgot-email">Email</label>
          <input
            id="forgot-email"
            v-model="forgotEmail"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <p v-if="forgotError" class="error-msg">{{ forgotError }}</p>
        <p v-if="forgotSuccess" class="success-msg">{{ forgotSuccess }}</p>
        <button type="submit" class="btn btn-primary full-width" :disabled="forgotLoading">
          {{ forgotLoading ? 'Sending...' : 'Send reset link' }}
        </button>
      </form>
      <button type="button" class="back-link" @click="showForgot = false">Back to sign in</button>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import AppModal from '../../components/atoms/AppModal.vue'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const successMsg = ref('')
const loading = ref(false)

const showForgot = ref(false)
const forgotEmail = ref('')
const forgotError = ref('')
const forgotSuccess = ref('')
const forgotLoading = ref(false)

async function handleSubmit() {
  error.value = ''
  successMsg.value = ''
  loading.value = true
  try {
    await auth.signIn(email.value, password.value)
    const role = auth.role
    if (role === 'admin') router.push('/admin')
    else if (role === 'employee') router.push('/employee')
    else router.push('/dashboard')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Sign in failed.'
  } finally {
    loading.value = false
  }
}

async function handleForgotSubmit() {
  if (!forgotEmail.value.trim()) return
  forgotError.value = ''
  forgotSuccess.value = ''
  forgotLoading.value = true
  try {
    const { error: err } = await supabase.auth.resetPasswordForEmail(forgotEmail.value.trim(), {
      redirectTo: `${window.location.origin}/login`,
    })
    if (err) throw err
    forgotSuccess.value = 'Check your email for the reset link.'
  } catch (e: unknown) {
    forgotError.value = e instanceof Error ? e.message : 'Could not send reset email.'
  } finally {
    forgotLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}
.auth-card {
  width: 100%;
  max-width: 420px;
  padding: var(--space-8);
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}
.auth-card h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}
.subtitle {
  font-size: 0.9rem;
  color: var(--gray-500);
  margin-bottom: var(--space-6);
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--space-1);
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}
.form-group input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}
.form-group-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forgot-link {
  font-size: 0.85rem;
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 500;
}
.forgot-link:hover {
  text-decoration: underline;
}
.password-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}
.password-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}
.success-msg {
  font-size: 0.85rem;
  color: var(--brand-primary-darker);
  background: var(--green-50);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
}
.error-msg {
  font-size: 0.85rem;
  color: #b91c1c;
  background: #fef2f2;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
}
.full-width {
  width: 100%;
  padding: 0.75rem;
  margin-top: var(--space-2);
}
.footer-link {
  margin-top: var(--space-6);
  font-size: 0.9rem;
  color: var(--gray-600);
  text-align: center;
}
.footer-link a {
  color: var(--brand-primary);
  font-weight: 600;
  text-decoration: none;
}
.footer-link a:hover {
  text-decoration: underline;
}
</style>
