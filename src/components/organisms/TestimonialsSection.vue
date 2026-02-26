<template>
  <section class="testimonials section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Testimonials</span>
        <h2 class="section-title">What Our <span class="text-gradient">Clients Say</span></h2>
        <p class="section-subtitle">
          Don't just take our word for it — hear from the hundreds of happy clients we serve every
          week.
        </p>
      </div>

      <div class="carousel-wrapper">
        <div class="cards-track">
          <TransitionGroup name="slide-fade">
            <div
              v-for="(t, i) in visible"
              :key="t.id"
              class="testimonial-card card"
              :style="{ '--delay': `${i * 60}ms` }"
            >
              <div class="stars">
                <span v-for="n in t.rating" :key="n">★</span>
              </div>
              <blockquote>{{ t.quote }}</blockquote>
              <div class="author">
                <div class="avatar" :style="{ background: t.color }">
                  {{ t.name.charAt(0) }}
                </div>
                <div>
                  <div class="author-name">{{ t.name }}</div>
                  <div class="author-job">{{ t.role }}</div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Dots -->
        <div class="dots" role="tablist" aria-label="Testimonial navigation">
          <button
            v-for="(_, i) in chunks"
            :key="i"
            :class="['dot', { active: currentPage === i }]"
            @click="currentPage = i"
            :aria-selected="currentPage === i"
            role="tab"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../lib/supabase'
import type { Review } from '../../types/database'

const CARDS_PER_PAGE = 3
const currentPage = ref(0)

const AVATAR_COLORS = ['#16a34a', '#2563eb', '#7c3aed', '#ea580c', '#db2777', '#0d9488', '#4f46e5']

function avatarColor(name: string): string {
  let n = 0
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

const staticTestimonials = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Homeowner',
    rating: 5,
    color: '#16a34a',
    quote:
      'Ashok Cleaning transformed my home! Every corner was spotless and they even folded the towels into little swans. Absolutely worth every penny.',
  },
  {
    id: '2',
    name: 'James Chen',
    role: 'Office Manager',
    rating: 5,
    color: '#2563eb',
    quote:
      'Reliable, professional, and thorough. Our office has never looked better. The team always works quietly and efficiently — highly recommend!',
  },
  {
    id: '3',
    name: 'Patricia Nguyen',
    role: 'Property Manager',
    rating: 5,
    color: '#7c3aed',
    quote:
      'The move-out clean was flawless. Helped our tenants get their full deposit back. I use Ashok for all our 12 properties now.',
  },
  {
    id: '4',
    name: 'David Thompson',
    role: 'Restaurant Owner',
    rating: 5,
    color: '#ea580c',
    quote:
      'Best commercial cleaning service in the area. Deep-cleaned our kitchen overnight — health inspectors gave us a perfect score the next morning!',
  },
  {
    id: '5',
    name: 'Linda Hassan',
    role: 'New Homeowner',
    rating: 5,
    color: '#db2777',
    quote:
      'The post-construction clean was incredible. They removed every speck of dust and debris. My new home was truly move-in ready. Absolutely stunning work.',
  },
]

const reviewsFromDb = ref<
  Array<{ id: string; name: string; role: string; rating: number; color: string; quote: string }>
>([])

const testimonials = computed(() => {
  if (reviewsFromDb.value.length > 0) return reviewsFromDb.value
  return staticTestimonials
})

const chunks = computed(() => {
  const list = testimonials.value
  const result = []
  for (let i = 0; i < list.length; i += CARDS_PER_PAGE) {
    result.push(list.slice(i, i + CARDS_PER_PAGE))
  }
  return result
})

const visible = computed(() => chunks.value[currentPage.value] ?? [])

let timer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  if (import.meta.env.VITE_SUPABASE_URL) {
    const { data } = await supabase
      .from('reviews')
      .select('id, author_name, author_role, rating, comment')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(12)
    if (data && data.length > 0) {
      reviewsFromDb.value = (data as Review[]).map((r) => ({
        id: r.id,
        name: r.author_name,
        role: r.author_role || 'Customer',
        rating: r.rating,
        color: avatarColor(r.author_name),
        quote: r.comment,
      }))
    }
  }
  timer = setInterval(() => {
    if (chunks.value.length) currentPage.value = (currentPage.value + 1) % chunks.value.length
  }, 6000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.testimonials {
  background: linear-gradient(180deg, #fff 0%, var(--green-50) 100%);
}

.carousel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
}

.cards-track {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  width: 100%;
}

.testimonial-card {
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  border: 1px solid var(--gray-100);
  animation: fadeUp 0.5s var(--ease-out) var(--delay, 0ms) both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stars {
  color: #f59e0b;
  font-size: 1.1rem;
  letter-spacing: 2px;
}

blockquote {
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--gray-600);
  flex: 1;
  font-style: italic;
}

blockquote::before {
  content: '\201C';
  font-size: 2rem;
  color: var(--brand-primary);
  font-style: normal;
  line-height: 0;
  vertical-align: -0.6rem;
  margin-right: 2px;
}

.author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.author-name {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--gray-900);
}

.author-job {
  font-size: 0.8rem;
  color: var(--gray-400);
}

.dots {
  display: flex;
  gap: var(--space-2);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--gray-200);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  padding: 0;
}

.dot.active {
  background: var(--brand-primary);
  width: 24px;
}

@media (max-width: 1024px) {
  .cards-track {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards-track {
    grid-template-columns: 1fr;
  }
}
</style>
