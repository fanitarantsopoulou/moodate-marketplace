<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Authenticating Cowboy:', email.value)
  // Προσομοίωση login
  router.push('/')
}
</script>

<template>
  <main class="flex-1 flex justify-center items-center p-6">
    <div class="bg-[#fdfcf0] border-8 border-double border-[#451a03] p-10 shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] w-full max-w-md relative">
      
      <div class="absolute -top-6 -right-6 bg-[#963030] text-[#fdfcf0] px-4 py-2 border-4 border-[#451a03] font-black uppercase -rotate-12 shadow-lg">
        Verified
      </div>

      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-[#451a03] uppercase tracking-tighter italic leading-none">
          Identification
        </h1>
        <p class="text-[#d97706] font-bold text-sm uppercase tracking-[0.2em] mt-3 border-t-2 border-[#d97706]/30 pt-2">
          Authorized Personnel Only
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-8">
        
        <div class="relative">
          <label class="block text-[#451a03] font-black uppercase text-xs mb-1 ml-1">Member Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="COWBOY@RANGE.COM"
            class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-4 rounded-none outline-none font-black text-[#451a03] placeholder-[#451a03]/20 shadow-[6px_6px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
            required
          >
        </div>

        <div class="relative">
          <label class="block text-[#451a03] font-black uppercase text-xs mb-1 ml-1">Secret Code</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-4 rounded-none outline-none font-black text-[#451a03] placeholder-[#451a03]/20 shadow-[6px_6px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
            required
          >
        </div>

        <button 
          type="submit" 
          class="w-full bg-[#2f855a] text-[#fdfcf0] border-4 border-[#451a03] py-5 rounded-none font-black text-2xl uppercase italic tracking-tighter hover:bg-green-800 transition shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none"
        >
          Enter the Saloon
        </button>
      </form>

      <div class="mt-10 pt-6 border-t-2 border-dashed border-[#451a03]/30 text-center">
        <p class="text-[#451a03] font-bold uppercase text-xs tracking-widest">
          New to the county? 
          <router-link to="/register" class="text-[#d97706] block mt-2 text-lg underline decoration-4 underline-offset-4 hover:text-orange-700">
            Sign the Enrollment
          </router-link>
        </p>
      </div>

    </div>
  </main>
</template>