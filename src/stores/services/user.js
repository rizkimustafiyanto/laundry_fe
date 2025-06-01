import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { useUIStore } from '@/stores/component/ui.js'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    selectedUser: null,
    profile: null,
    currentPage: 1,
    limit: 10,
    searchQuery: '',
    roleOption: [],
    addresses: [],
  }),

  actions: {
    async fetchProfile() {
      let error = null
      try {
        const res = await api.get('/users/profile')
        this.profile = res.data
      } catch (err) {
        error = err.response?.data?.message || 'Failed to fetch profile'
      } finally {
        error ? useUIStore().show('error', error) : ''
      }
    },

    async fetchUsers(query = {}) {
      let error = null
      if (query.page !== undefined) this.currentPage = query.page
      if (query.limit !== undefined) this.limit = query.limit
      if (query.search !== undefined) this.searchQuery = query.search

      try {
        const res = await api.get('/users/list', {
          params: {
            page: this.currentPage,
            limit: this.limit,
            search: this.searchQuery,
          },
        })
        this.users = res.data
      } catch (err) {
        error = err.response?.data?.message || 'Failed to fetch users'
      } finally {
        error ? useUIStore().show('error', error) : ''
      }
    },

    async fetchUserById(id) {
      let error = null
      try {
        const res = await api.get(`/users/list/${id}`)
        this.selectedUser = res.data
        return res.data
      } catch (err) {
        error = err.response?.data?.message || 'Failed to fetch user by ID'
      } finally {
        error ? useUIStore().show('error', error) : ''
      }
    },

    async updateUserById(id, data) {
      let error = null
      try {
        const res = await api.put(`/users/list/${id}`, data)
        if (this.selectedUser?.id === id) {
          this.selectedUser = res.data
        }

        const index = this.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          this.users[index] = res.data
        }

        return res.data
      } catch (err) {
        error = err.response?.data?.message || 'Failed to update user'
      } finally {
        error
          ? useUIStore().show('error', error)
          : useUIStore().show('success', 'Pengguna berhasil diperbarui')
      }
    },

    async updateProfile(formData) {
      let error = null
      try {
        const res = await api.put('/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        this.profile = res.data
        return res.data
      } catch (err) {
        error = err.response?.data?.message || 'Failed to update profile'
      } finally {
        error
          ? useUIStore().show('error', error)
          : useUIStore().show('success', 'Profil berhasil diperbarui')
      }
    },

    async fetchRoleOption() {
      let error = null
      try {
        const res = await api.get('/users/role-option')
        this.roleOption = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
        }))
      } catch (err) {
        error = err.response?.data?.message || 'Failed to fetch role option'
      } finally {
        error ? useUIStore().show('error', error) : ''
      }
    },

    async fetchAddresses() {
      let error = null
      // try {
      //   const res = await api.get('/users/role-option')
      //   this.roleOption = res.data.map((item) => ({
      //     label: item.replace(/_/g, ' '),
      //     value: item,
      //   }))
      // } catch (err) {
      //   error = err.response?.data?.message || 'Failed to fetch role option'
      // } finally {
      //   error ? useUIStore().show('error', error) : ''
      // }
    },

    listenUserUpdates() {
      socket.on('profile_updated', () => {
        this.fetchProfile()
      })

      socket.on('user_updated', (updatedUser) => {
        const updatedData = updatedUser.user
        const index = this.users.findIndex((u) => u.id === updatedData.id)
        if (index !== -1) {
          this.users.splice(index, 1, updatedData)
        }
      })
    },
  },
})
