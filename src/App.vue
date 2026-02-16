<script setup>
import { ref, computed } from 'vue'
import CowCard from './components/CowCard.vue'

const cows = ref([
  {
    id: 1,
    name: 'Bella',
    breed: 'Holstein Friesian',
    age: 3,
    price: 2500,
    weight: 650,
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400',
    location: 'Thessaloniki Farm',
    description: 'Excellent milk producer, gentle temperament'
  },
  {
    id: 2,
    name: 'Daisy',
    breed: 'Jersey',
    age: 4,
    price: 2200,
    weight: 450,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400',
    location: 'Athens Countryside',
    description: 'High butterfat milk, very friendly'
  },
  {
    id: 3,
    name: 'Zeus',
    breed: 'Angus',
    age: 2,
    price: 3500,
    weight: 800,
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400',
    location: 'Larissa Ranch',
    description: 'Premium beef cattle, excellent genetics'
  },
  {
    id: 4,
    name: 'Olympia',
    breed: 'Brown Swiss',
    age: 5,
    price: 2800,
    weight: 700,
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
    location: 'Patras Valley',
    description: 'Dual-purpose cow, calm nature'
  }
])

const currentIndex = ref(0)
const likedCows = ref([])
const swipeDirection = ref(null)

const currentCow = computed(() => cows.value[currentIndex.value])
const hasMoreCows = computed(() => currentIndex.value < cows.value.length)

const swipe = (direction) => {
  swipeDirection.value = direction

  if (direction === 'right') {
    likedCows.value.push(currentCow.value)
  }

  setTimeout(() => {
    currentIndex.value++
    swipeDirection.value = null
  }, 300)
}

const resetCards = () => {
  currentIndex.value = 0
  likedCows.value = []
}
</script>

<template>
  <div class="moodate">
    <header class="header">
      <h1>🐄 MooDate</h1>
      <p>Find your perfect cow</p>
    </header>

    <div v-if="hasMoreCows" class="card-container">
      <CowCard
        :cow="currentCow"
        :class="{
          'swipe-left': swipeDirection === 'left',
          'swipe-right': swipeDirection === 'right'
        }"
      />

      <div class="actions">
        <button class="btn btn-pass" @click="swipe('left')">
          ✕ Pass
        </button>
        <button class="btn btn-like" @click="swipe('right')">
          ♥ Like
        </button>
      </div>
    </div>

    <div v-else class="no-more">
      <h2>🎉 That's all folks!</h2>
      <p>You liked {{ likedCows.length }} cow(s)</p>

      <div v-if="likedCows.length > 0" class="liked-list">
        <h3>Your matches:</h3>
        <div v-for="cow in likedCows" :key="cow.id" class="liked-item">
          {{ cow.name }} - €{{ cow.price.toLocaleString() }}
        </div>
      </div>

      <button class="btn btn-reset" @click="resetCards">
        Start Over
      </button>
    </div>
  </div>
</template>

<style scoped>
.moodate {
  text-align: center;
}

.header {
  margin-bottom: 20px;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.card-container {
  position: relative;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-pass {
  background: white;
  color: #f44336;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
}

.btn-like {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.btn-reset {
  background: white;
  color: #667eea;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.no-more {
  background: white;
  padding: 40px;
  border-radius: 20px;
  color: #333;
  box-shadow: var(--card-shadow);
}

.no-more h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.liked-list {
  margin-top: 20px;
  text-align: left;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
}

.liked-list h3 {
  margin-bottom: 10px;
  color: #4CAF50;
}

.liked-item {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.liked-item:last-child {
  border-bottom: none;
}

/* Swipe animations */
.swipe-left {
  animation: swipeLeft 0.3s forwards;
}

.swipe-right {
  animation: swipeRight 0.3s forwards;
}

@keyframes swipeLeft {
  to {
    transform: translateX(-150%) rotate(-20deg);
    opacity: 0;
  }
}

@keyframes swipeRight {
  to {
    transform: translateX(150%) rotate(20deg);
    opacity: 0;
  }
}
</style>
