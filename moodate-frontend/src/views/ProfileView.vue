<script setup>
import { ref } from 'vue'

// Dummy data βασισμένα στα πεδία του Register
const profile = ref({
  firstName: 'Clint',
  lastName: 'Eastwood',
  username: 'blondie',
  email: 'clint@spaghetti.com',
  phone: '555-1885',
  role: 'buyer',
  city: 'Tombstone',
  state: 'AZ',
  zip: '85638'
})

// State για το αν η φόρμα είναι σε λειτουργία επεξεργασίας
const isEditing = ref(false)

const toggleEdit = () => {
  if (isEditing.value) {
    // Εδώ στο μέλλον θα κάνουμε το PUT/PATCH request στο Java backend
    console.log('Updating profile payload:', profile.value)
  }
  isEditing.value = !isEditing.value
}
</script>

<template>
  <main class="flex-1 p-6 flex justify-center items-start">
    <div class="bg-[#fdfcf0] border-8 border-double border-[#451a03] shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] w-full max-w-4xl p-8 relative">
      
      <div class="absolute top-4 right-4 bg-[#451a03] text-[#fef3c7] px-4 py-2 border-2 border-[#d97706] font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
        Status: Active
      </div>

      <div class="flex items-end gap-6 border-b-4 border-[#451a03] pb-6 mb-8">
        <div class="w-32 h-32 bg-[#d97706] border-4 border-[#451a03] shadow-[6px_6px_0px_0px_rgba(69,26,3,1)] flex items-center justify-center overflow-hidden">
          <span class="text-6xl">🤠</span>
        </div>
        <div>
          <h1 class="text-5xl font-black text-[#451a03] uppercase italic tracking-tighter">
            Rancher ID
          </h1>
          <p class="text-[#d97706] font-bold text-xl uppercase tracking-widest mt-1">
            Official Records
          </p>
        </div>
      </div>

      <form @submit.prevent="toggleEdit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div v-for="(label, key) in { 
            firstName: 'First Name', 
            lastName: 'Last Name', 
            username: 'Alias', 
            email: 'Email Address',
            phone: 'Telegraph (Phone)',
            role: 'Ranch Role'
          }" :key="key">
            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">{{ label }}</label>
            
            <select 
              v-if="key === 'role'"
              v-model="profile[key]" 
              :disabled="!isEditing"
              class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 rounded-none outline-none font-bold text-[#451a03] uppercase transition-all disabled:opacity-70 disabled:bg-[#fdfcf0] disabled:border-dashed appearance-none"
              :class="isEditing ? 'shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none bg-white cursor-pointer' : ''"
            >
              <option value="buyer">BUYER (Looking for cattle)</option>
              <option value="seller">SELLER (Selling cattle)</option>
              <option value="both">BOTH (Trading & Buying)</option>
            </select>

            <input 
              v-else
              v-model="profile[key]" 
              :disabled="!isEditing"
              type="text"
              class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 rounded-none outline-none font-bold text-[#451a03] transition-all disabled:opacity-70 disabled:bg-[#fdfcf0] disabled:border-dashed"
              :class="isEditing ? 'shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none bg-white' : ''"
            >
          </div>

          <div class="md:col-span-2 grid grid-cols-3 gap-4 border-t-4 border-[#451a03]/20 pt-6">
            <div class="col-span-1">
              <label class="block text-[#451a03] font-black uppercase text-xs mb-1">City</label>
              <input v-model="profile.city" :disabled="!isEditing" type="text" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-2 rounded-none outline-none font-bold disabled:opacity-70 disabled:bg-[#fdfcf0] disabled:border-dashed" :class="isEditing ? 'shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]' : ''">
            </div>
            <div>
              <label class="block text-[#451a03] font-black uppercase text-xs mb-1">State</label>
              <input v-model="profile.state" :disabled="!isEditing" type="text" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-2 rounded-none outline-none font-bold disabled:opacity-70 disabled:bg-[#fdfcf0] disabled:border-dashed" :class="isEditing ? 'shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]' : ''">
            </div>
            <div>
              <label class="block text-[#451a03] font-black uppercase text-xs mb-1">ZIP</label>
              <input v-model="profile.zip" :disabled="!isEditing" type="text" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-2 rounded-none outline-none font-bold disabled:opacity-70 disabled:bg-[#fdfcf0] disabled:border-dashed" :class="isEditing ? 'shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]' : ''">
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t-4 border-[#451a03] flex justify-end">
          <button 
            type="submit" 
            class="px-8 py-4 font-black text-xl uppercase tracking-tighter transition border-4 border-[#451a03] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            :class="isEditing ? 'bg-[#2f855a] text-[#fdfcf0] hover:bg-green-800' : 'bg-[#d97706] text-[#fdfcf0] hover:bg-orange-600'"
          >
            {{ isEditing ? 'Save Changes ✔️' : 'Edit Identity ✏️' }}
          </button>
        </div>
      </form>

    </div>
  </main>
</template>