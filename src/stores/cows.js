import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCowsStore = defineStore('cows', {
  state: () => ({
    cows: [],
    currentCow: null,
    filters: {
      breed: '',
      priceRange: { min: null, max: null },
      ageRange: { min: null, max: null }
    },
    loading: false,
    error: null
  }),

  actions: {
    async fetchCows(filterParams = {}) {
      this.loading = true
      this.error = null

      try {
        const params = new URLSearchParams()

        if (filterParams.breed || this.filters.breed) {
          params.append('breed', filterParams.breed || this.filters.breed)
        }
        if (filterParams.minPrice || this.filters.priceRange.min) {
          params.append('minPrice', filterParams.minPrice || this.filters.priceRange.min)
        }
        if (filterParams.maxPrice || this.filters.priceRange.max) {
          params.append('maxPrice', filterParams.maxPrice || this.filters.priceRange.max)
        }
        if (filterParams.minAge || this.filters.ageRange.min) {
          params.append('minAge', filterParams.minAge || this.filters.ageRange.min)
        }
        if (filterParams.maxAge || this.filters.ageRange.max) {
          params.append('maxAge', filterParams.maxAge || this.filters.ageRange.max)
        }

        const response = await api.get(`/cows?${params.toString()}`)
        this.cows = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cows'
      } finally {
        this.loading = false
      }
    },

    async fetchCow(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/cows/${id}`)
        this.currentCow = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cow'
        return null
      } finally {
        this.loading = false
      }
    },

    async createCow(cowData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/cows', cowData)
        this.cows.push(response.data)
        return { success: true, cow: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create listing'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateCow(id, cowData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put(`/cows/${id}`, cowData)
        const index = this.cows.findIndex((c) => c._id === id)
        if (index !== -1) {
          this.cows[index] = response.data
        }
        if (this.currentCow?._id === id) {
          this.currentCow = response.data
        }
        return { success: true, cow: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update listing'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        breed: '',
        priceRange: { min: null, max: null },
        ageRange: { min: null, max: null }
      }
    }
  }
})

