<template>
  <div class="employee-page page-section">
    <div class="container">
      <h1 class="page-title">Employee Dashboard</h1>
      <p class="page-subtitle">View and update assigned cleaning requests.</p>

      <!-- Stats row -->
      <div class="stats-row" v-if="!subs.loading.value">
        <div class="stat-card">
          <span class="stat-value">{{ stats.total }}</span
          ><span class="stat-label">Total</span>
        </div>
        <div class="stat-card stat-new">
          <span class="stat-value">{{ stats.new }}</span
          ><span class="stat-label">New</span>
        </div>
        <div class="stat-card stat-progress">
          <span class="stat-value">{{ stats.inProgress }}</span
          ><span class="stat-label">In Progress</span>
        </div>
        <div class="stat-card stat-review">
          <span class="stat-value">{{ stats.pendingReview }}</span
          ><span class="stat-label">Pending Review</span>
        </div>
        <div class="stat-card stat-done">
          <span class="stat-value">{{ stats.completed }}</span
          ><span class="stat-label">Completed</span>
        </div>
      </div>

      <section class="employee-section">
        <h2>Requests</h2>
        <LoadingSkeleton v-if="subs.loading.value" variant="list" :count="4" />
        <ul v-else class="requests-list">
          <li v-for="s in subs.submissions.value" :key="s.id" class="request-card">
            <div class="request-header">
              <div class="request-header-left">
                <StatusBadge :status="s.status" />
                <span class="request-service">{{ fmt.formatService(s.service_type) }}</span>
              </div>
              <span class="request-date">{{ fmt.formatDate(s.created_at) }}</span>
            </div>
            <div class="request-body">
              <p>
                <strong>{{ s.first_name }} {{ s.last_name }}</strong>
              </p>
              <p>{{ s.email }} · {{ s.phone }}</p>
              <p v-if="s.message" class="request-message">"{{ s.message }}"</p>
            </div>
            <div class="request-actions">
              <button type="button" class="btn btn-primary btn-sm" @click="openUpdateModal(s)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                {{ s.status === 'in_progress' ? 'Submit for Review' : 'Send Progress Update' }}
              </button>
            </div>
          </li>
          <p v-if="subs.submissions.value.length === 0" class="empty-msg">No requests yet.</p>
        </ul>
      </section>
    </div>

    <!-- Progress Update Modal -->
    <AppModal
      :show="showModal"
      :title="modalTitle"
      :subtitle="modalSubtitle"
      max-width="540px"
      @close="closeModal"
    >
      <div class="modal-form">
        <div class="form-group">
          <label>New Status</label>
          <select v-model="updateForm.newStatus">
            <option v-for="s in employeeStatuses" :key="s" :value="s">
              {{ fmt.statusIcon(s) }} {{ fmt.formatStatus(s) }}
            </option>
          </select>
        </div>

        <!-- Image upload section (visible when pending_review) -->
        <div v-if="updateForm.newStatus === 'pending_review'" class="image-upload-section">
          <div class="upload-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span>Upload Before & After Photos</span>
          </div>
          <p class="upload-hint">
            Upload photos of the work for admin review. Drag & drop or click to browse.
          </p>

          <div
            class="upload-drop-zone"
            @click="triggerFileInput"
            @dragover.prevent="dragActive = true"
            @dragleave="dragActive = false"
            @drop.prevent="handleDrop"
            :class="{ 'drag-active': dragActive }"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              multiple
              hidden
              @change="handleFileSelect"
            />
            <svg
              v-if="selectedFiles.length === 0"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span v-if="selectedFiles.length === 0">Click or drag images here</span>
          </div>

          <!-- Preview thumbnails -->
          <div v-if="selectedFiles.length > 0" class="image-previews">
            <div v-for="(f, i) in previewUrls" :key="i" class="preview-item">
              <img :src="f.url" :alt="f.name" />
              <button type="button" class="preview-remove" @click="removeFile(i)">×</button>
              <span class="preview-name">{{ f.name }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Note to customer (optional)</label>
          <textarea
            v-model="updateForm.note"
            placeholder="e.g. Arriving at 2pm, Team on site, Cleaning complete!"
            rows="3"
          ></textarea>
        </div>
        <p v-if="updateError" class="error-msg">{{ updateError }}</p>
        <p v-if="updateSuccess" class="success-msg">{{ updateSuccess }}</p>

        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <span>Uploading images... {{ uploadProgress }}%</span>
        </div>
      </div>
      <template #actions>
        <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="updateLoading"
          @click="submitUpdate"
        >
          {{
            updateLoading
              ? 'Sending...'
              : updateForm.newStatus === 'pending_review'
                ? 'Submit for Review'
                : 'Send Update'
          }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useFormatters, useSubmissions, useStatusUpdates } from '../../composables'
import LoadingSkeleton from '../../components/atoms/LoadingSkeleton.vue'
import StatusBadge from '../../components/atoms/StatusBadge.vue'
import AppModal from '../../components/atoms/AppModal.vue'
import type { ContactSubmission, SubmissionStatus } from '../../types/database'

const auth = useAuthStore()
const fmt = useFormatters()
const subs = useSubmissions()
const statusUpd = useStatusUpdates()

// Employee can set these statuses (no 'completed' — that's admin only)
const employeeStatuses: SubmissionStatus[] = [
  'new',
  'contacted',
  'scheduled',
  'in_progress',
  'pending_review',
  'cancelled',
]

const showModal = ref(false)
const activeSubmission = ref<ContactSubmission | null>(null)
const updateLoading = ref(false)
const updateError = ref('')
const updateSuccess = ref('')
const updateForm = reactive({ newStatus: '' as string, note: '' })

// Image upload state
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const dragActive = ref(false)
const uploadProgress = ref(0)

const previewUrls = computed(() =>
  selectedFiles.value.map((f) => ({
    url: URL.createObjectURL(f),
    name: f.name.length > 20 ? f.name.slice(0, 17) + '...' : f.name,
  })),
)

const stats = computed(() => {
  const all = subs.submissions.value
  return {
    total: all.length,
    new: all.filter((s) => s.status === 'new').length,
    inProgress: all.filter((s) => ['contacted', 'scheduled', 'in_progress'].includes(s.status))
      .length,
    pendingReview: all.filter((s) => s.status === 'pending_review').length,
    completed: all.filter((s) => s.status === 'completed').length,
  }
})

const modalTitle = computed(() =>
  updateForm.newStatus === 'pending_review' ? 'Submit for Review' : 'Update Status',
)

const modalSubtitle = computed(() =>
  activeSubmission.value
    ? `${activeSubmission.value.first_name} ${activeSubmission.value.last_name} — ${fmt.formatService(activeSubmission.value.service_type)}`
    : '',
)

function openUpdateModal(s: ContactSubmission) {
  activeSubmission.value = s
  updateForm.newStatus = s.status === 'in_progress' ? 'pending_review' : s.status
  updateForm.note = ''
  updateError.value = ''
  updateSuccess.value = ''
  selectedFiles.value = []
  uploadProgress.value = 0
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  activeSubmission.value = null
  selectedFiles.value = []
  uploadProgress.value = 0
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(Array.from(input.files))
}

function handleDrop(e: DragEvent) {
  dragActive.value = false
  if (e.dataTransfer?.files) addFiles(Array.from(e.dataTransfer.files))
}

function addFiles(files: File[]) {
  const imageFiles = files.filter((f) => f.type.startsWith('image/'))
  selectedFiles.value = [...selectedFiles.value, ...imageFiles].slice(0, 10) // max 10
}

function removeFile(index: number) {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
}

async function uploadImages(submissionId: string): Promise<string[]> {
  const urls: string[] = []
  const total = selectedFiles.value.length
  if (total === 0) return urls

  for (let i = 0; i < total; i++) {
    const file = selectedFiles.value[i]
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${submissionId}/${Date.now()}_${i}.${ext}`

    const { error } = await supabase.storage
      .from('cleaning-images')
      .upload(path, file, { upsert: true })

    if (error) {
      console.error('Upload error:', error)
      continue
    }

    const { data: urlData } = supabase.storage.from('cleaning-images').getPublicUrl(path)

    if (urlData?.publicUrl) urls.push(urlData.publicUrl)
    uploadProgress.value = Math.round(((i + 1) / total) * 100)
  }

  return urls
}

async function submitUpdate() {
  if (!activeSubmission.value) return
  updateLoading.value = true
  updateError.value = ''
  updateSuccess.value = ''

  try {
    const sub = activeSubmission.value
    const newStatus = updateForm.newStatus as SubmissionStatus

    // Upload images if pending_review
    let imageUrls: string[] = []
    if (newStatus === 'pending_review' && selectedFiles.value.length > 0) {
      imageUrls = await uploadImages(sub.id)
    }

    await subs.updateStatus(sub.id, newStatus)
    await statusUpd.insertUpdate(
      sub.id,
      sub.status,
      newStatus,
      updateForm.note.trim() || null,
      auth.user?.id || null,
      imageUrls.length > 0 ? imageUrls : null,
    )

    const label =
      newStatus === 'pending_review'
        ? 'Submitted for admin review'
        : `Status updated to "${fmt.formatStatus(newStatus)}"`
    updateSuccess.value = `${label}${imageUrls.length > 0 ? ` with ${imageUrls.length} image(s)` : ''}${updateForm.note ? ' with note' : ''}`
    setTimeout(closeModal, 1500)
  } catch (e) {
    console.error(e)
    updateError.value = e instanceof Error ? e.message : 'Failed to update status.'
  } finally {
    updateLoading.value = false
  }
}

onMounted(() => subs.loadAll())
</script>

<style scoped>
.employee-page {
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
  margin-bottom: var(--space-6);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}
.stat-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-3);
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--gray-800);
}
.stat-label {
  font-size: 0.8rem;
  color: var(--gray-500);
  font-weight: 500;
}
.stat-new {
  border-left: 3px solid #3b82f6;
}
.stat-progress {
  border-left: 3px solid #f59e0b;
}
.stat-review {
  border-left: 3px solid #7c3aed;
}
.stat-done {
  border-left: 3px solid #16a34a;
}

.employee-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: var(--gray-800);
}
.requests-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.request-card {
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: box-shadow 0.2s;
}
.request-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}
.request-header-left {
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
.request-body p {
  margin: 0 0 var(--space-2);
  font-size: 0.95rem;
  color: var(--gray-700);
}
.request-message {
  font-style: italic;
  color: var(--gray-500) !important;
  background: var(--gray-50);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  margin-top: var(--space-2);
}
.request-actions {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--gray-100);
}
.btn-sm {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.modal-form .form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--space-1);
}
.modal-form select,
.modal-form textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-family: var(--font-sans);
}
.modal-form select:focus,
.modal-form textarea:focus {
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
.empty-msg {
  color: var(--gray-500);
}

/* Image Upload */
.image-upload-section {
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
.upload-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.9rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: var(--space-1);
}
.upload-hint {
  font-size: 0.82rem;
  color: var(--gray-500);
  margin: 0 0 var(--space-3);
}
.upload-drop-zone {
  border: 2px dashed #d8b4fe;
  border-radius: var(--radius-md);
  padding: var(--space-5);
  text-align: center;
  cursor: pointer;
  color: #a78bfa;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.upload-drop-zone:hover,
.upload-drop-zone.drag-active {
  border-color: #7c3aed;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.04);
}
.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.preview-item {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid #e9d5ff;
  background: #fff;
}
.preview-item img {
  width: 100%;
  height: 75px;
  object-fit: cover;
  display: block;
}
.preview-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-name {
  display: block;
  font-size: 0.7rem;
  padding: 2px 4px;
  color: var(--gray-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.upload-progress span {
  font-size: 0.82rem;
  color: #7c3aed;
}
.progress-bar {
  height: 6px;
  background: #e9d5ff;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #7c3aed;
  border-radius: 3px;
  transition: width 0.3s;
}

@media (max-width: 640px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .request-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}
</style>
