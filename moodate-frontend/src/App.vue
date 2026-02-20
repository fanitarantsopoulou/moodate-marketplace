<script setup>
import { ref, computed } from 'vue'
import CowCard from './components/CowCard.vue'

// Database of cows
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

// State Management
const currentIndex = ref(0)
const swipeDirection = ref('') // Will be 'swipe-right' or 'swipe-left'

const currentCow = computed(() => cows[currentIndex.value])

// Handler for the emit events from CowCard
const handleSwipe = (action) => {
  // 1. Set the animation direction based on the action
  swipeDirection.value = action === 'like' ? 'swipe-right' : 'swipe-left'
  
  // 2. Increment index to trigger the Vue Transition
  currentIndex.value++
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

    <main class="flex-1 flex justify-center items-center p-4 overflow-hidden">
      
      <Transition :name="swipeDirection" mode="out-in">
        
        <CowCard 
          v-if="currentCow" 
          :key="currentCow.name"
          :cow="currentCow" 
          @pass="handleSwipe('pass')" 
          @like="handleSwipe('like')" 
        />
        
        <div v-else key="empty-state" class="text-center bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-xl">
          <h2 class="text-4xl font-bold text-white mb-4">No more cows! 🌾</h2>
          <p class="text-xl text-white/80">Try expanding your search radius to find more matches.</p>
        </div>

      </Transition>

    </main>
  </div>
</template>

<style>
/* VUE TRANSITION CSS 
  We define the enter/leave states for both right (Like) and left (Pass) directions.
*/

/* --- SWIPE RIGHT (LIKE) --- */
.swipe-right-leave-active,
.swipe-right-enter-active {
  transition: all 0.4s cubic-bezier(0.5, 0, 0.2, 1);
}

/* Card flies out to the right, rotating slightly */
.swipe-right-leave-to {
  opacity: 0;
  transform: translateX(100vw) rotate(15deg);
}

/* New card scales up from the background */
.swipe-right-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

/* --- SWIPE LEFT (PASS) --- */
.swipe-left-leave-active,
.swipe-left-enter-active {
  transition: all 0.4s cubic-bezier(0.5, 0, 0.2, 1);
}

/* Card flies out to the left, rotating slightly */
.swipe-left-leave-to {
  opacity: 0;
  transform: translateX(-100vw) rotate(-15deg);
}

/* New card scales up from the background */
.swipe-left-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
</style>