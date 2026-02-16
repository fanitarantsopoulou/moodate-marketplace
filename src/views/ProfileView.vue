<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isSeller = computed(() => authStore.isSeller)

const isEditing = ref(false)
const editForm = ref({ name: '', phone: '' })
const editLoading = ref(false)
const editError = ref('')
const editSuccess = ref('')

const myListings = ref([])
const listingsLoading = ref(false)

const initEditForm = () => {
  editForm.value = {
    name: user.value?.name || '',
    phone: user.value?.phone || ''
  }
  editError.value = ''
  editSuccess.value = ''
}

const startEditing = () => {
  initEditForm()
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editError.value = ''
}

const saveProfile = async () => {
  editError.value = ''
  editSuccess.value = ''

  if (!editForm.value.name.trim()) {
    editError.value = 'Name is required'
    return
  }

  editLoading.value = true

  try {
    const response = await api.put('/auth/profile', {
      name: editForm.value.name.trim(),
      phone: editForm.value.phone.trim() || null
    })

    authStore.user = response.data.user
    localStorage.setItem('user', JSON.stringify(response.data.user))
    editSuccess.value = 'Profile updated successfully!'
    isEditing.value = false
  } catch (error) {
    editError.value = error.response?.data?.error || 'Failed to update profile'
  } finally {
    editLoading.value = false
  }
}

const fetchMyListings = async () => {
  if (!isSeller.value) return

  listingsLoading.value = true
  try {
    const response = await api.get('/cows/my-listings')
    myListings.value = response.data.cows || response.data || []
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    myListings.value = []
  } finally {
    listingsLoading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchMyListings()
})
</script>

<template>
  <div class="profile-view">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div class="profile-title">
          <h1>{{ user?.name }}</h1>
          <span :class="['role-badge', user?.role]">
            {{ user?.role === 'seller' ? '🏷️ Seller' : '🛒 Buyer' }}
          </span>
        </div>
      </div>

      <div v-if="!isEditing" class="profile-info">
        <div class="info-item">
          <span class="info-label">📧 Email</span>
          <span class="info-value">{{ user?.email }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📱 Phone</span>
          <span class="info-value">{{ user?.phone || 'Not provided' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📅 Member since</span>
          <span class="info-value">{{ user?.createdAt ? formatDate(user.createdAt) : 'N/A' }}</span>
        </div>

        <button class="btn btn-edit" @click="startEditing">
          ✏️ Edit Profile
        </button>
      </div>

      <div v-else class="edit-form">
        <div v-if="editError" class="error-message">{{ editError }}</div>
        <div v-if="editSuccess" class="success-message">{{ editSuccess }}</div>

        <div class="form-group">
          <label for="editName">Name</label>
          <input
            id="editName"
            v-model="editForm.name"
            type="text"
            placeholder="Your name"
            :disabled="editLoading"
          />
        </div>

        <div class="form-group">
          <label for="editPhone">Phone</label>
          <input
            id="editPhone"
            v-model="editForm.phone"
            type="tel"
            placeholder="Your phone number"
            :disabled="editLoading"
          />
        </div>

        <div class="edit-actions">
          <button class="btn btn-cancel" @click="cancelEditing" :disabled="editLoading">
            Cancel
          </button>
          <button class="btn btn-save" @click="saveProfile" :disabled="editLoading">
            <span v-if="editLoading" class="loader"></span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>

      <button class="btn btn-logout" @click="handleLogout">
        🚪 Logout
      </button>
    </div>

    <div v-if="isSeller" class="listings-section">
      <h2>🐄 My Listings</h2>

      <div v-if="listingsLoading" class="listings-loading">
        <div class="loader-large"></div>
        <p>Loading your listings...</p>
      </div>

      <div v-else-if="myListings.length === 0" class="no-listings">
        <p>You haven't listed any cows yet.</p>
        <router-link to="/add-listing" class="btn btn-add">
          ➕ Add Your First Listing
        </router-link>
      </div>

      <div v-else class="listings-grid">
        <div v-for="cow in myListings" :key="cow._id" class="listing-card">
          <div class="listing-image">
            <img
              :src="cow.images?.[0] || 'https://via.placeholder.com/200x150?text=No+Image'"
              :alt="cow.name"
            />
            <span :class="['status-badge', cow.status]">{{ cow.status }}</span>
          </div>
          <div class="listing-info">
            <h3>{{ cow.name }}</h3>
            <p class="breed">{{ cow.breed }}</p>
            <p class="price">€{{ cow.price?.toLocaleString() }}</p>
          </div>
          <router-link :to="`/listing/${cow._id}`" class="listing-link">
            View Details →
          </router-link>
        </div>
      </div>

      <router-link to="/add-listing" class="btn btn-add-more">
        ➕ Add New Listing
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
}

.profile-title h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.6rem;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.role-badge.seller {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(139, 195, 74, 0.15));
  color: #388E3C;
}

.role-badge.buyer {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  color: #667eea;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.btn {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  margin-top: 20px;
  width: 100%;
}

.btn-edit:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-logout {
  background: #ffebee;
  color: #c62828;
  margin-top: 16px;
  width: 100%;
}

.btn-logout:hover {
  background: #ffcdd2;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.form-group input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  flex: 1;
  background: #f5f5f5;
  color: #666;
}

.btn-save {
  flex: 1;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  min-height: 48px;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loader-large {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.listings-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.listings-section h2 {
  margin: 0 0 24px 0;
  color: #333;
}

.listings-loading, .no-listings {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.listing-card {
  background: #f9f9f9;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.listing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.listing-image {
  position: relative;
  height: 140px;
}

.listing-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.available {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.sold {
  background: #ffebee;
  color: #c62828;
}

.listing-info {
  padding: 16px;
}

.listing-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #333;
}

.listing-info .breed {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.listing-info .price {
  margin: 0;
  font-weight: 700;
  color: #4CAF50;
  font-size: 1.1rem;
}

.listing-link {
  display: block;
  padding: 12px 16px;
  background: #f0f0f0;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: background 0.2s;
}

.listing-link:hover {
  background: #e8e8e8;
}

.btn-add, .btn-add-more {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  text-decoration: none;
  display: inline-flex;
}

.btn-add-more {
  width: 100%;
}
</style>

