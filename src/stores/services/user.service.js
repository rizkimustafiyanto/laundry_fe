// src/stores/users.js
import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta } from '@/utils/formatters'
import { useLoadingStore } from '../utils/loading'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    profile: null,
    meta: {
      currentPage: 1,
      limit: 10,
      totalData: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      searchQuery: '',
    },
  }),

  actions: {
    async fetchUsers(query = {}) {
      if (query.page !== undefined) this.meta.currentPage = query.page
      if (query.limit !== undefined) this.meta.limit = query.limit
      if (query.search !== undefined) this.meta.searchQuery = query.search

      try {
        useLoadingStore.startMini
        const res = await api.get('/users', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
            search: this.meta.searchQuery,
          },
        })

        this.users = res.data.data
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar pengguna')
      } finally {
        useLoadingStore.stopMini
      }
    },

    async fetchUserById(id) {
      try {
        useLoadingStore.startMini
        const res = await api.get(`/users/${id}`)
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail pengguna')
      } finally {
        useLoadingStore.stopMini
      }
    },

    async updateUser(id, payload) {
      try {
        useLoadingStore.startMini
        const res = await api.put(`/users/${id}`, payload)
        notifySuccess('Pengguna berhasil diperbarui')
        await this.fetchUsers()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui pengguna')
      } finally {
        useLoadingStore.stopMini
      }
    },

    async deleteUser(id) {
      try {
        useLoadingStore.startMini
        const res = await api.delete(`/users/${id}`)
        notifySuccess('Pengguna berhasil dihapus')
        await this.fetchUsers()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal menghapus pengguna')
      } finally {
        useLoadingStore.stopMini
      }
    },

    async fetchProfile() {
      try {
        useLoadingStore.startMini
        const res = await api.get('/users/profile')
        this.profile = res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil profil')
      } finally {
        useLoadingStore.stopMini
      }
    },

    async updateProfile(payload) {
      try {
        useLoadingStore.startMini
        const formData = new FormData()
        for (const key in payload) {
          formData.append(key, payload[key])
        }

        const res = await api.put('/users/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        this.profile = res.data.data
        notifySuccess('Profil berhasil diperbarui')
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui profil')
      } finally {
        useLoadingStore.stopMini
      }
    },

    listenUserUpdates() {
      socket.on('profile_updated', (updatedProfile) => {
        this.profile = updatedProfile
      })

      socket.on('user_updated', (updatedUser) => {
        const updatedData = updatedUser.user || updatedUser
        const index = this.users.findIndex((u) => u.id === updatedData.id)
        if (index !== -1) {
          this.users.splice(index, 1, updatedData)
        }
      })
    },
  },
})
