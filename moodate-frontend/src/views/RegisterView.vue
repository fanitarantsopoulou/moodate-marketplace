<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Ομαδοποιούμε το state της φόρμας σε ένα object
const form = ref({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    city: '',
    state: '',
    zip: ''
})

const handleRegister = () => {
    // Εδώ θα μπει το POST request στο Java backend (/api/auth/register)
    console.log('New user payload:', form.value)

    // Μετά την εγγραφή, τον στέλνουμε στο login
    router.push('/login')
}
</script>

<template>
    <main class="flex-1 flex justify-center items-center p-6">
        <div
            class="bg-[#fdfcf0] border-8 border-double border-[#451a03] p-10 shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] w-full max-w-2xl">

            <div class="text-center mb-10 border-b-4 border-[#451a03] pb-6">
                <h1 class="text-5xl font-black text-[#451a03] uppercase tracking-tighter italic">
                    Join the Herd
                </h1>
                <p class="text-[#d97706] font-bold text-xl uppercase tracking-widest mt-2">
                    Official Cattlemen Enrollment
                </p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div v-for="(label, key) in {
                        firstName: 'First Name',
                        lastName: 'Last Name',
                        username: 'Alias (Username)',
                        email: 'Email Address',
                        phone: 'Phone Number',
                        password: 'Secret Passcode'
                    }" :key="key" :class="key === 'password' ? 'md:col-span-1' : ''">
                        <label class="block text-[#451a03] font-black uppercase text-xs mb-1">{{ label }}</label>
                        <input v-model="form[key]"
                            :type="key === 'password' ? 'password' : (key === 'email' ? 'email' : 'text')"
                            class="w-full bg-[#fef3c7] border-2 border-[#451a03] px-4 py-3 rounded-none focus:bg-white outline-none font-bold text-[#451a03] placeholder-[#451a03]/30 shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] transition"
                            required>
                    </div>
                    <div class="md:col-span-2 border-t-2 border-[#451a03]/20 pt-4">
                        <label class="block text-[#451a03] font-black uppercase text-xs mb-2 ml-1">What's your business
                            at the ranch?</label>
                        <div class="grid grid-cols-3 gap-4">
                            <label v-for="role in ['buyer', 'seller', 'both']" :key="role"
                                class="cursor-pointer border-4 border-[#451a03] p-3 text-center uppercase font-black text-sm transition-all"
                                :class="form.role === role ? 'bg-[#d97706] text-[#fdfcf0] shadow-none translate-y-1' : 'bg-[#fef3c7] text-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] hover:bg-[#fcf5d8]'">
                                <input type="radio" v-model="form.role" :value="role" class="hidden">
                                {{ role === 'both' ? 'Both' : role }}
                            </label>
                        </div>
                    </div>

                    <div class="md:col-span-2 grid grid-cols-3 gap-4 border-t-2 border-[#451a03]/20 pt-6">
                        <div class="col-span-1">
                            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">City</label>
                            <input v-model="form.city" type="text"
                                class="w-full bg-[#fef3c7] border-2 border-[#451a03] px-4 py-2 rounded-none outline-none font-bold shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]"
                                required>
                        </div>
                        <div>
                            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">State</label>
                            <input v-model="form.state" type="text"
                                class="w-full bg-[#fef3c7] border-2 border-[#451a03] px-4 py-2 rounded-none outline-none font-bold shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]"
                                required>
                        </div>
                        <div>
                            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">ZIP</label>
                            <input v-model="form.zip" type="text"
                                class="w-full bg-[#fef3c7] border-2 border-[#451a03] px-4 py-2 rounded-none outline-none font-bold shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]"
                                required>
                        </div>
                    </div>
                </div>

                <button type="submit"
                    class="w-full mt-10 bg-[#d97706] text-[#fdfcf0] border-4 border-[#451a03] py-4 rounded-none font-black text-2xl uppercase italic tracking-tighter hover:bg-orange-600 transition shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                    Join the Herd
                </button>
            </form>

            <div class="mt-8 text-center">
                <p class="text-[#451a03] font-bold uppercase text-sm">
                    Already one of us?
                    <router-link to="/login" class="text-[#963030] underline decoration-4 hover:text-red-700">Get to
                        Login</router-link>
                </p>
            </div>

        </div>
    </main>
</template>