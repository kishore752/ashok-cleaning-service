<template>
  <div class="admin-page page-section">
    <div class="container">
      <h1 class="page-title">Admin</h1>
      <p class="page-subtitle">Manage employees, submissions, and reviews.</p>

      <!-- Invite employee -->
      <section class="admin-section">
        <h2>Invite employee</h2>
        <form @submit.prevent="inviteEmployee" class="invite-form">
          <input v-model="inviteEmail" type="email" placeholder="employee@example.com" required />
          <button type="submit" class="btn btn-primary" :disabled="inviteLoading">
            {{ inviteLoading ? 'Sending...' : 'Send invite' }}
          </button>
        </form>
        <p v-if="inviteMessage" :class="inviteSuccess ? 'success-msg' : 'error-msg'">
          {{ inviteMessage }}
        </p>
      </section>

      <!-- Pending Review Queue (jobs awaiting admin completion) -->
      <section class="admin-section" v-if="pendingReviewItems.length > 0">
        <h2 class="section-heading-accent">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Pending Review ({{ pendingReviewItems.length }})
        </h2>
        <div class="review-queue">
          <div v-for="s in pendingReviewItems" :key="s.id" class="review-card">
            <div class="review-card-header">
              <div>
                <StatusBadge :status="s.status" />
                <strong>{{ s.first_name }} {{ s.last_name }}</strong>
                <span class="muted"> — {{ fmt.formatService(s.service_type) }}</span>
              </div>
              <span class="request-date">{{ fmt.formatDate(s.created_at) }}</span>
            </div>

            <!-- Images gallery -->
            <div v-if="getReviewImages(s.id).length > 0" class="review-images">
              <h4>Before & After Photos</h4>
              <div class="image-gallery">
                <div
                  v-for="(url, i) in getReviewImages(s.id)"
                  :key="i"
                  class="gallery-thumb"
                  @click="openLightbox(url)"
                >
                  <img :src="url" :alt="'Photo ' + (i + 1)" loading="lazy" />
                </div>
              </div>
            </div>

            <!-- Review note -->
            <p v-if="getReviewNote(s.id)" class="review-note">
              <strong>Employee note:</strong> {{ getReviewNote(s.id) }}
            </p>

            <div class="review-card-actions">
              <button type="button" class="btn btn-primary btn-sm" @click="approveAndComplete(s)">
                ✅ Approve & Complete
              </button>
              <button type="button" class="btn btn-outline btn-sm" @click="requestRework(s)">
                ↩️ Request Rework
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Submissions Table -->
      <section class="admin-section">
        <h2>Contact submissions</h2>
        <LoadingSkeleton v-if="subs.loading.value" variant="default" />
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in subs.submissions.value" :key="s.id">
                <td>{{ fmt.formatDate(s.created_at) }}</td>
                <td>{{ s.first_name }} {{ s.last_name }}</td>
                <td>{{ s.email }}</td>
                <td>{{ fmt.formatService(s.service_type) }}</td>
                <td>
                  <select
                    :value="s.status"
                    @change="
                      (e) =>
                        openStatusModal(
                          s,
                          (e.target as HTMLSelectElement).value as SubmissionStatus,
                        )
                    "
                  >
                    <option v-for="opt in allStatuses" :key="opt" :value="opt">
                      {{ fmt.formatStatus(opt) }}
                    </option>
                  </select>
                </td>
                <td><button type="button" class="btn-view" @click="openDetail(s)">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Submission Detail Modal -->
    <AppModal
      :show="showDetail"
      :title="`${activeSubmission?.first_name ?? ''} ${activeSubmission?.last_name ?? ''}`"
      :subtitle="activeSubmission ? fmt.formatService(activeSubmission.service_type) : ''"
      max-width="600px"
      @close="closeDetail"
    >
      <template v-if="activeSubmission">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <a :href="'mailto:' + activeSubmission.email" class="detail-value detail-link">{{
              activeSubmission.email
            }}</a>
          </div>
          <div class="detail-item">
            <span class="detail-label">Phone</span>
            <a :href="'tel:' + activeSubmission.phone" class="detail-value detail-link">{{
              activeSubmission.phone
            }}</a>
          </div>
          <div class="detail-item">
            <span class="detail-label">Submitted</span>
            <span class="detail-value">{{ fmt.formatDate(activeSubmission.created_at) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Reference</span>
            <span class="detail-value ref-code"
              >#{{ activeSubmission.id.slice(0, 8).toUpperCase() }}</span
            >
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <StatusBadge :status="activeSubmission.status" />
          </div>
        </div>
        <div v-if="activeSubmission.message" class="detail-message">
          <span class="detail-label">Message</span>
          <p>{{ activeSubmission.message }}</p>
        </div>
        <div class="detail-timeline">
          <h4>Progress Timeline</h4>
          <RequestTimeline
            :submission="activeSubmission"
            :statusUpdates="statusUpd.statusUpdatesMap.value[activeSubmission.id] || []"
          />
        </div>
      </template>
      <template #actions
        ><button type="button" class="btn btn-outline" @click="closeDetail">Close</button></template
      >
    </AppModal>

    <!-- Status Change Confirmation Modal -->
    <AppModal
      :show="showStatusModal"
      title="Update Status"
      :subtitle="statusModalSubtitle"
      @close="cancelStatusChange"
    >
      <div class="modal-form">
        <div class="status-change-summary">
          <StatusBadge :status="pendingOldStatus" />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <StatusBadge :status="pendingNewStatus" />
        </div>
        <div class="form-group">
          <label>Note to customer (optional)</label>
          <textarea
            v-model="statusNote"
            placeholder="e.g. We've contacted the customer, Crew scheduled"
            rows="3"
          ></textarea>
        </div>
        <p v-if="statusUpdateError" class="error-msg">{{ statusUpdateError }}</p>
        <p v-if="statusUpdateSuccess" class="success-msg">{{ statusUpdateSuccess }}</p>
      </div>
      <template #actions>
        <button type="button" class="btn btn-outline" @click="cancelStatusChange">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="statusUpdateLoading"
          @click="confirmStatusChange"
        >
          {{ statusUpdateLoading ? 'Updating...' : 'Confirm Update' }}
        </button>
      </template>
    </AppModal>

    <!-- Image Lightbox -->
    <Transition name="modal-fade">
      <div v-if="lightboxUrl" class="lightbox-overlay" @click.self="lightboxUrl = null">
        <img :src="lightboxUrl" class="lightbox-image" />
        <button type="button" class="lightbox-close" @click="lightboxUrl = null">×</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useFormatters, useSubmissions, useStatusUpdates, STATUS_ORDER } from '../../composables'
import LoadingSkeleton from '../../components/atoms/LoadingSkeleton.vue'
import AppModal from '../../components/atoms/AppModal.vue'
import StatusBadge from '../../components/atoms/StatusBadge.vue'
import RequestTimeline from '../../components/molecules/RequestTimeline.vue'
import type { SubmissionStatus, ContactSubmission } from '../../types/database'

const auth = useAuthStore()
const fmt = useFormatters()
const subs = useSubmissions()
const statusUpd = useStatusUpdates()

// Admin can set ALL statuses (including completed)
const allStatuses = [...STATUS_ORDER, 'cancelled']

// Invite employee
const inviteEmail = ref('')
const inviteLoading = ref(false)
const inviteMessage = ref('')
const inviteSuccess = ref(false)

// Detail modal
const showDetail = ref(false)
const activeSubmission = ref<ContactSubmission | null>(null)

// Status change modal
const showStatusModal = ref(false)
const pendingSubmission = ref<ContactSubmission | null>(null)
const pendingOldStatus = ref('')
const pendingNewStatus = ref('')
const statusNote = ref('')
const statusUpdateLoading = ref(false)
const statusUpdateError = ref('')
const statusUpdateSuccess = ref('')

// Lightbox
const lightboxUrl = ref<string | null>(null)

const statusModalSubtitle = computed(() =>
  pendingSubmission.value
    ? `${pendingSubmission.value.first_name} ${pendingSubmission.value.last_name} — ${fmt.formatService(pendingSubmission.value.service_type)}`
    : '',
)

// Items with status === 'pending_review'
const pendingReviewItems = computed(() =>
  subs.submissions.value.filter((s) => s.status === 'pending_review'),
)

// Get images from the status_updates for a given submission (the pending_review update)
function getReviewImages(submissionId: string): string[] {
  const updates = statusUpd.statusUpdatesMap.value[submissionId] || []
  const reviewUpdate = [...updates]
    .reverse()
    .find((u) => u.new_status === 'pending_review' && u.images && u.images.length > 0)
  return reviewUpdate?.images || []
}

function getReviewNote(submissionId: string): string | null {
  const updates = statusUpd.statusUpdatesMap.value[submissionId] || []
  const reviewUpdate = [...updates].reverse().find((u) => u.new_status === 'pending_review')
  return reviewUpdate?.note || null
}

function generateToken() {
  const arr = new Uint8Array(24)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function inviteEmployee() {
  inviteMessage.value = ''
  inviteLoading.value = true
  try {
    const token = generateToken()
    const { error } = await supabase.from('employee_invites').insert({
      email: inviteEmail.value.trim(),
      role: 'employee',
      token,
    })
    if (error) throw error
    inviteSuccess.value = true
    inviteMessage.value = `Invite created. Share: ${window.location.origin}/signup?invite=${token}`
    inviteEmail.value = ''
  } catch (e: unknown) {
    inviteSuccess.value = false
    inviteMessage.value = e instanceof Error ? e.message : 'Failed to create invite.'
  } finally {
    inviteLoading.value = false
  }
}

function openStatusModal(s: ContactSubmission, newStatus: SubmissionStatus) {
  if (newStatus === s.status) return
  pendingSubmission.value = s
  pendingOldStatus.value = s.status
  pendingNewStatus.value = newStatus
  statusNote.value = ''
  statusUpdateError.value = ''
  statusUpdateSuccess.value = ''
  showStatusModal.value = true
}

function cancelStatusChange() {
  showStatusModal.value = false
  if (pendingSubmission.value)
    subs.patchLocal({
      id: pendingSubmission.value.id,
      status: pendingSubmission.value.status,
    } as ContactSubmission)
  pendingSubmission.value = null
}

async function confirmStatusChange() {
  if (!pendingSubmission.value) return
  statusUpdateLoading.value = true
  statusUpdateError.value = ''
  try {
    const sub = pendingSubmission.value
    const newStatus = pendingNewStatus.value as SubmissionStatus
    await subs.updateStatus(sub.id, newStatus)
    await statusUpd.insertUpdate(
      sub.id,
      pendingOldStatus.value,
      newStatus,
      statusNote.value.trim() || null,
      auth.user?.id || null,
    )
    statusUpdateSuccess.value = `Updated to "${fmt.formatStatus(newStatus)}"`
    setTimeout(() => {
      showStatusModal.value = false
      pendingSubmission.value = null
    }, 1200)
  } catch (e) {
    console.error(e)
    statusUpdateError.value = e instanceof Error ? e.message : 'Failed to update status.'
  } finally {
    statusUpdateLoading.value = false
  }
}

async function openDetail(s: ContactSubmission) {
  activeSubmission.value = s
  showDetail.value = true
  await statusUpd.loadForSubmissions([s.id])
}

function closeDetail() {
  showDetail.value = false
  activeSubmission.value = null
}

async function approveAndComplete(s: ContactSubmission) {
  await subs.updateStatus(s.id, 'completed' as SubmissionStatus)
  await statusUpd.insertUpdate(
    s.id,
    s.status,
    'completed',
    'Work reviewed and approved by admin.',
    auth.user?.id || null,
  )
}

async function requestRework(s: ContactSubmission) {
  await subs.updateStatus(s.id, 'in_progress' as SubmissionStatus)
  await statusUpd.insertUpdate(
    s.id,
    s.status,
    'in_progress',
    'Admin requested rework — please review and resubmit.',
    auth.user?.id || null,
  )
}

function openLightbox(url: string) {
  lightboxUrl.value = url
}

onMounted(async () => {
  await subs.loadAll()
  // Load status updates for pending review items to get images
  const prIds = pendingReviewItems.value.map((s) => s.id)
  if (prIds.length > 0) await statusUpd.loadForSubmissions(prIds)
})
</script>

<style scoped>
.admin-page {
  padding: var(--space-8) 0;
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
.admin-section {
  margin-bottom: var(--space-10);
}
.admin-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: var(--gray-800);
}

.section-heading-accent {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: #7c3aed;
  font-size: 1.25rem;
}
.section-heading-accent svg {
  color: #7c3aed;
}

.invite-form {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.invite-form input {
  flex: 1;
  min-width: 200px;
  padding: 0.6rem 1rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
}
.success-msg {
  color: var(--brand-primary-darker);
  font-size: 0.9rem;
  margin-top: var(--space-2);
}
.error-msg {
  color: #b91c1c;
  font-size: 0.9rem;
  margin-top: var(--space-2);
}

/* Review Queue */
.review-queue {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.review-card {
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.review-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
  gap: var(--space-2);
}
.review-card-header > div {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.muted {
  color: var(--gray-500);
  font-size: 0.9rem;
}
.request-date {
  font-size: 0.82rem;
  color: var(--gray-400);
}

.review-images h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #7c3aed;
  margin: 0 0 var(--space-2);
}
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.gallery-thumb {
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e9d5ff;
  transition: border-color 0.2s;
}
.gallery-thumb:hover {
  border-color: #7c3aed;
}
.gallery-thumb img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}
.review-note {
  font-size: 0.9rem;
  color: var(--gray-600);
  font-style: italic;
  margin: 0 0 var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: rgba(124, 58, 237, 0.04);
  border-radius: var(--radius-sm);
}
.review-card-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* Table */
.table-wrap {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.data-table th,
.data-table td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}
.data-table th {
  font-weight: 600;
  color: var(--gray-700);
  background: var(--gray-50);
}
.data-table select {
  padding: 0.35rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-200);
  font-size: 0.85rem;
}
.btn-view {
  padding: 0.35rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--brand-primary);
  background: var(--green-50);
  border: 1px solid var(--brand-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-view:hover {
  background: var(--brand-primary);
  color: #fff;
}
.btn-sm {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
}

/* Detail modal */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.detail-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.detail-value {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-700);
}
.detail-link {
  color: var(--brand-primary);
  text-decoration: none;
}
.detail-link:hover {
  text-decoration: underline;
}
.ref-code {
  font-family: monospace;
  color: var(--brand-primary-darker);
  font-weight: 700;
}
.detail-message {
  margin-bottom: var(--space-5);
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--brand-primary);
}
.detail-message p {
  margin: var(--space-2) 0 0;
  font-size: 0.9rem;
  color: var(--gray-700);
  font-style: italic;
}
.detail-timeline {
  margin-top: var(--space-2);
}
.detail-timeline h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gray-700);
  margin: 0 0 var(--space-3);
}

/* Status change modal */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.status-change-summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  justify-content: center;
}
.status-change-summary svg {
  color: var(--gray-400);
  flex-shrink: 0;
}
.modal-form .form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--space-1);
}
.modal-form textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-family: var(--font-sans);
  resize: vertical;
}
.modal-form textarea:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: var(--space-4);
}
.lightbox-image {
  max-width: 90%;
  max-height: 90vh;
  border-radius: var(--radius-lg);
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.4);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
