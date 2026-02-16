<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCowsStore } from '@/stores/cows'
import FilterPanel from '@/components/FilterPanel.vue'

const router = useRouter()
const cowsStore = useCowsStore()

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

onMounted(() => {
  loadCows()
})

watch(() => cowsStore.filters, () => {
  loadCows()
}, { deep: true })
</script>

<template>
  <div class="listings-view">
    <header class="header">
      <h1>🐄 Browse Cows</h1>
      <p>Find your perfect cow</p>
    </header>

    <FilterPanel @apply="onFiltersApply" @clear="onFiltersClear" />

    <div v-if="cowsStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Loading cows...</p>
    </div>

    <div v-else-if="cowsStore.error" class="error-message">
      <p>⚠️ {{ cowsStore.error }}</p>
      <button class="btn btn-retry" @click="loadCows">Try Again</button>
    </div>

    <div v-else-if="cowsStore.cows.length === 0" class="no-results">
      <p>🐄 No cows found matching your filters</p>
      <p class="hint">Try adjusting your search criteria</p>
    </div>

    <div v-else class="listings-grid">
      <div v-for="cow in cowsStore.cows" :key="cow._id || cow.id" class="listing-card">
        <div class="card-image">
          <img :src="cow.images?.[0] || cow.image" :alt="cow.name" />
          <div class="price-tag">€{{ cow.price?.toLocaleString() }}</div>
        </div>
        <div class="card-content">
          <h3>{{ cow.name }}</h3>
          <p class="breed">{{ cow.breed }}</p>
          <div class="card-info">
            <span>🎂 {{ cow.age }} years</span>
            <span>📍 {{ cow.location }}</span>
          </div>
          <button class="btn btn-details" @click="viewDetails(cow._id || cow.id)">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.listings-view {
  max-width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  color: white;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header p {
  opacity: 0.9;
  font-size: 1rem;
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

.error-message,
.no-results {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  color: #666;
}

.error-message p {
  color: var(--danger, #f44336);
  margin-bottom: 16px;
}

.no-results .hint {
  font-size: 0.9rem;
  margin-top: 8px;
  opacity: 0.7;
}

.btn-retry {
  padding: 12px 24px;
  background: var(--primary, #4CAF50);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.listings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 600px) {
  .listings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .listings-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.listing-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.listing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 16px;
}

.card-content h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 4px;
}

.breed {
  color: var(--primary, #4CAF50);
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0 0 12px;
}

.card-info {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 12px;
}

.btn-details {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
</style>
