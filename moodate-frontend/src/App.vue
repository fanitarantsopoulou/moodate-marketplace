<script setup>
import CowCard from './components/CowCard.vue'

const dummyCow = {
  name: 'Bella',
  breed: 'Holstein Friesian',
  age: 3,
  price: 2500,
  weight: 650,
  location: 'Thessaloniki Farm',
  description: 'Excellent milk producer, gentle temperament. Perfect for starting your herd.',
  image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?q=80&w=1000&auto=format&fit=crop'
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-white px-8 py-4 flex justify-between items-center shadow-sm">
      <div class="text-2xl font-bold text-green-600">🐄 MooDate</div>
      <div class="space-x-6 font-semibold text-gray-600">
        <a href="#" class="hover:text-green-500">Home</a>
        <a href="#" class="hover:text-green-500">Listings</a>
        <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Login</button>
      </div>
    </nav>

    <main class="flex-1 flex justify-center items-center p-4">
      <CowCard :cow="dummyCow" />
    </main>
  </div>
</template>