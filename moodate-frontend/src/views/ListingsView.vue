<script setup>
import { ref } from 'vue'

// Dummy data for the ranch owner's cattle
const myCows = ref([
  { id: 1, name: 'Bella', breed: 'Holstein', status: 'Active', price: 2500 },
  { id: 2, name: 'Ermioni', breed: 'Brown Swiss', status: 'Pending', price: 3200 },
  { id: 3, name: 'Lola', breed: 'Angus', status: 'Sold', price: 4100 },
])

const deleteCow = (id) => {
  myCows.value = myCows.value.filter(cow => cow.id !== id)
}
</script>

<template>
  <main class="flex-1 p-8">
    <div class="max-w-5xl mx-auto bg-[#fdfcf0] border-8 border-double border-[#451a03] shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] overflow-hidden">
      
      <div class="bg-[#451a03] p-6 flex justify-between items-center">
        <h1 class="text-4xl font-black text-[#fef3c7] uppercase italic tracking-tighter">
          Ranch Inventory
        </h1>
        <button class="bg-[#d97706] text-[#451a03] px-6 py-2 border-2 border-[#fef3c7] font-black uppercase hover:bg-orange-500 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          + Add New Cattle
        </button>
      </div>

      <div class="p-6">
        <table class="w-full border-collapse border-4 border-[#451a03]">
          <thead class="bg-[#d97706]/20 text-[#451a03] uppercase font-black text-sm">
            <tr>
              <th class="border-4 border-[#451a03] p-4 text-left">Cow Name</th>
              <th class="border-4 border-[#451a03] p-4 text-left">Breed</th>
              <th class="border-4 border-[#451a03] p-4 text-left">Status</th>
              <th class="border-4 border-[#451a03] p-4 text-left">Price</th>
              <th class="border-4 border-[#451a03] p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[#451a03] font-bold">
            <tr v-for="cow in myCows" :key="cow.id" class="hover:bg-[#fef3c7] transition-colors">
              <td class="border-4 border-[#451a03] p-4 underline">{{ cow.name }}</td>
              <td class="border-4 border-[#451a03] p-4">{{ cow.breed }}</td>
              <td class="border-4 border-[#451a03] p-4">
                <span :class="{
                  'bg-green-700 text-white px-2 py-1': cow.status === 'Active',
                  'bg-orange-600 text-white px-2 py-1': cow.status === 'Pending',
                  'bg-red-800 text-white px-2 py-1': cow.status === 'Sold'
                }" class="uppercase text-xs font-black">
                  {{ cow.status }}
                </span>
              </td>
              <td class="border-4 border-[#451a03] p-4">€{{ cow.price }}</td>
              <td class="border-4 border-[#451a03] p-4 text-center space-x-2">
                <button class="text-blue-700 hover:text-blue-900 uppercase text-xs font-black">Edit</button>
                <button @click="deleteCow(cow.id)" class="text-red-700 hover:text-red-900 uppercase text-xs font-black">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="myCows.length === 0" class="py-12 text-center text-[#963030] font-black text-2xl uppercase">
          Your pasture is empty, cowboy!
        </div>
      </div>

      <div class="bg-[#fef3c7] p-4 border-t-4 border-[#451a03] text-right text-[#451a03] font-black text-sm italic">
        TOTAL HEAD COUNT: {{ myCows.length }}
      </div>
    </div>
  </main>
</template>