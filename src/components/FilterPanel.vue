<script setup>
import { ref, watch } from 'vue'
import { useCowsStore } from '@/stores/cows'

const cowsStore = useCowsStore()
const emit = defineEmits(['apply', 'clear'])

const isOpen = ref(false)
const breed = ref('')
const minPrice = ref('')
const maxPrice = ref('')
const minAge = ref('')
const maxAge = ref('')

const breedOptions = [
  'Holstein Friesian',
  'Jersey',
  'Angus',
  'Brown Swiss',
  'Hereford',
  'Charolais',
  'Other'
]

const toggle = () => {
  isOpen.value = !isOpen.value
}

const applyFilters = () => {
  const filters = {
    breed: breed.value,
    priceRange: {
      min: minPrice.value ? Number(minPrice.value) : null,
      max: maxPrice.value ? Number(maxPrice.value) : null
    },
    ageRange: {
      min: minAge.value ? Number(minAge.value) : null,
      max: maxAge.value ? Number(maxAge.value) : null
    }
  }
  cowsStore.setFilters(filters)
  emit('apply', filters)
}

const clearFilters = () => {
  breed.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  minAge.value = ''
  maxAge.value = ''
  cowsStore.clearFilters()
  emit('clear')
}

// Sync with store filters
watch(() => cowsStore.filters, (filters) => {
  breed.value = filters.breed || ''
  minPrice.value = filters.priceRange.min || ''
  maxPrice.value = filters.priceRange.max || ''
  minAge.value = filters.ageRange.min || ''
  maxAge.value = filters.ageRange.max || ''
}, { immediate: true })
</script>

<template>
  <div class="filter-panel">
    <button class="filter-toggle" @click="toggle">
      🔍 Filters
      <span class="toggle-icon">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <div v-show="isOpen" class="filter-content">
      <div class="filter-group">
        <label>Breed</label>
        <select v-model="breed">
          <option value="">All Breeds</option>
          <option v-for="b in breedOptions" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Price Range (€)</label>
        <div class="range-inputs">
          <input v-model="minPrice" type="number" placeholder="Min" min="0" />
          <span class="range-separator">-</span>
          <input v-model="maxPrice" type="number" placeholder="Max" min="0" />
        </div>
      </div>

      <div class="filter-group">
        <label>Age Range (years)</label>
        <div class="range-inputs">
          <input v-model="minAge" type="number" placeholder="Min" min="0" max="20" />
          <span class="range-separator">-</span>
          <input v-model="maxAge" type="number" placeholder="Max" min="0" max="20" />
        </div>
      </div>

      <div class="filter-actions">
        <button class="btn btn-clear" @click="clearFilters">Clear</button>
        <button class="btn btn-apply" @click="applyFilters">Apply Filters</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.filter-toggle {
  width: 100%;
  padding: 16px 20px;
  background: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.filter-toggle:hover {
  background: #f9f9f9;
}

.toggle-icon {
  font-size: 0.8rem;
  color: #666;
}

.filter-content {
  padding: 0 20px 20px;
  border-top: 1px solid #eee;
}

.filter-group {
  margin-top: 16px;
}

.filter-group label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--primary, #4CAF50);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-inputs input {
  flex: 1;
}

.range-separator {
  color: #999;
  font-weight: bold;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-clear {
  background: #f5f5f5;
  color: #666;
}

.btn-clear:hover {
  background: #eee;
}

.btn-apply {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-apply:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}
</style>

