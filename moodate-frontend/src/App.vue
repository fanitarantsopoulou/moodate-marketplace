<script setup>
import { ref, computed } from 'vue'
import CowCard from './components/CowCard.vue'

// 1. Η "Βάση Δεδομένων" μας (Array με objects)
const cows = [
  {
    name: 'Bella',
    breed: 'Holstein Friesian',
    age: 3,
    price: 2500,
    weight: 650,
    location: 'Thessaloniki Farm',
    description: 'Excellent milk producer, gentle temperament. Perfect for starting your herd.',
    image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'Ermioni',
    breed: 'Brown Swiss',
    age: 4,
    price: 3200,
    weight: 700,
    location: 'Florina Highlands',
    description: 'Strong and resilient. Great cheese yield from her milk.',
    image: 'https://images.unsplash.com/photo-1596733430284-f743700020a5?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'Lola',
    breed: 'Angus',
    age: 2,
    price: 4100,
    weight: 850,
    location: 'Kozani Valley',
    description: 'Premium beef genetics. Very active and healthy.',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=1000&auto=format&fit=crop'
  }
]

// 2. State Management
const currentIndex = ref(0) // Ξεκινάμε από την αγελάδα στο index 0

// Το computed παρακολουθεί το currentIndex. Αν αλλάξει, φέρνει την επόμενη αγελάδα.
const currentCow = computed(() => cows[currentIndex.value])

// 3. Η συνάρτηση που τρέχει όταν κάνουμε swipe (είτε like, είτε pass)
const handleSwipe = (action) => {
  console.log(`You just swiped ${action} on ${currentCow.value.name}!`)
  currentIndex.value++ // Πάμε στο επόμενο index
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-white px-8 py-4 flex justify-between items-center shadow-sm relative z-50">
      <div class="text-2xl font-bold text-green-600">🐄 MooDate</div>
      <div class="space-x-6 font-semibold text-gray-600">
        <a href="#" class="hover:text-green-500">Home</a>
        <a href="#" class="hover:text-green-500">Listings</a>
        <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Login</button>
      </div>
    </nav>

    <main class="flex-1 flex justify-center items-center p-4">
      <CowCard 
        v-if="currentCow" 
        :cow="currentCow" 
        @pass="handleSwipe('pass')" 
        @like="handleSwipe('like')" 
      />
      
      <div v-else class="text-center bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-xl">
        <h2 class="text-4xl font-bold text-white mb-4">Τέλος οι αγελάδες! 🌾</h2>
        <p class="text-xl text-white/80">Δοκίμασε να αυξήσεις την ακτίνα αναζήτησης.</p>
      </div>
    </main>
  </div>
</template>