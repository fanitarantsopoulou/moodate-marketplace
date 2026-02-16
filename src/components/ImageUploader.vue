<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxImages: {
    type: Number,
    default: 5
  },
  maxSize: {
    type: Number,
    default: 5 // MB
  }
})

const emit = defineEmits(['update:modelValue'])

// Internal state
const images = ref([])
const uploadProgress = ref({})
const isDragging = ref(false)
const fileInput = ref(null)
const error = ref('')

// Allowed file types
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

// Computed
const canUploadMore = computed(() => images.value.length < props.maxImages)
const remainingSlots = computed(() => props.maxImages - images.value.length)

// Sync with modelValue prop
watch(() => props.modelValue, (newVal) => {
  if (Array.isArray(newVal) && newVal.length > 0) {
    // Only sync if images array is empty (initial load)
    if (images.value.length === 0) {
      images.value = newVal.map((url, i) => ({
        id: `existing_${i}_${Date.now()}`,
        preview: url,
        url,
        uploading: false
      }))
    }
  }
}, { immediate: true })

// Emit changes to parent
const emitUpdate = () => {
  const urls = images.value
    .filter(img => img.url)
    .map(img => img.url)
  emit('update:modelValue', urls)
}

// Validation
const validateFile = (file) => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const ext = file.name.toLowerCase().split('.').pop()
    if (!allowedExtensions.includes(`.${ext}`)) {
      return `Invalid file type: ${file.name}. Only JPG, PNG, GIF, WEBP allowed.`
    }
  }
  
  // Check file size
  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > props.maxSize) {
    return `File too large: ${file.name} (${sizeMB.toFixed(1)}MB). Max ${props.maxSize}MB allowed.`
  }
  
  return null
}

// Drag and drop handlers
const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  handleFiles(files)
}

// File input handlers
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  handleFiles(files)
  e.target.value = '' // Reset input
}

// Process files
const handleFiles = async (files) => {
  error.value = ''
  const filesToUpload = files.slice(0, remainingSlots.value)
  
  if (files.length > remainingSlots.value) {
    error.value = `Only ${remainingSlots.value} more image(s) can be added.`
  }
  
  for (const file of filesToUpload) {
    const validationError = validateFile(file)
    if (validationError) {
      error.value = validationError
      continue
    }
    await uploadFile(file)
  }
}

// Upload single file
const uploadFile = async (file) => {
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const preview = URL.createObjectURL(file)

  images.value.push({
    id: tempId,
    preview,
    url: null,
    uploading: true,
    error: null
  })

  uploadProgress.value[tempId] = 0

  const formData = new FormData()
  formData.append('images', file)

  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value[tempId] = percent
      }
    })

    const idx = images.value.findIndex(img => img.id === tempId)
    if (idx !== -1) {
      images.value[idx].url = response.data.urls[0]
      images.value[idx].uploading = false
      emitUpdate()
    }
  } catch (err) {
    const idx = images.value.findIndex(img => img.id === tempId)
    if (idx !== -1) {
      images.value[idx].uploading = false
      images.value[idx].error = err.response?.data?.error || 'Upload failed'
    }
    error.value = err.response?.data?.error || 'Failed to upload image. Please try again.'
  } finally {
    delete uploadProgress.value[tempId]
  }
}

// Remove image
const removeImage = (index) => {
  const img = images.value[index]
  if (img.preview && img.preview.startsWith('blob:')) {
    URL.revokeObjectURL(img.preview)
  }
  images.value.splice(index, 1)
  emitUpdate()
}

// Retry failed upload
const retryUpload = async (index) => {
  const img = images.value[index]
  if (img.error && img.preview) {
    // Fetch the blob from the preview URL and re-upload
    try {
      const response = await fetch(img.preview)
      const blob = await response.blob()
      images.value.splice(index, 1) // Remove the failed one
      await uploadFile(new File([blob], 'retry.jpg', { type: blob.type }))
    } catch {
      error.value = 'Failed to retry upload.'
    }
  }
}

// Clear error
const clearError = () => {
  error.value = ''
}

// Cleanup on unmount
onUnmounted(() => {
  images.value.forEach(img => {
    if (img.preview && img.preview.startsWith('blob:')) {
      URL.revokeObjectURL(img.preview)
    }
  })
})
</script>

<template>
  <div class="image-uploader">
    <!-- Error Alert -->
    <div v-if="error" class="error-alert" @click="clearError">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ error }}</span>
      <button type="button" class="error-close" @click.stop="clearError">✕</button>
    </div>

    <!-- Drop Zone -->
    <div
      v-if="canUploadMore"
      class="drop-zone"
      :class="{ 'drop-zone--dragging': isDragging }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        hidden
        @change="handleFileSelect"
      />
      <div class="drop-zone__content">
        <span class="drop-zone__icon">📤</span>
        <p class="drop-zone__title">
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p class="drop-zone__hint">
          JPG, PNG, GIF, WEBP up to {{ maxSize }}MB
        </p>
        <p class="drop-zone__counter">
          {{ images.length }}/{{ maxImages }} images
        </p>
      </div>
    </div>

    <!-- Max Images Reached -->
    <div v-else class="max-reached">
      <span class="max-reached__icon">✅</span>
      <span>Maximum {{ maxImages }} images uploaded</span>
    </div>

    <!-- Image Previews Grid -->
    <div v-if="images.length" class="preview-grid">
      <div
        v-for="(img, index) in images"
        :key="img.id"
        class="preview-item"
        :class="{
          'preview-item--uploading': img.uploading,
          'preview-item--error': img.error
        }"
      >
        <img :src="img.preview" :alt="`Image ${index + 1}`" class="preview-item__image" />

        <!-- Upload Progress Overlay -->
        <div v-if="img.uploading" class="preview-item__overlay">
          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: `${uploadProgress[img.id] || 0}%` }"
            ></div>
          </div>
          <span class="progress-bar__text">{{ uploadProgress[img.id] || 0 }}%</span>
        </div>

        <!-- Error Overlay -->
        <div v-else-if="img.error" class="preview-item__overlay preview-item__overlay--error">
          <span class="error-badge">!</span>
          <button type="button" class="retry-btn" @click="retryUpload(index)">Retry</button>
        </div>

        <!-- Remove Button -->
        <button
          v-if="!img.uploading"
          type="button"
          class="preview-item__remove"
          @click="removeImage(index)"
          :title="img.error ? 'Remove failed image' : 'Remove image'"
        >
          ✕
        </button>

        <!-- Success Badge -->
        <span v-if="img.url && !img.error" class="success-badge">✓</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-uploader {
  width: 100%;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  font-size: 1.1rem;
}

.error-text {
  flex: 1;
}

.error-close {
  background: none;
  border: none;
  color: #c62828;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 4px;
}

/* Drop Zone */
.drop-zone {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.drop-zone:hover,
.drop-zone--dragging {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.drop-zone--dragging {
  transform: scale(1.01);
}

.drop-zone__content {
  pointer-events: none;
}

.drop-zone__icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.drop-zone__title {
  color: #333;
  margin-bottom: 4px;
  font-size: 1rem;
}

.drop-zone__hint {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.drop-zone__counter {
  color: #4CAF50;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Max Reached */
.max-reached {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #e8f5e9;
  border-radius: 10px;
  color: #2e7d32;
  font-weight: 500;
}

.max-reached__icon {
  font-size: 1.2rem;
}

/* Preview Grid */
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-item--error {
  border: 2px solid #f44336;
}

.preview-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Overlay */
.preview-item__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  font-size: 0.85rem;
}

.preview-item__overlay--error {
  background: rgba(244, 67, 54, 0.8);
}

/* Progress Bar */
.progress-bar {
  width: 80%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.2s ease;
}

.progress-bar__text {
  font-weight: 600;
}

/* Error Badge */
.error-badge {
  width: 30px;
  height: 30px;
  background: white;
  color: #f44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.retry-btn {
  background: white;
  color: #f44336;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #fee;
}

/* Remove Button */
.preview-item__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  opacity: 0;
}

.preview-item:hover .preview-item__remove {
  opacity: 1;
}

.preview-item__remove:hover {
  background: #f44336;
  transform: scale(1.1);
}

/* Success Badge */
.success-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 480px) {
  .drop-zone {
    padding: 30px 16px;
  }

  .preview-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .preview-item__remove {
    opacity: 1;
  }
}
</style>

