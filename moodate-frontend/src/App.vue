<script setup>
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-white px-8 py-4 flex justify-between items-center shadow-sm relative z-50">
      <div class="text-2xl font-bold text-green-600">🐄 MooDate</div>
      <div class="space-x-6 font-semibold text-gray-600">
        <router-link to="/" class="hover:text-green-500">Home</router-link>
        <router-link to="/listings" class="hover:text-green-500">Listings</router-link>
        <router-link to="/login" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Login</router-link>
      </div>
    </nav>

    <router-view />
  </div>
</template>