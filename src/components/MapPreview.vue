<script setup>
import { ref, computed } from 'vue'
import { LMap, LTileLayer, LMarker, LIcon } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  lat: {
    type: Number,
    default: null
  },
  lng: {
    type: Number,
    default: null
  },
  locationName: {
    type: String,
    default: ''
  }
})

const zoom = ref(12)
const hasCoordinates = computed(() => props.lat !== null && props.lng !== null)
const center = computed(() => hasCoordinates.value ? [props.lat, props.lng] : [39.0742, 21.8243])

const markerIcon = {
  iconUrl: 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50">
      <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="#4CAF50"/>
      <circle cx="20" cy="18" r="10" fill="white"/>
      <text x="20" y="22" font-size="12" text-anchor="middle">🐄</text>
    </svg>
  `),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -35]
}
</script>

<template>
  <div class="map-preview">
    <div v-if="hasCoordinates" class="map-wrapper">
      <LMap
        :zoom="zoom"
        :center="center"
        :use-global-leaflet="false"
        :options="{ zoomControl: false, dragging: false, scrollWheelZoom: false }"
        class="preview-map"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <LMarker :lat-lng="center">
          <LIcon
            :icon-url="markerIcon.iconUrl"
            :icon-size="markerIcon.iconSize"
            :icon-anchor="markerIcon.iconAnchor"
          />
        </LMarker>
      </LMap>
      <div v-if="locationName" class="location-label">
        <span>📍 {{ locationName }}</span>
      </div>
    </div>
    <div v-else class="no-location">
      <div class="placeholder">
        <span class="icon">🗺️</span>
        <p>{{ locationName || 'Location not available' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-preview {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-map {
  width: 100%;
  height: 100%;
}

.location-label {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 1000;
  background: white;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-location {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  color: #888;
}

.placeholder .icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.placeholder p {
  font-size: 1rem;
  margin: 0;
}
</style>

