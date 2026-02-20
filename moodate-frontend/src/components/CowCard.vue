<script setup>
defineProps({
  cow: Object
})

defineEmits(['like', 'pass'])
</script>

<template>
  <div class="flex flex-row w-[900px] max-w-[95vw] h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
    
    <div class="flex-[1.2] relative">
      <img :src="cow.image" :alt="cow.name" class="w-full h-full object-cover" />
      <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-lg">
        €{{ cow.price.toLocaleString() }}
      </div>
    </div>

    <div class="flex-[0.8] p-8 flex flex-col justify-between bg-white">
      <div>
        <h2 class="text-4xl font-extrabold text-gray-800">{{ cow.name }}</h2>
        <p class="text-green-600 font-bold text-xl mt-1 mb-6">{{ cow.breed }}</p>
        
        <div class="bg-gray-50 p-4 rounded-xl flex gap-6 mb-6">
          <span class="text-gray-600 font-medium">⚖️ {{ cow.weight }} kg</span>
          <span class="text-gray-600 font-medium">📍 {{ cow.location }}</span>
          <span class="text-gray-600 font-medium">🎂 {{ cow.age }} yrs</span>
        </div>

        <p class="text-gray-600 text-lg leading-relaxed">
          {{ cow.description }}
        </p>
      </div>

      <div class="flex gap-4 mt-6">
        <button @click="$emit('pass')" class="flex-1 py-4 border-2 border-red-500 text-red-500 rounded-xl font-bold text-xl hover:bg-red-50 transition">
          ✕ Pass
        </button>
        <button @click="$emit('like')" class="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-green-600 hover:-translate-y-1 transition transform">
          ♥ Like
        </button>
      </div>
    </div>

  </div>
</template>