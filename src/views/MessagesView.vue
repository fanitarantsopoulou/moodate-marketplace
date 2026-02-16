<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessagesStore } from '@/stores/messages'

const router = useRouter()
const messagesStore = useMessagesStore()

onMounted(() => {
  messagesStore.initSocket()
  messagesStore.fetchConversations()
})

onUnmounted(() => {
  // Keep socket connected for real-time updates across app
})

const openConversation = (conv) => {
  const conversationId = `${conv.cow._id}-${conv.otherUser._id}`
  router.push(`/messages/${conversationId}`)
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diff < 604800000) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const getCowImage = (cow) => {
  if (cow?.images?.length > 0) {
    const img = cow.images[0]
    return img.startsWith('http') ? img : `http://localhost:3001${img}`
  }
  return null
}
</script>

<template>
  <div class="messages-view">
    <header class="header">
      <h1>💬 Messages</h1>
      <p>Your conversations</p>
    </header>

    <div v-if="messagesStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Loading conversations...</p>
    </div>

    <div v-else-if="messagesStore.error" class="error-message">
      <p>⚠️ {{ messagesStore.error }}</p>
      <button class="btn btn-retry" @click="messagesStore.fetchConversations">Try Again</button>
    </div>

    <div v-else-if="messagesStore.conversations.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No messages yet</h3>
      <p>Start a conversation by contacting a seller about their listing</p>
      <router-link to="/listings" class="btn btn-primary">Browse Listings</router-link>
    </div>

    <div v-else class="conversations-list">
      <div
        v-for="conv in messagesStore.conversations"
        :key="`${conv.cow?._id}-${conv.otherUser?._id}`"
        class="conversation-item"
        @click="openConversation(conv)"
      >
        <div class="cow-thumbnail">
          <img v-if="getCowImage(conv.cow)" :src="getCowImage(conv.cow)" :alt="conv.cow?.name" />
          <div v-else class="cow-placeholder">🐄</div>
        </div>

        <div class="conversation-info">
          <div class="conversation-header">
            <span class="user-name">{{ conv.otherUser?.name || 'Unknown User' }}</span>
            <span class="timestamp">{{ formatTime(conv.lastMessage?.createdAt) }}</span>
          </div>
          <div class="cow-name">Re: {{ conv.cow?.name || 'Unknown Cow' }}</div>
          <div class="last-message">
            {{ conv.lastMessage?.content?.substring(0, 50) }}{{ conv.lastMessage?.content?.length > 50 ? '...' : '' }}
          </div>
        </div>

        <div v-if="conv.unreadCount > 0" class="unread-badge">
          {{ conv.unreadCount > 9 ? '9+' : conv.unreadCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-view {
  max-width: 600px;
  margin: 0 auto;
}

.header {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
}

.header h1 {
  color: #333;
  margin-bottom: 5px;
}

.header p {
  color: #666;
}

.loading, .error-message {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: var(--card-shadow);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: var(--card-shadow);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
}

.btn-retry {
  background: var(--primary);
  color: white;
}

.conversations-list {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:last-child {
  border-bottom: none;
}

.conversation-item:hover {
  background-color: #f9f9f9;
}

.cow-thumbnail {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 15px;
  background: #f5f5f5;
}

.cow-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cow-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.timestamp {
  font-size: 0.75rem;
  color: #999;
}

.cow-name {
  font-size: 0.8rem;
  color: var(--primary);
  margin-bottom: 3px;
}

.last-message {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  background: var(--primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  flex-shrink: 0;
}
</style>

