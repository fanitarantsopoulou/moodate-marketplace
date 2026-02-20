<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Ομαδοποιούμε το state της φόρμας σε ένα object
const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  city: '',
  state: '',
  zip: ''
})

const handleRegister = () => {
  // Εδώ θα μπει το POST request στο Java backend (/api/auth/register)
  console.log('New user payload:', form.value)
  
  // Μετά την εγγραφή, τον στέλνουμε στο login
  router.push('/login')
}
</script>

<template>
  <main class="flex-1 flex justify-center items-center p-6">
    <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Create an Account</h1>
        <p class="text-gray-500 mt-2">Join MooDate and start trading today.</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="block text-gray-700 font-medium mb-2">First Name</label>
            <input v-model="form.firstName" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
          </div>
          
          <div>
            <label class="block text-gray-700 font-medium mb-2">Last Name</label>
            <input v-model="form.lastName" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Username</label>
            <input v-model="form.username" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-700 font-medium mb-2">Password</label>
            <input v-model="form.password" type="password" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">City</label>
            <input v-model="form.city" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">State</label>
              <input v-model="form.state" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">ZIP</label>
              <input v-model="form.zip" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" required>
            </div>
          </div>

        </div>

        <button type="submit" class="w-full mt-8 bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 hover:-translate-y-0.5 transition transform">
          Sign Up
        </button>
      </form>

      <div class="mt-6 text-center text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-green-600 font-bold hover:underline">Log In</router-link>
      </div>

    </div>
  </main>
</template>