<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">🐄 MooDate</router-link>
    </div>

    <div class="navbar-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/listings" class="nav-link">Listings</router-link>
      <router-link to="/map" class="nav-link">Map</router-link>

      <template v-if="isAuthenticated">
        <router-link to="/add-listing" class="nav-link">Add Listing</router-link>
        <router-link to="/messages" class="nav-link">Messages</router-link>
        <router-link to="/profile" class="nav-link">Profile</router-link>
        <button @click="handleLogout" class="nav-link logout-btn">Logout</button>
      </template>

      <template v-else>
        <router-link to="/login" class="nav-link">Login</router-link>
        <router-link to="/register" class="nav-link register-btn">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4caf50;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #4caf50;
}

.nav-link.router-link-active {
  color: #4caf50;
  background-color: #e8f5e9;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.logout-btn:hover {
  color: #f44336;
  background-color: #ffebee;
}

.register-btn {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white !important;
}

.register-btn:hover {
  opacity: 0.9;
  background: linear-gradient(135deg, #4caf50, #8bc34a);
}
</style>

