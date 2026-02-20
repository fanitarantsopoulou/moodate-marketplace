<script setup>
// Landing page - δεν χρειάζεται state logic ακόμα.
</script>

<template>
  <main class="flex-1 flex flex-col items-center justify-center p-6 text-center">
    
    <div class="bg-[#fdfcf0] border-8 border-double border-[#451a03] p-12 md:p-20 shadow-[24px_24px_0px_0px_rgba(69,26,3,1)] max-w-4xl w-full relative">
      
      <div class="absolute -top-8 -left-8 bg-[#963030] text-[#fdfcf0] px-6 py-2 border-4 border-[#451a03] font-black text-xl uppercase -rotate-6 shadow-[8px_8px_0px_0px_rgba(69,26,3,1)]">
        Est. 2026
      </div>

      <h1 class="text-6xl md:text-8xl font-black text-[#d97706] uppercase italic tracking-tighter mb-6 drop-shadow-[6px_6px_0px_rgba(69,26,3,1)]">
        MooDate
      </h1>
      
      <p class="text-2xl md:text-3xl text-[#451a03] font-bold uppercase tracking-widest border-y-4 border-[#451a03] py-4 mb-12">
        The Premier Cattle Matchmaking & Trading Post
      </p>

      <p class="text-lg text-gray-700 font-bold max-w-2xl mx-auto mb-12 italic">
        Whether you're looking for the finest milker in the county or premium beef genetics, hitch your horse and step inside. 
      </p>

      <div class="flex flex-col md:flex-row gap-8 justify-center">
        <router-link to="/login" class="flex-1 bg-[#2f855a] text-[#fdfcf0] border-4 border-[#451a03] py-5 font-black text-2xl uppercase hover:bg-green-800 transition shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none">
          Enter Saloon (Login)
        </router-link>
        
        <router-link to="/register" class="flex-1 bg-[#d97706] text-[#fdfcf0] border-4 border-[#451a03] py-5 font-black text-2xl uppercase hover:bg-orange-600 transition shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none">
          Join the Herd (Register)
        </router-link>
      </div>

    </div>
  </main>
</template>