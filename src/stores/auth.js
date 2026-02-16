import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSeller: (state) => state.user?.role === 'seller'
  },

  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Login failed'
        }
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/register', userData)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Registration failed'
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    }
  }
})

