<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCowsStore } from '@/stores/cows'
import api from '@/services/api'
import L from 'leaflet'

const router = useRouter()
const cowsStore = useCowsStore()

// Form data
const formData = ref({
  name: '',
  breed: '',
  age: null,
  weight: null,
  price: null,
  description: '',
  location: {
    address: '',
    coordinates: {
      lat: null,
      lng: null
    }
  }
})

// Image upload state
const images = ref([])
const uploadProgress = ref({})
const isDragging = ref(false)
const fileInput = ref(null)

// Form state
const loading = ref(false)
const error = ref('')
const mapContainer = ref(null)
let map = null
let marker = null

// Breed options
const breeds = [
  'Holstein Friesian',
  'Jersey',
  'Angus',
  'Brown Swiss',
  'Hereford',
  'Charolais',
  'Other'
]

// Computed
const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.breed &&
    formData.value.age > 0 &&
    formData.value.weight > 0 &&
    formData.value.price > 0 &&
    formData.value.description.trim()
  )
})

const canUploadMore = computed(() => images.value.length < 5)

// Methods
const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  handleFiles(files)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  handleFiles(files)
  e.target.value = ''
}

const handleFiles = async (files) => {
  const remaining = 5 - images.value.length
  const filesToUpload = files.slice(0, remaining)

  for (const file of filesToUpload) {
    await uploadFile(file)
  }
}

const uploadFile = async (file) => {
  const tempId = `temp_${Date.now()}_${Math.random()}`
  const preview = URL.createObjectURL(file)

  images.value.push({
    id: tempId,
    preview,
    url: null,
    uploading: true
  })

  uploadProgress.value[tempId] = 0

  const formDataUpload = new FormData()
  formDataUpload.append('images', file)

  try {
    const response = await api.post('/upload', formDataUpload, {
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
    }
  } catch (err) {
    const idx = images.value.findIndex(img => img.id === tempId)
    if (idx !== -1) {
      images.value.splice(idx, 1)
    }
    error.value = 'Failed to upload image. Please try again.'
  } finally {
    delete uploadProgress.value[tempId]
  }
}

const removeImage = (index) => {
  const img = images.value[index]
  if (img.preview) {
    URL.revokeObjectURL(img.preview)
  }
  images.value.splice(index, 1)
}

const initMap = () => {
  if (!mapContainer.value || map) return

  // Default to center of Europe
  const defaultLat = 48.8566
  const defaultLng = 2.3522

  map = L.map(mapContainer.value).setView([defaultLat, defaultLng], 5)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  map.on('click', (e) => {
    setMarker(e.latlng.lat, e.latlng.lng)
  })
}

const setMarker = (lat, lng) => {
  formData.value.location.coordinates.lat = parseFloat(lat.toFixed(6))
  formData.value.location.coordinates.lng = parseFloat(lng.toFixed(6))

  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    const cowIcon = L.divIcon({
      className: 'cow-marker',
      html: '<div class="marker-pin">📍</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
    marker = L.marker([lat, lng], { icon: cowIcon }).addTo(map)
  }

  map.setView([lat, lng], 10)
}

const handleCoordinateInput = () => {
  const { lat, lng } = formData.value.location.coordinates
  if (lat && lng && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    if (map) {
      setMarker(lat, lng)
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  error.value = ''
  loading.value = true

  const imageUrls = images.value
    .filter(img => img.url)
    .map(img => img.url)

  const cowData = {
    name: formData.value.name.trim(),
    breed: formData.value.breed,
    age: Number(formData.value.age),
    weight: Number(formData.value.weight),
    price: Number(formData.value.price),
    description: formData.value.description.trim(),
    images: imageUrls,
    location: {
      address: formData.value.location.address.trim() || 'Not specified',
      coordinates: formData.value.location.coordinates.lat && formData.value.location.coordinates.lng
        ? formData.value.location.coordinates
        : null
    }
  }

  const result = await cowsStore.createCow(cowData)

  loading.value = false

  if (result.success) {
    router.push(`/listing/${result.cow._id}`)
  } else {
    error.value = result.error || 'Failed to create listing'
  }
}

onMounted(() => {
  setTimeout(initMap, 100)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  images.value.forEach(img => {
    if (img.preview) URL.revokeObjectURL(img.preview)
  })
})
</script>

<template>
  <div class="add-listing-view">
    <div class="form-card">
      <div class="form-header">
        <h1>🐄 Add New Listing</h1>
        <p>Create a listing for your cow</p>
      </div>

      <form @submit.prevent="handleSubmit" class="listing-form">
        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <!-- Image Upload Section -->
        <section class="form-section">
          <h2 class="section-title">📸 Photos</h2>
          <p class="section-hint">Add up to 5 images of your cow</p>

          <div
            v-if="canUploadMore"
            class="upload-zone"
            :class="{ dragging: isDragging }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              hidden
              @change="handleFileSelect"
            />
            <div class="upload-content">
              <span class="upload-icon">📤</span>
              <p class="upload-text">
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p class="upload-hint">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          <div v-if="images.length" class="image-previews">
            <div v-for="(img, index) in images" :key="img.id" class="image-preview">
              <img :src="img.preview" :alt="`Preview ${index + 1}`" />
              <div v-if="img.uploading" class="upload-overlay">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${uploadProgress[img.id] || 0}%` }"
                  ></div>
                </div>
                <span>{{ uploadProgress[img.id] || 0 }}%</span>
              </div>
              <button
                v-else
                type="button"
                class="remove-btn"
                @click="removeImage(index)"
              >
                ✕
              </button>
            </div>
          </div>
        </section>

        <!-- Cow Details Section -->
        <section class="form-section">
          <h2 class="section-title">🐮 Cow Details</h2>

          <div class="form-group">
            <label for="name">Name *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter cow's name"
              :disabled="loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="breed">Breed *</label>
            <select
              id="breed"
              v-model="formData.breed"
              :disabled="loading"
              required
            >
              <option value="" disabled>Select a breed</option>
              <option v-for="breed in breeds" :key="breed" :value="breed">
                {{ breed }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age (years) *</label>
              <input
                id="age"
                v-model.number="formData.age"
                type="number"
                min="0"
                max="30"
                step="1"
                placeholder="e.g. 3"
                :disabled="loading"
                required
              />
            </div>

            <div class="form-group">
              <label for="weight">Weight (kg) *</label>
              <input
                id="weight"
                v-model.number="formData.weight"
                type="number"
                min="0"
                max="2000"
                step="1"
                placeholder="e.g. 500"
                :disabled="loading"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="price">Price (€) *</label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 2500"
              :disabled="loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Describe your cow's characteristics, health, temperament..."
              :disabled="loading"
              required
            ></textarea>
          </div>
        </section>

        <!-- Location Section -->
        <section class="form-section">
          <h2 class="section-title">📍 Location</h2>

          <div class="form-group">
            <label for="address">Address / Farm Name</label>
            <input
              id="address"
              v-model="formData.location.address"
              type="text"
              placeholder="e.g. Green Valley Farm, Munich"
              :disabled="loading"
            />
          </div>

          <div class="map-section">
            <p class="map-hint">Click on the map to set location, or enter coordinates:</p>
            <div ref="mapContainer" class="map-container"></div>
          </div>

          <div class="form-row coordinates-row">
            <div class="form-group">
              <label for="lat">Latitude</label>
              <input
                id="lat"
                v-model.number="formData.location.coordinates.lat"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                placeholder="e.g. 48.1351"
                :disabled="loading"
                @change="handleCoordinateInput"
              />
            </div>

            <div class="form-group">
              <label for="lng">Longitude</label>
              <input
                id="lng"
                v-model.number="formData.location.coordinates.lng"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                placeholder="e.g. 11.5820"
                :disabled="loading"
                @change="handleCoordinateInput"
              />
            </div>
          </div>
        </section>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="!isFormValid || loading"
        >
          <span v-if="loading" class="loader"></span>
          <span v-else>🐄 Create Listing</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-listing-view {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
}

.form-header p {
  color: #666;
  font-size: 0.95rem;
}

.listing-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 24px;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.section-hint {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.upload-zone:hover,
.upload-zone.dragging {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.upload-text {
  color: #333;
  margin-bottom: 4px;
}

.upload-hint {
  color: #888;
  font-size: 0.85rem;
}

/* Image Previews */
.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
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

.progress-bar {
  width: 80%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.2s;
}

.remove-btn {
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
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #f44336;
}

/* Form Controls */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Map Section */
.map-section {
  margin-top: 16px;
}

.map-hint {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.map-container {
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  z-index: 1;
}

.coordinates-row {
  margin-top: 16px;
}

/* Error Message */
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
}

/* Submit Button */
.btn-submit {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .form-card {
    padding: 24px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .upload-zone {
    padding: 30px 16px;
  }

  .image-previews {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Leaflet marker override */
:deep(.cow-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  font-size: 30px;
  line-height: 1;
}
</style>

