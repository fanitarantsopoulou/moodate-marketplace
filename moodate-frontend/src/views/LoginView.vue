<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Προς το παρόν δεν έχουμε backend, οπότε απλά τυπώνουμε τα στοιχεία στην κονσόλα.
  // Όταν με το καλό συνδέσουμε τη Java, εδώ θα μπει το HTTP POST request (πχ. axios.post)
  console.log('Login attempt with:', email.value, password.value)
  
  // Προσομοιώνουμε ένα επιτυχές login στέλνοντας τον χρήστη πίσω στην αρχική σελίδα
  router.push('/')
}
</script>

<template>
  <main class="flex-1 flex justify-center items-center p-4">
    <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p class="text-gray-500 mt-2">Log in to find the perfect match for your herd.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="email">Email</label>
          <input 
            v-model="email" 
            type="email" 
            id="email" 
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            placeholder="farmer@example.com"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2" for="password">Password</label>
          <input 
            v-model="password" 
            type="password" 
            id="password" 
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            placeholder="••••••••"
            required
          >
        </div>

        <button 
          type="submit" 
          class="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 hover:-translate-y-0.5 transition transform"
        >
          Log In
        </button>
      </form>

      <div class="mt-6 text-center text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-green-600 font-bold hover:underline">Register</router-link> 
      </div>

    </div>
  </main>
</template>