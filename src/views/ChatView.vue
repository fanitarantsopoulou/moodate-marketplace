<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessagesStore } from '@/stores/messages'

const route = useRoute()
const router = useRouter()
const messagesStore = useMessagesStore()

const newMessage = ref('')
const messagesContainer = ref(null)
const currentUser = ref(JSON.parse(localStorage.getItem('user')))

const cowId = computed(() => {
  const parts = route.params.orderId?.split('-')
  return parts?.[0] || null
})

const otherUserId = computed(() => {
  const parts = route.params.orderId?.split('-')
  return parts?.[1] || null
})

const cowInfo = computed(() => {
  if (messagesStore.currentMessages.length > 0) {
    return messagesStore.currentMessages[0]?.cow
  }
  return null
})

const otherUser = computed(() => {
  if (messagesStore.currentMessages.length > 0) {
    const msg = messagesStore.currentMessages[0]
    return msg.sender._id === currentUser.value?._id ? msg.receiver : msg.sender
  }
  return null
})

const getCowImage = (cow) => {
  if (cow?.images?.length > 0) {
    const img = cow.images[0]
    return img.startsWith('http') ? img : `http://localhost:3001${img}`
  }
  return null
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
}

const shouldShowDate = (index) => {
  if (index === 0) return true
  const current = new Date(messagesStore.currentMessages[index].createdAt).toDateString()
  const prev = new Date(messagesStore.currentMessages[index - 1].createdAt).toDateString()
  return current !== prev
}

const isOwnMessage = (msg) => {
  return msg.sender?._id === currentUser.value?._id
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !otherUserId.value || !cowId.value) return

  const content = newMessage.value.trim()
  newMessage.value = ''

  const result = await messagesStore.sendMessage(otherUserId.value, cowId.value, content)
  if (result.success) {
    scrollToBottom()
  }
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

onMounted(async () => {
  messagesStore.initSocket()

  if (cowId.value && otherUserId.value) {
    await messagesStore.fetchMessages(cowId.value, otherUserId.value)
    scrollToBottom()
  }
})

onUnmounted(() => {
  messagesStore.clearCurrentMessages()
})

// Watch for new messages and auto-scroll
watch(
  () => messagesStore.currentMessages.length,
  () => scrollToBottom()
)
</script>

<template>
  <div class="chat-view">
    <!-- Header -->
    <header class="chat-header">
      <button class="back-btn" @click="router.push('/messages')">←</button>
      <div class="header-info">
        <div class="header-user">{{ otherUser?.name || 'Loading...' }}</div>
        <div class="header-cow">
          <img v-if="getCowImage(cowInfo)" :src="getCowImage(cowInfo)" class="cow-mini" />
          <span>{{ cowInfo?.name || 'Loading...' }}</span>
        </div>
      </div>
    </header>

    <!-- Messages -->
    <div ref="messagesContainer" class="messages-container">
      <div v-if="messagesStore.loading" class="loading">
        <div class="spinner"></div>
        <p>Loading messages...</p>
      </div>

      <div v-else-if="messagesStore.currentMessages.length === 0" class="empty-chat">
        <p>No messages yet. Start the conversation!</p>
      </div>

      <template v-else>
        <template v-for="(msg, index) in messagesStore.currentMessages" :key="msg._id">
          <div v-if="shouldShowDate(index)" class="date-separator">
            {{ formatDate(msg.createdAt) }}
          </div>
          <div :class="['message', isOwnMessage(msg) ? 'sent' : 'received']">
            <div class="bubble">
              <p>{{ msg.content }}</p>
              <span class="time">{{ formatTime(msg.createdAt) }}</span>
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- Input -->
    <div class="message-input-container">
      <textarea
        v-model="newMessage"
        class="message-input"
        placeholder="Type a message..."
        rows="1"
        @keypress="handleKeyPress"
      ></textarea>
      <button class="send-btn" :disabled="!newMessage.trim()" @click="sendMessage">
        ➤
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  max-width: 600px;
  margin: 0 auto;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 15px;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.header-info {
  flex: 1;
}

.header-user {
  font-weight: 600;
  font-size: 1.1rem;
}

.header-cow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  opacity: 0.9;
}

.cow-mini {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  scroll-behavior: smooth;
}

.loading, .empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #ddd;
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.date-separator {
  text-align: center;
  color: #999;
  font-size: 0.75rem;
  margin: 20px 0 10px;
  position: relative;
}

.date-separator::before,
.date-separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #ddd;
}

.date-separator::before {
  left: 0;
}

.date-separator::after {
  right: 0;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.sent .bubble {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border-bottom-right-radius: 4px;
}

.received .bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.bubble p {
  margin: 0 0 4px;
  word-wrap: break-word;
  line-height: 1.4;
}

.time {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  text-align: right;
}

.message-input-container {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #eee;
  gap: 12px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 1rem;
  resize: none;
  outline: none;
  font-family: inherit;
  max-height: 100px;
}

.message-input:focus {
  border-color: var(--primary);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, transform 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

