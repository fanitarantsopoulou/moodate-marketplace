<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'buyer',
  phone: ''
})

const loading = ref(false)
const error = ref('')

const validate = () => {
  if (!formData.value.name.trim()) {
    error.value = 'Name is required'
    return false
  }
  if (!formData.value.email.trim()) {
    error.value = 'Email is required'
    return false
  }
  if (!formData.value.password) {
    error.value = 'Password is required'
    return false
  }
  if (formData.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return false
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return false
  }
  return true
}

const handleSubmit = async () => {
  error.value = ''

  if (!validate()) return

  loading.value = true

  const userData = {
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    password: formData.value.password,
    role: formData.value.role,
    ...(formData.value.phone.trim() && { phone: formData.value.phone.trim() })
  }

  const result = await authStore.register(userData)

  loading.value = false

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="register-view">
    <div class="auth-card">
      <div class="auth-header">
        <h1>🐄 Join MooDate</h1>
        <p>Create your account to start trading</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="name">Full Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Enter your full name"
            :disabled="loading"
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
            autocomplete="email"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password">Password *</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Min 6 characters"
              :disabled="loading"
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm password"
              :disabled="loading"
              autocomplete="new-password"
            />
          </div>
        </div>

        <div class="form-group">
          <label>I want to</label>
          <div class="role-selector">
            <button
              type="button"
              :class="['role-btn', { active: formData.role === 'buyer' }]"
              @click="formData.role = 'buyer'"
              :disabled="loading"
            >
              🛒 Buy Cows
            </button>
            <button
              type="button"
              :class="['role-btn', { active: formData.role === 'seller' }]"
              @click="formData.role = 'seller'"
              :disabled="loading"
            >
              🏷️ Sell Cows
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number (optional)</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="Enter your phone number"
            :disabled="loading"
            autocomplete="tel"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="loader"></span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role-btn {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.role-btn:hover:not(:disabled) {
  border-color: #4CAF50;
}

.role-btn.active {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
  color: #388E3C;
}

.role-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
}

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
  opacity: 0.7;
  cursor: not-allowed;
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

.auth-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.auth-footer p {
  color: #666;
}

.auth-footer a {
  color: #4CAF50;
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

