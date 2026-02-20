<script setup>
import { ref } from 'vue'

// Dummy data για τις επαφές (Matches)
const contacts = ref([
  { id: 1, name: 'John "The Kid" Wayne', cow: 'Bella', lastMessage: 'Is she good for milking?' },
  { id: 2, name: 'Clint Eastwood', cow: 'Lola', lastMessage: 'I have 4000 cash right now.' },
  { id: 3, name: 'Annie Oakley', cow: 'Ermioni', lastMessage: 'Send more pictures of the hooves.' }
])

const activeContact = ref(contacts.value[0])
const newMessage = ref('')

// Dummy data για το ιστορικό του chat
const messages = ref([
  { id: 1, senderId: 1, text: 'Howdy! Saw your listing for Bella.' },
  { id: 2, senderId: 'me', text: 'Morning! Yes, she is still available. Great milker.' },
  { id: 3, senderId: 1, text: 'Is she good for milking?' }
])

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    senderId: 'me',
    text: newMessage.value
  })
  newMessage.value = ''
}
</script>

<template>
  <main class="flex-1 p-6 flex justify-center items-start">
    <div class="bg-[#fdfcf0] border-8 border-double border-[#451a03] shadow-[16px_16px_0px_0px_rgba(69,26,3,1)] w-full max-w-6xl flex flex-col md:flex-row h-[700px] overflow-hidden">
      
      <div class="w-full md:w-1/3 bg-[#fef3c7] border-b-4 md:border-b-0 md:border-r-4 border-[#451a03] flex flex-col">
        <div class="bg-[#451a03] text-[#fdfcf0] p-4 border-b-4 border-[#451a03]">
          <h2 class="text-2xl font-black uppercase italic tracking-tighter">Telegraph Logs</h2>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div 
            v-for="contact in contacts" 
            :key="contact.id"
            @click="activeContact = contact"
            class="p-4 border-b-4 border-[#451a03] cursor-pointer transition-colors"
            :class="activeContact.id === contact.id ? 'bg-[#d97706] text-[#fdfcf0]' : 'text-[#451a03] hover:bg-[#fcf5d8]'"
          >
            <div class="font-black uppercase text-lg">{{ contact.name }}</div>
            <div class="text-sm font-bold opacity-80 mb-2">Re: {{ contact.cow }}</div>
            <div class="text-sm truncate italic">"{{ contact.lastMessage }}"</div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-2/3 flex flex-col bg-[#fdfcf0]">
        
        <div class="p-4 border-b-4 border-[#451a03] bg-[#d97706] flex justify-between items-center text-[#fdfcf0]">
          <div>
            <h3 class="font-black text-xl uppercase tracking-widest">{{ activeContact.name }}</h3>
            <span class="text-sm font-bold italic">Negotiating: {{ activeContact.cow }}</span>
          </div>
          <button class="border-2 border-[#fdfcf0] px-3 py-1 text-xs font-black uppercase hover:bg-[#fdfcf0] hover:text-[#d97706] transition">
            View Profile
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-inherit bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM0NTFhMDMiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]">
          
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            class="max-w-[70%] p-3 font-bold text-lg leading-snug border-2 border-[#451a03] shadow-[4px_4px_0px_0px_rgba(69,26,3,1)]"
            :class="msg.senderId === 'me' ? 'self-end bg-[#2f855a] text-[#fdfcf0] ml-auto' : 'self-start bg-[#fef3c7] text-[#451a03]'"
          >
            {{ msg.text }}
          </div>

        </div>

        <div class="p-4 border-t-4 border-[#451a03] bg-[#fef3c7]">
          <form @submit.prevent="sendMessage" class="flex gap-4">
            <input 
              v-model="newMessage"
              type="text" 
              placeholder="Type your telegram..." 
              class="flex-1 bg-[#fdfcf0] border-4 border-[#451a03] px-4 py-3 outline-none font-bold text-[#451a03] placeholder-[#451a03]/40 shadow-[4px_4px_0px_0px_rgba(69,26,3,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
            >
            <button 
              type="submit"
              class="bg-[#451a03] text-[#fdfcf0] border-4 border-[#451a03] px-8 py-3 font-black text-xl uppercase hover:bg-[#d97706] transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  </main>
</template>