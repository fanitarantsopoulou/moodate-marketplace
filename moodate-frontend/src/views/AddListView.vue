<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  breed: 'Holstein',
  age: '',
  price: '',
  weight: '',
  location: '',
  description: '',
  images: []
})

const imageError = ref('')

const handleImageUpload = (event) => {
  // Μετατρέπουμε το FileList του browser σε κανονικό JavaScript Array
  const files = Array.from(event.target.files)
  
  // Κάνουμε reset τυχόν παλιά errors
  imageError.value = '' 
  
  // Αν πάτησε "Cancel" στο παράθυρο επιλογής
  if (files.length === 0) {
    form.value.images = []
    return
  }

  // Το Validation Rule για το Max 10
  if (files.length > 10) {
    imageError.value = 'Whoa there! Maximum 10 photos allowed per beast.'
    form.value.images = [] 
    event.target.value = '' // Κάνουμε reset το HTML input για να μην κρατήσει τα αρχεία
    return
  }

  // Αν περάσει το validation, σώζουμε τα αρχεία στο state
  form.value.images = files
  console.log(`Loaded ${files.length} beast photo(s) ready for backend.`)
}

const submitListing = () => {
  console.log('Publishing new cattle:', form.value)
  // Εδώ μελλοντικά θα στέλνουμε το POST request στο Java Backend
  router.push('/listings')
}
</script>

<template>
  <main class="flex-1 p-6 flex justify-center items-start">
    <div class="bg-[#fdfcf0] border-8 border-double border-[#451a03] shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] w-full max-w-3xl p-8 relative">
      
      <div class="text-center border-b-4 border-[#451a03] pb-6 mb-8">
        <h1 class="text-5xl font-black text-[#963030] uppercase italic tracking-tighter">
          Register Beast
        </h1>
        <p class="text-[#451a03] font-bold text-lg uppercase tracking-widest mt-2">
          Add new cattle to the market
        </p>
      </div>

      <form @submit.prevent="submitListing" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Cow Name</label>
            <input v-model="form.name" type="text" required class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all">
          </div>

          <div>
            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Breed</label>
            <select v-model="form.breed" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] uppercase shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all cursor-pointer">
              <option value="Holstein">Holstein Friesian</option>
              <option value="Angus">Angus</option>
              <option value="Brown Swiss">Brown Swiss</option>
              <option value="Hereford">Hereford</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Age (Yrs)</label>
              <input v-model="form.age" type="number" required min="1" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all">
            </div>
            <div>
              <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Weight (lbs)</label>
              <input v-model="form.weight" type="number" required min="100" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all">
            </div>
          </div>

          <div>
            <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Asking Price ($)</label>
            <input v-model="form.price" type="number" required min="1" class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all">
          </div>
        </div>

        <div>
          <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Description</label>
          <textarea v-model="form.description" rows="3" required placeholder="Good milker, hates loud noises..." class="w-full bg-[#fef3c7] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all resize-none"></textarea>
        </div>

        <div>
          <label class="block text-[#451a03] font-black uppercase text-xs mb-1">Photographs (1 to 10 max)</label>
          <input 
            type="file" 
            accept="image/*"
            multiple
            @change="handleImageUpload"
            required
            class="w-full bg-[#fdfcf0] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] border-dashed focus:border-solid transition-all file:mr-4 file:py-2 file:px-4 file:border-4 file:border-[#451a03] file:text-sm file:font-black file:uppercase file:bg-[#d97706] file:text-[#fdfcf0] hover:file:bg-orange-600 file:cursor-pointer file:transition cursor-pointer"
          >
          
          <p v-if="imageError" class="text-red-700 font-black text-sm mt-2 uppercase tracking-tight">
            ❌ {{ imageError }}
          </p>
          <p v-else-if="form.images.length > 0" class="text-green-700 font-black text-sm mt-2 uppercase tracking-tight">
            ✔️ {{ form.images.length }} photo(s) holstered and ready!
          </p>
        </div>

        <div class="mt-8 pt-6 border-t-4 border-[#451a03] flex justify-end gap-4">
          <button type="button" @click="router.push('/listings')" class="px-6 py-4 font-black text-lg uppercase transition border-4 border-[#451a03] bg-[#fdfcf0] text-[#451a03] hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] active:translate-y-1 active:shadow-none">
            Cancel
          </button>
          <button type="submit" class="px-8 py-4 font-black text-lg uppercase transition border-4 border-[#451a03] bg-[#2f855a] text-[#fdfcf0] hover:bg-green-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            Publish Listing 📝
          </button>
        </div>
      </form>

    </div>
  </main>
</template>