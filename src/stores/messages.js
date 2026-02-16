import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import api from '@/services/api'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    conversations: [],
    currentMessages: [],
    socket: null,
    connected: false,
    loading: false,
    error: null
  }),

  getters: {
    totalUnread: (state) => {
      return state.conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
    }
  },

  actions: {
    initSocket() {
      if (this.socket?.connected) return

      const token = localStorage.getItem('token')
      if (!token) return

      this.socket = io('http://localhost:3001', {
        auth: { token }
      })

      this.socket.on('connect', () => {
        this.connected = true
        // Join user's room for receiving messages
        const user = JSON.parse(localStorage.getItem('user'))
        if (user?._id) {
          this.socket.emit('join', user._id)
        }
      })

      this.socket.on('disconnect', () => {
        this.connected = false
      })

      this.socket.on('newMessage', (message) => {
        // Add to current messages if in the same conversation
        const currentUser = JSON.parse(localStorage.getItem('user'))
        const isCurrentConversation =
          this.currentMessages.length > 0 &&
          this.currentMessages[0]?.cow?._id === message.cow?._id &&
          (message.sender._id === currentUser?._id || message.receiver._id === currentUser?._id)

        if (isCurrentConversation) {
          this.currentMessages.push(message)
        }

        // Update conversations list
        this.updateConversationWithNewMessage(message)
      })
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        this.connected = false
      }
    },

    async fetchConversations() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/messages/conversations')
        this.conversations = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch conversations'
      } finally {
        this.loading = false
      }
    },

    async fetchMessages(cowId, otherUserId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/messages/${cowId}?otherUserId=${otherUserId}`)
        this.currentMessages = response.data
        // Mark as read in local state
        this.markConversationAsRead(cowId, otherUserId)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch messages'
        return []
      } finally {
        this.loading = false
      }
    },

    async sendMessage(receiverId, cowId, content) {
      try {
        const response = await api.post('/messages', { receiverId, cowId, content })
        const message = response.data

        // Add to current messages
        this.currentMessages.push(message)

        // Emit via socket for real-time
        if (this.socket?.connected) {
          this.socket.emit('sendMessage', message)
        }

        return { success: true, message }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to send message'
        }
      }
    },

    markConversationAsRead(cowId, otherUserId) {
      const conv = this.conversations.find(
        (c) => c.cow?._id === cowId && c.otherUser?._id === otherUserId
      )
      if (conv) {
        conv.unreadCount = 0
      }
    },

    updateConversationWithNewMessage(message) {
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const otherUserId =
        message.sender._id === currentUser?._id ? message.receiver._id : message.sender._id

      const existingConv = this.conversations.find(
        (c) => c.cow?._id === message.cow?._id && c.otherUser?._id === otherUserId
      )

      if (existingConv) {
        existingConv.lastMessage = message
        if (message.receiver._id === currentUser?._id) {
          existingConv.unreadCount = (existingConv.unreadCount || 0) + 1
        }
        // Move to top
        const index = this.conversations.indexOf(existingConv)
        if (index > 0) {
          this.conversations.splice(index, 1)
          this.conversations.unshift(existingConv)
        }
      } else {
        // Refresh conversations to get the new one
        this.fetchConversations()
      }
    },

    clearCurrentMessages() {
      this.currentMessages = []
    }
  }
})

