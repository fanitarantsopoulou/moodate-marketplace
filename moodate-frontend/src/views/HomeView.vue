<script setup>
import { ref, computed } from 'vue'
import CowCard from '../components/CowCard.vue'

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

const currentIndex = ref(0)
const swipeDirection = ref('')

const currentCow = computed(() => cows[currentIndex.value])

const handleSwipe = (action) => {
  swipeDirection.value = action === 'like' ? 'swipe-right' : 'swipe-left'
  currentIndex.value++
}
</script>

<template>
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
</template>

<style>
/* ... (Κράτα τα CSS styles του Transition που είχες, ακριβώς τα ίδια) ... */
.swipe-right-leave-active,
.swipe-right-enter-active {
  transition: all 0.4s cubic-bezier(0.5, 0, 0.2, 1);
}
.swipe-right-leave-to {
  opacity: 0;
  transform: translateX(100vw) rotate(15deg);
}
.swipe-right-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.swipe-left-leave-active,
.swipe-left-enter-active {
  transition: all 0.4s cubic-bezier(0.5, 0, 0.2, 1);
}
.swipe-left-leave-to {
  opacity: 0;
  transform: translateX(-100vw) rotate(-15deg);
}
.swipe-left-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
</style>