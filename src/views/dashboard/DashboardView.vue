<template>
  <div class="dashboard page-section">
    <div class="container">
      <h1 class="page-title">My Dashboard</h1>
      <p class="page-subtitle">Track your cleaning requests and manage preferences.</p>

      <!-- Request Tracker -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="section-icon"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6"
              />
            </svg>
            My Requests
          </h2>
          <router-link to="/contact" class="btn btn-primary btn-sm">+ New Request</router-link>
        </div>

        <LoadingSkeleton v-if="subs.loading.value" variant="cards" :count="2" />

        <EmptyState
          v-else-if="subs.submissions.value.length === 0"
          icon="📝"
          title="No requests yet"
          description="Submit your first cleaning request and track its progress here."
          action-label="Request a Quote"
          action-to="/contact"
        />

        <div v-else class="request-cards">
          <div
            v-for="s in subs.submissions.value"
            :key="s.id"
            :class="['request-card', { expanded: expandedId === s.id }]"
          >
            <button
              type="button"
              class="request-card-header"
              @click="expandedId = expandedId === s.id ? null : s.id"
            >
              <div class="request-card-left">
                <StatusBadge :status="s.status" />
                <span class="request-service">{{ fmt.formatService(s.service_type) }}</span>
              </div>
              <div class="request-card-right">
                <span class="request-date">{{ fmt.formatDate(s.created_at) }}</span>
                <svg
                  class="chevron"
                  :class="{ rotated: expandedId === s.id }"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            <Transition name="expand">
              <div v-if="expandedId === s.id" class="request-card-body">
                <div class="request-info-grid">
                  <div class="info-item">
                    <span class="info-label">Contact</span
                    ><span class="info-value">{{ s.first_name }} {{ s.last_name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email</span
                    ><span class="info-value">{{ s.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone</span
                    ><span class="info-value">{{ s.phone }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Reference</span
                    ><span class="info-value ref-code">#{{ s.id.slice(0, 8).toUpperCase() }}</span>
                  </div>
                </div>
                <p v-if="s.message" class="request-message">
                  <strong>Details:</strong> {{ s.message }}
                </p>
                <h3 class="timeline-heading">Progress</h3>
                <RequestTimeline
                  :submission="s"
                  :statusUpdates="statusUpd.statusUpdatesMap.value[s.id] || []"
                />
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- Notification Preferences -->
      <section class="dashboard-section">
        <h2 class="section-heading-simple">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="section-icon"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          Notification Preferences
        </h2>
        <div class="prefs-form">
          <label class="checkbox-label"
            ><input type="checkbox" v-model="prefs.email_notifications" @change="savePrefs" /> Email
            me updates about my requests</label
          >
          <label class="checkbox-label"
            ><input type="checkbox" v-model="prefs.email_promos" @change="savePrefs" /> Send me
            offers and cleaning tips via email</label
          >
          <label class="checkbox-label"
            ><input type="checkbox" v-model="prefs.sms_optin" @change="savePrefs" /> Send me
            reminders and promotions via SMS</label
          >
          <p class="consent-note">We respect your privacy and you can change these at any time.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useFormatters, useSubmissions, useStatusUpdates, useRealtime } from '../../composables'
import LoadingSkeleton from '../../components/atoms/LoadingSkeleton.vue'
import StatusBadge from '../../components/atoms/StatusBadge.vue'
import EmptyState from '../../components/atoms/EmptyState.vue'
import RequestTimeline from '../../components/molecules/RequestTimeline.vue'
import type { ContactSubmission } from '../../types/database'

const auth = useAuthStore()
const fmt = useFormatters()
const subs = useSubmissions()
const statusUpd = useStatusUpdates()
const rt = useRealtime('dashboard-updates')

const expandedId = ref<string | null>(null)
const prefs = reactive({ email_notifications: true, email_promos: true, sms_optin: false })

async function initData() {
  if (!auth.user?.id) return
  await subs.loadMine(auth.user.id)
  if (subs.submissions.value.length > 0) {
    expandedId.value = subs.submissions.value[0].id
    await statusUpd.loadForSubmissions(subs.submissions.value.map((s) => s.id))
  }
  loadPrefs()
  setupRealtime()
}

function setupRealtime() {
  if (!auth.user?.id) return
  rt.subscribe([
    {
      event: 'UPDATE',
      table: 'contact_submissions',
      filter: `user_id=eq.${auth.user.id}`,
      callback: (payload) => {
        subs.patchLocal(payload.new as unknown as ContactSubmission)
        statusUpd.refresh(subs.submissions.value.map((s) => s.id))
      },
    },
    {
      event: 'INSERT',
      table: 'status_updates',
      callback: () => statusUpd.refresh(subs.submissions.value.map((s) => s.id)),
    },
  ])
}

function loadPrefs() {
  if (auth.profile) {
    prefs.email_notifications = auth.profile.email_notifications
    prefs.email_promos = auth.profile.email_promos
    prefs.sms_optin = auth.profile.sms_optin ?? false
  }
}

async function savePrefs() {
  try {
    await auth.updateProfile({
      email_notifications: prefs.email_notifications,
      email_promos: prefs.email_promos,
      sms_optin: prefs.sms_optin,
    })
  } catch (e) {
    console.error(e)
  }
}

onMounted(initData)
</script>

<style scoped>
.dashboard {
  padding: var(--space-8) 0 var(--space-16);
}
.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}
.page-subtitle {
  color: var(--gray-500);
  margin-bottom: var(--space-8);
}
.dashboard-section {
  margin-bottom: var(--space-10);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}
.section-header h2,
.section-heading-simple {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0;
}
.section-heading-simple {
  margin-bottom: var(--space-4);
}
.section-icon {
  color: var(--brand-primary);
  flex-shrink: 0;
}
.btn-sm {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
}

.request-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.request-card {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}
.request-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.request-card.expanded {
  border-color: var(--brand-primary);
  box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
}

.request-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  text-align: left;
}
.request-card-left,
.request-card-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.request-service {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-700);
}
.request-date {
  font-size: 0.82rem;
  color: var(--gray-400);
}
.chevron {
  transition: transform 0.2s ease;
  color: var(--gray-400);
}
.chevron.rotated {
  transform: rotate(180deg);
}

.request-card-body {
  padding: 0 var(--space-5) var(--space-5);
  border-top: 1px solid var(--gray-100);
}
.request-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding: var(--space-4) 0;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-value {
  font-size: 0.9rem;
  color: var(--gray-700);
  font-weight: 500;
}
.ref-code {
  font-family: monospace;
  color: var(--brand-primary-darker);
  font-weight: 700;
}
.request-message {
  font-size: 0.9rem;
  color: var(--gray-600);
  font-style: italic;
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  margin: var(--space-2) 0;
}
.timeline-heading {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gray-800);
  margin: var(--space-4) 0 var(--space-2);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 800px;
}

.prefs-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.95rem;
  color: var(--gray-700);
  cursor: pointer;
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

@media (max-width: 640px) {
  .request-info-grid {
    grid-template-columns: 1fr;
  }
  .request-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  .request-card-right {
    align-self: flex-end;
  }
}
</style>
