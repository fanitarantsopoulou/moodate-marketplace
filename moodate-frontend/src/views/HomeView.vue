<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CowCard from '../components/CowCard.vue'

const router = useRouter()

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

// Modal State
const showMatchModal = ref(false)
const matchedCow = ref(null)

const currentCow = computed(() => cows[currentIndex.value])

const handleSwipe = (action) => {
    // 1. Ορίζουμε το animation
    swipeDirection.value = action === 'like' ? 'swipe-right' : 'swipe-left'
    
    // 2. Αν είναι Like, σώζουμε την αγελάδα και ανοίγουμε το modal
    if (action === 'like') {
        matchedCow.value = currentCow.value
        showMatchModal.value = true
    }
    
    // 3. Προχωράμε στην επόμενη κάρτα
    currentIndex.value++
}

// Modal Actions
const goToChat = () => {
    router.push('/messages')
}

const keepSwiping = () => {
    showMatchModal.value = false
    swipeDirection.value = '' // Reset
}
</script>

<template>
    <main class="flex-1 flex justify-center items-center p-4 overflow-hidden relative">

        <Transition :name="swipeDirection" mode="out-in">
            <CowCard 
                v-if="currentCow" 
                :key="currentCow.name" 
                :cow="currentCow" 
                @pass="handleSwipe('pass')"
                @like="handleSwipe('like')" 
            />

            <div v-else key="empty-state" class="text-center bg-[#fdfcf0] border-8 border-double border-[#451a03] p-12 shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] max-w-lg z-10">
                <h2 class="text-5xl font-black text-[#963030] mb-6 uppercase tracking-tighter italic">
                    OUT OF CATTLE! 🌵
                </h2>
                <p class="text-2xl text-[#451a03] font-bold leading-tight mb-8">
                    THE DUST HAS SETTLED. NO MORE BEASTS LEFT IN THIS COUNTY, PARTNER.
                </p>
                <button @click="currentIndex = 0" class="bg-[#d97706] text-[#fdfcf0] border-4 border-[#451a03] px-8 py-3 font-black uppercase hover:bg-orange-600 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">
                    RELOAD THE TRAIL
                </button>
            </div>
        </Transition>

        <div v-if="showMatchModal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#451a03]/80 backdrop-blur-sm p-4">
            <div class="bg-[#fdfcf0] border-8 border-double border-[#d97706] p-8 max-w-md w-full shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] pop-in">
                <h2 class="text-6xl font-black text-[#963030] uppercase italic tracking-tighter text-center mb-2 animate-pulse">
                    Yee-Haw!
                </h2>
                <p class="text-xl text-[#451a03] font-bold text-center mb-6 uppercase">
                    It's a Match with {{ matchedCow.name }}!
                </p>

                <img :src="matchedCow.image" class="w-full h-56 object-cover border-4 border-[#451a03] mb-8 shadow-[8px_8px_0px_0px_rgba(69,26,3,1)] rotate-2" />

                <div class="flex flex-col gap-4">
                    <button @click="goToChat" class="w-full bg-[#2f855a] text-[#fdfcf0] border-4 border-[#451a03] py-4 font-black text-xl uppercase hover:bg-green-800 transition shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                        Send Telegram ✉️
                    </button>
                    <button @click="keepSwiping" class="w-full bg-[#fef3c7] text-[#451a03] border-4 border-[#451a03] py-4 font-black text-xl uppercase hover:bg-[#fcf5d8] transition shadow-[6px_6px_0px_0px_rgba(69,26,3,1)] active:translate-y-1 active:shadow-none">
                        Keep Scouting 🤠
                    </button>
                </div>
            </div>
        </div>

    </main>
</template>

<style>
/* --- Transitions for Swiping --- */
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

/* --- Modal Pop-in Animation --- */
@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}

.pop-in {
  animation: pop-in 0.3s ease-out forwards;
}
</style>