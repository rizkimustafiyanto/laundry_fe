import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    selectedUser: null,
    profile: null,
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

    async updateProfile(data) {
      try {
        const res = await api.put('/users/profile', data)
        this.profile = res.data
        return res.data
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw error
      }
    },

    async fetchUsers(query = { page: 1, limit: 10, search: '' }) {
      try {
        const queryParams = {
          page: query.page || 1,
          limit: query.limit || 10,
          search: query.search || '',
        }

        const res = await api.get('/users/list', { params: queryParams })
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
  },
})
