<script setup>
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-[#451a03] border-b-4 border-[#d97706] px-8 py-4 flex justify-between items-center shadow-2xl relative z-50">
      <div class="text-3xl font-black text-[#d97706] tracking-tighter uppercase italic">
        🤠 MooDate
      </div>
      <div class="space-x-8 font-bold text-[#fef3c7] uppercase text-sm tracking-widest">
        <router-link to="/" class="hover:text-orange-400 transition underline decoration-2">Home</router-link>
        <router-link to="/listings" class="hover:text-orange-400 transition underline decoration-2">Listings</router-link>
        <router-link to="/login" class="bg-[#d97706] text-[#451a03] px-6 py-2 rounded-none border-2 border-[#451a03] hover:bg-orange-500 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Login
        </router-link>
      </div>
    </nav>

    <router-view />
  </div>
</template>