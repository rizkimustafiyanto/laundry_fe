import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    selectedUser: null,
    profile: null,
    currentPage: 1,
    limit: 10,
    searchQuery: '',
  }),

  actions: {
    async fetchProfile() {
      try {
        const res = await api.get('/users/profile')
        this.profile = res.data
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        throw error
      }
    },

    async updateProfile(formData) {
      try {
        const res = await api.put('/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.profile = res.data
        return res.data
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw error
      }
    },

    async fetchUsers(query = {}) {
      if (query.page !== undefined) this.currentPage = query.page
      if (query.limit !== undefined) this.limit = query.limit
      if (query.search !== undefined) this.searchQuery = query.search

      try {
        const res = await api.get('/users/list', {
          params: {
            page: this.currentPage || 1,
            limit: this.limit || 10,
            search: this.searchQuery || '',
          },
        })
        this.users = res.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error
      }
    },

    async fetchUserById(id) {
      try {
        const res = await api.get(`/users/list/${id}`)
        this.selectedUser = res.data
      } catch (error) {
        console.error('Failed to fetch user by ID:', error)
        throw error
      }
    },

    async updateUserById(id, data) {
      try {
        const res = await api.put(`/users/list/${id}`, data)
        if (this.selectedUser?.id === id) {
          this.selectedUser = res.data
        }
        return res.data
      } catch (error) {
        console.error('Failed to update user by ID:', error)
        throw error
      }
    },

    listenUserUpdates() {
      socket.on('profile_updated', (updatedUser) => {
        this.fetchProfile()
      })
      socket.on('user_updated', (updatedUser) => {
        const updatedData = updatedUser.user
        const index = this.users.data.findIndex((u) => u.id === updatedData.id)

        if (index !== -1) {
          this.users.data.splice(index, 1, updatedData)
        }
      })
    },
  },
})
