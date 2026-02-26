<template>
  <div class="review-form-wrap">
    <h3>Leave a review</h3>
    <form @submit.prevent="submit" class="review-form">
      <div class="form-group">
        <label>Your name *</label>
        <input v-model="form.author_name" type="text" required placeholder="Jane Smith" />
      </div>
      <div class="form-group">
        <label>Role (e.g. Homeowner, Office Manager)</label>
        <input v-model="form.author_role" type="text" placeholder="Homeowner" />
      </div>
      <div class="form-group">
        <label>Rating *</label>
        <div class="star-rating">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="star-btn"
            :class="{ filled: n <= form.rating }"
            @click="form.rating = n"
            :aria-label="'Rate ' + n + ' stars'"
          >
            ★
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Your review *</label>
        <textarea
          v-model="form.comment"
          required
          rows="3"
          placeholder="Tell others about your experience..."
        ></textarea>
      </div>
      <div class="form-group">
        <label>Service type</label>
        <select v-model="form.service_type">
          <option value="">Select...</option>
          <option value="house">House Cleaning</option>
          <option value="office">Office Cleaning</option>
          <option value="deep">Deep Cleaning</option>
          <option value="movein">Move-In / Move-Out</option>
          <option value="construction">Post-Construction</option>
          <option value="eco">Eco-Friendly Clean</option>
        </select>
      </div>
      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Submit review' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const form = reactive({
  author_name: auth.profile?.full_name || '',
  author_role: '',
  rating: 5,
  comment: '',
  service_type: '',
})
const error = ref('')
const success = ref('')
const loading = ref(false)
const emit = defineEmits(['submitted'])

async function submit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const { error: e } = await supabase.from('reviews').insert({
      user_id: auth.user?.id ?? null,
      author_name: form.author_name.trim(),
      author_role: form.author_role.trim() || null,
      rating: form.rating,
      comment: form.comment.trim(),
      service_type: form.service_type || null,
    })
    if (e) throw e
    success.value = 'Thank you! Your review will appear after approval.'
    form.comment = ''
    form.rating = 5
    emit('submitted')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to submit review.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.review-form-wrap {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
.review-form-wrap h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: var(--gray-900);
}
.review-form {
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
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}
.star-rating {
  display: flex;
  gap: 4px;
}
.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--gray-300);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.star-btn.filled {
  color: #f59e0b;
}
.error-msg {
  font-size: 0.85rem;
  color: #b91c1c;
}
.success-msg {
  font-size: 0.85rem;
  color: var(--brand-primary-darker);
}
</style>
