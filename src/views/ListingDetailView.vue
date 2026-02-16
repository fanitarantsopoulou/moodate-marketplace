<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCowsStore } from '@/stores/cows'
import { useAuthStore } from '@/stores/auth'
import MapPreview from '@/components/MapPreview.vue'

const route = useRoute()
const router = useRouter()
const cowsStore = useCowsStore()
const authStore = useAuthStore()

const currentImageIndex = ref(0)
const showLoginPrompt = ref(false)

const cow = computed(() => cowsStore.currentCow)
const images = computed(() => {
  if (!cow.value) return []
  return cow.value.images?.length ? cow.value.images : [cow.value.image]
})

const nextImage = () => {
  if (images.value.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  }
}

const prevImage = () => {
  if (images.value.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0
      ? images.value.length - 1
      : currentImageIndex.value - 1
  }
}

const goBack = () => {
  router.push('/listings')
}

const contactSeller = () => {
  if (!authStore.isAuthenticated) {
    showLoginPrompt.value = true
    return
  }
  router.push(`/messages/${cow.value._id || cow.value.id}`)
}

const goToLogin = () => {
  router.push({ name: 'Login', query: { redirect: route.fullPath } })
}

onMounted(async () => {
  const id = route.params.id
  await cowsStore.fetchCow(id)
})
</script>

<template>
  <div class="detail-view">
    <button class="back-btn" @click="goBack">← Back to Listings</button>

    <div v-if="cowsStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <div v-else-if="cowsStore.error || !cow" class="error-message">
      <p>⚠️ {{ cowsStore.error || 'Cow not found' }}</p>
      <button class="btn btn-back" @click="goBack">Back to Listings</button>
    </div>

    <div v-else class="cow-detail">
      <!-- Image Gallery -->
      <div class="gallery">
        <div class="main-image">
          <img :src="images[currentImageIndex]" :alt="cow.name" />
          <div v-if="images.length > 1" class="gallery-nav">
            <button class="nav-btn" @click="prevImage">‹</button>
            <span class="image-count">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
            <button class="nav-btn" @click="nextImage">›</button>
          </div>
        </div>
        <div v-if="images.length > 1" class="thumbnails">
          <img
            v-for="(img, index) in images"
            :key="index"
            :src="img"
            :class="{ active: index === currentImageIndex }"
            @click="currentImageIndex = index"
          />
        </div>
      </div>

      <!-- Cow Info -->
      <div class="info-section">
        <div class="header-row">
          <h1>{{ cow.name }}</h1>
          <div class="price">€{{ cow.price?.toLocaleString() }}</div>
        </div>
        <p class="breed">{{ cow.breed }}</p>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Age</span>
            <span class="stat-value">{{ cow.age }} years</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Weight</span>
            <span class="stat-value">{{ cow.weight }} kg</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Location</span>
            <span class="stat-value">{{ cow.location }}</span>
          </div>
        </div>

        <div class="description">
          <h3>Description</h3>
          <p>{{ cow.description }}</p>
        </div>

        <!-- Seller Info -->
        <div class="seller-section">
          <h3>Seller Information</h3>
          <div class="seller-info">
            <div class="seller-avatar">{{ cow.seller?.name?.[0] || '👤' }}</div>
            <div class="seller-details">
              <p class="seller-name">{{ cow.seller?.name || 'Farm Owner' }}</p>
              <p class="seller-location">{{ cow.location }}</p>
            </div>
          </div>
        </div>

        <!-- Map Preview -->
        <div class="map-section">
          <h3>📍 Farm Location</h3>
          <MapPreview
            :lat="cow.location?.coordinates?.lat"
            :lng="cow.location?.coordinates?.lng"
            :location-name="cow.location?.address || cow.location"
          />
        </div>

        <!-- Contact Button -->
        <button class="btn btn-contact" @click="contactSeller">
          💬 Contact Seller
        </button>
      </div>
    </div>

    <!-- Login Prompt Modal -->
    <div v-if="showLoginPrompt" class="modal-overlay" @click.self="showLoginPrompt = false">
      <div class="modal">
        <h3>Login Required</h3>
        <p>You need to be logged in to contact the seller.</p>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="showLoginPrompt = false">Cancel</button>
          <button class="btn btn-login" @click="goToLogin">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 100%;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 16px;
  font-weight: 500;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top-color: var(--primary, #4CAF50);
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  color: #666;
}

.error-message p {
  margin-bottom: 16px;
}

.cow-detail {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.gallery {
  position: relative;
}

.main-image {
  position: relative;
  height: 280px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-nav {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
}

.nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 8px;
}

.image-count {
  color: white;
  font-size: 0.9rem;
}

.thumbnails {
  display: flex;
  gap: 8px;
  padding: 12px;
  overflow-x: auto;
}

.thumbnails img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.thumbnails img.active,
.thumbnails img:hover {
  opacity: 1;
}

.info-section {
  padding: 20px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.header-row h1 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.price {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.2rem;
}

.breed {
  color: var(--primary, #4CAF50);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0 0 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 4px;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.description {
  margin-bottom: 20px;
}

.description h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

.description p {
  color: #666;
  line-height: 1.6;
}

.seller-section {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.seller-section h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 12px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.seller-name {
  font-weight: 600;
  color: #333;
  margin: 0;
}

.seller-location {
  font-size: 0.9rem;
  color: #666;
  margin: 4px 0 0;
}

.map-section {
  margin-bottom: 20px;
}

.map-section h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 12px;
}

.btn-contact {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 320px;
  text-align: center;
}

.modal h3 {
  margin: 0 0 12px;
  color: #333;
}

.modal p {
  color: #666;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-login {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-back {
  padding: 12px 24px;
  background: var(--primary, #4CAF50);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
