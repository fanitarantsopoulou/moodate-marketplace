<script setup>
defineProps({
    cow: Object
})

defineEmits(['like', 'pass'])
</script>

<template>
    <div
        class="flex flex-row w-[900px] max-w-[95vw] h-[550px] bg-[#fdfcf0] border-4 border-[#451a03] shadow-[12px_12px_0px_0px_rgba(69,26,3,1)] overflow-hidden relative z-10">
        <div class="flex-[1.2] relative">
            <img :src="cow.image" :alt="cow.name" class="w-full h-full object-cover" />
            <div
                class="absolute top-4 left-4 bg-[#d97706] border-2 border-[#451a03] text-[#451a03] px-4 py-1 rounded-none font-black text-2xl -rotate-3 shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]">
                €{{ cow.price.toLocaleString() }}
            </div>
        </div>

        <div class="flex-1 p-6 flex flex-col justify-between">
            <div>
                <h2 class="text-4xl font-extrabold text-gray-800">{{ cow.name }}</h2>
                <p class="text-[#451a03] font-bold text-xl uppercase mt-1 mb-6">{{ cow.breed }}</p>

                <div class="bg-[#fef3c7] border-2 border-dashed border-[#451a03] p-4 rounded-none flex justify-between mb-6 shadow-[inset_4px_4px_0px_0px_rgba(217,119,6,0.2)]">
    <div class="flex flex-col items-center">
        <span class="text-xs uppercase font-black text-[#d97706]">Weight</span>
        <span class="text-[#451a03] font-black italic text-lg">{{ cow.weight }} KG</span>
    </div>
    <div class="flex flex-col items-center border-x-2 border-[#451a03]/20 px-4">
        <span class="text-xs uppercase font-black text-[#d97706]">Location</span>
        <span class="text-[#451a03] font-black italic text-lg">{{ cow.location }}</span>
    </div>
    <div class="flex flex-col items-center">
        <span class="text-xs uppercase font-black text-[#d97706]">Age</span>
        <span class="text-[#451a03] font-black italic text-lg">{{ cow.age }} YRS</span>
    </div>
</div>

                <p class="text-gray-600 text-lg font-bold leading-relaxed">
                    {{ cow.description }}
                </p>
            </div>
            <div class="flex gap-4 mt-6">
                <button @click="$emit('pass')"
                    class="flex-1 py-4 bg-[#963030] text-[#fdfcf0] border-4 border-[#451a03] rounded-none font-black text-2xl uppercase tracking-tighter hover:bg-red-800 transition active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]">
                    ✕ Pass
                </button>
                <button @click="$emit('like')"
                    class="flex-1 py-4 bg-[#2f855a] text-[#fdfcf0] border-4 border-[#451a03] rounded-none font-black text-2xl uppercase tracking-tighter hover:bg-green-800 transition active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]">
                    ♥ Like
                </button>
            </div>

        </div>

    </div>
</template>