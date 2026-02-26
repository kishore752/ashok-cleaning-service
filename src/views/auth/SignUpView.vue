<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Create Account</h1>
      <p class="subtitle">Sign up to save your requests and get updates.</p>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            autocomplete="name"
            placeholder="Jane Smith"
          />
        </div>
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
        <div class="form-group">
          <label for="phone">Phone (optional)</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            autocomplete="tel"
            placeholder="(123) 456-7890"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            placeholder="At least 6 characters"
          />
        </div>

        <!-- Marketing consent -->
        <div class="consent-section">
          <p class="consent-heading">Communication preferences</p>
          <label class="checkbox-label">
            <input type="checkbox" v-model="emailOptin" />
            Send me cleaning tips, offers & promotions via email
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="smsOptin" />
            Send me reminders & promotions via SMS
          </label>
          <p class="consent-note">
            You can change these anytime from your dashboard. We never share your data.
          </p>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>
        <button type="submit" class="btn btn-primary full-width" :disabled="loading">
          {{ loading ? 'Creating...' : 'Sign Up' }}
        </button>
      </form>
      <p class="footer-link">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const emailOptin = ref(true)
const smsOptin = ref(false)
const error = ref('')
const success = ref('')
const loading = ref(false)
const inviteToken = ref('')

onMounted(() => {
  inviteToken.value = (route.query.invite as string) || ''
})

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await auth.signUp(email.value, password.value, fullName.value || undefined)

    // Handle invite token for employee role
    if (inviteToken.value && import.meta.env.VITE_SUPABASE_URL) {
      const { error: rpcError } = await supabase.rpc('use_employee_invite', {
        token_text: inviteToken.value,
      })
      if (!rpcError) await auth.fetchProfile(auth.user!.id)
    }

    // Save marketing consent + phone
    if (auth.user) {
      await auth.updateProfile({
        phone: phone.value.trim() || null,
        email_promos: emailOptin.value,
        sms_optin: smsOptin.value,
      })
    }

    success.value = 'Account created! Redirecting...'
    const target = auth.role === 'employee' || auth.role === 'admin' ? '/employee' : '/dashboard'
    setTimeout(() => router.push(target), 1500)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Sign up failed.'
  } finally {
    loading.value = false
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
.error-msg {
  font-size: 0.85rem;
  color: #b91c1c;
  background: #fef2f2;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
}
.success-msg {
  font-size: 0.85rem;
  color: var(--brand-primary-darker);
  background: var(--green-50);
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

.consent-section {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  background: var(--gray-50);
}
.consent-heading {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray-700);
  margin-bottom: var(--space-3);
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.9rem;
  color: var(--gray-700);
  cursor: pointer;
  margin-bottom: var(--space-2);
}
.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: var(--brand-primary);
}
.consent-note {
  font-size: 0.78rem;
  color: var(--gray-500);
  margin-top: var(--space-2);
}
</style>
