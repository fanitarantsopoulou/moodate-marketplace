<script setup>
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-[#451a03] border-b-4 border-[#d97706] px-8 py-4 flex justify-between items-center shadow-2xl relative z-50">
      <router-link to="/" class="text-3xl font-black text-[#d97706] tracking-tighter uppercase italic hover:scale-105 transition-transform cursor-pointer">
        🤠 MooDate
      </router-link>
      <div class="space-x-8 font-bold text-[#fef3c7] uppercase text-sm tracking-widest">
        <router-link to="/swipe" class="hover:text-orange-400 transition underline decoration-2">Home</router-link>
        <router-link to="/listings" class="hover:text-orange-400 transition underline decoration-2">Listings</router-link>
        <router-link to="/messages" class="hover:text-orange-400 transition underline decoration-2">Messages</router-link>
        <router-link to="/profile" class="hover:text-orange-400 transition underline decoration-2">Profile</router-link>
        <router-link to="/login" class="bg-[#d97706] text-[#451a03] px-6 py-2 rounded-none border-2 border-[#451a03] hover:bg-orange-500 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Login
        </router-link>
      </div>
    </nav>

    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* Η μαγεία του animation είναι πλέον έξω από το template */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(15px);
  opacity: 0;
}
</style>