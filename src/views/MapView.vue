<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import { useCowsStore } from '@/stores/cows'
import FilterPanel from '@/components/FilterPanel.vue'

const router = useRouter()
const cowsStore = useCowsStore()

const zoom = ref(7)
const center = ref([39.0742, 21.8243]) // Greece center
const showFilters = ref(false)

const cowIcon = {
  iconUrl: 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
      <text x="20" y="28" font-size="20" text-anchor="middle">🐄</text>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
}

const cowsWithCoords = computed(() => {
  const cows = cowsStore.cows?.cows || cowsStore.cows || []
  return cows.filter(cow => cow.location?.coordinates?.lat && cow.location?.coordinates?.lng)
})

const loadCows = () => {
  cowsStore.fetchCows()
}

const onFiltersApply = () => {
  cowsStore.fetchCows()
}

const onFiltersClear = () => {
  cowsStore.fetchCows()
}

const viewDetails = (id) => {
  router.push(`/listing/${id}`)
}

const getCowImage = (cow) => {
  if (cow.images?.length) return cow.images[0]
  return cow.image || 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=100'
}

onMounted(() => {
  loadCows()
})
</script>

<template>
  <div class="map-view">
    <!-- Filter Toggle Button -->
    <button class="filter-toggle-btn" @click="showFilters = !showFilters">
      🔍 {{ showFilters ? 'Hide Filters' : 'Filters' }}
    </button>

    <!-- Filter Panel Overlay -->
    <div v-if="showFilters" class="filter-overlay">
      <FilterPanel @apply="onFiltersApply" @clear="onFiltersClear" />
    </div>

    <!-- Loading State -->
    <div v-if="cowsStore.loading" class="map-loading">
      <div class="spinner"></div>
      <p>Loading listings...</p>
    </div>

    <!-- Map Container -->
    <div class="map-container">
      <LMap
        ref="map"
        :zoom="zoom"
        :center="center"
        :use-global-leaflet="false"
        class="leaflet-map"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <LMarker
          v-for="cow in cowsWithCoords"
          :key="cow._id || cow.id"
          :lat-lng="[cow.location.coordinates.lat, cow.location.coordinates.lng]"
        >
          <LIcon
            :icon-url="cowIcon.iconUrl"
            :icon-size="cowIcon.iconSize"
            :icon-anchor="cowIcon.iconAnchor"
            :popup-anchor="cowIcon.popupAnchor"
          />
          <LPopup>
            <div class="cow-popup">
              <img :src="getCowImage(cow)" :alt="cow.name" class="popup-image" />
              <div class="popup-content">
                <h3>{{ cow.name }}</h3>
                <p class="popup-breed">{{ cow.breed }}</p>
                <p class="popup-price">€{{ cow.price?.toLocaleString() }}</p>
                <button class="popup-btn" @click="viewDetails(cow._id || cow.id)">
                  View Details →
                </button>
              </div>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
    </div>

    <!-- No Results Message -->
    <div v-if="!cowsStore.loading && cowsWithCoords.length === 0" class="no-results">
      <p>🗺️ No listings with location data found</p>
      <router-link to="/listings" class="link">Browse all listings</router-link>
    </div>

    <!-- Legend -->
    <div class="map-legend">
      <span class="legend-item">🐄 {{ cowsWithCoords.length }} listings on map</span>
    </div>
  </div>
</template>

<style scoped>
.map-view {
  position: relative;
  height: calc(100vh - 80px);
  margin: -20px;
  display: flex;
  flex-direction: column;
}

.filter-toggle-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
  background: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.filter-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.filter-overlay {
  position: absolute;
  top: 70px;
  left: 16px;
  z-index: 1000;
  width: 320px;
  max-width: calc(100% - 32px);
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 30px 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: var(--primary, #4CAF50);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-container {
  flex: 1;
  width: 100%;
}

.leaflet-map {
  width: 100%;
  height: 100%;
}

.no-results {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 30px 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.no-results p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 16px;
}

.no-results .link {
  color: var(--primary, #4CAF50);
  font-weight: 600;
  text-decoration: none;
}

.no-results .link:hover {
  text-decoration: underline;
}

.map-legend {
  position: absolute;
  bottom: 24px;
  left: 16px;
  z-index: 1000;
  background: white;
  padding: 10px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  color: #666;
}

/* Popup Styles */
.cow-popup {
  min-width: 200px;
  max-width: 250px;
}

.popup-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.popup-content h3 {
  margin: 0 0 4px;
  font-size: 1.1rem;
  color: #333;
}

.popup-breed {
  color: var(--primary, #4CAF50);
  font-weight: 500;
  margin: 0 0 8px;
  font-size: 0.9rem;
}

.popup-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px;
}

.popup-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.popup-btn:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 480px) {
  .filter-overlay {
    width: calc(100% - 32px);
    left: 16px;
    right: 16px;
  }

  .map-legend {
    bottom: 80px;
  }
}
</style>

