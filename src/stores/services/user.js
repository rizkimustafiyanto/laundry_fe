import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'

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
      try {
        const res = await api.get('/users/profile')
        this.profile = res.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil profil')
      }
    },

    async fetchUsers(query = {}) {
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
        notifyError(err, 'Gagal mengambil daftar pengguna')
      }
    },

    async fetchUserById(id) {
      try {
        const res = await api.get(`/users/list/${id}`)
        this.selectedUser = res.data
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil pengguna berdasarkan ID')
      }
    },

    async updateUserById(id, data) {
      try {
        const res = await api.put(`/users/list/${id}`, data)

        if (this.selectedUser?.id === id) {
          this.selectedUser = res.data
        }

        const index = this.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          this.users[index] = res.data
        }

        notifySuccess('Pengguna berhasil diperbarui')
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui pengguna')
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
        notifySuccess('Profil berhasil diperbarui')
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui profil')
      }
    },

    async fetchRoleOption() {
      try {
        const res = await api.get('/users/role-option')
        this.roleOption = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
        }))
      } catch (err) {
        notifyError(err, 'Gagal mengambil opsi peran')
      }
    },

    async fetchAddresses() {
      try {
        const res = await api.get('/users/addresses/list')
        this.addresses = res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar alamat')
      }
    },

    async createAddresses(payload) {
      try {
        await api.post('/users/addresses', payload)
        notifySuccess('Alamat berhasil ditambahkan')
      } catch (err) {
        notifyError(err, 'Gagal menambahkan alamat')
      }
    },

    async updateAddresses(id, payload) {
      try {
        await api.put(`/users/addresses/${id}`, payload)
        notifySuccess('Alamat berhasil diubah')
      } catch (err) {
        notifyError(err, 'Gagal mengubah alamat')
      }
    },

    async deleteAddresses(id) {
      try {
        await api.delete(`/users/addresses/${id}`)
        notifySuccess('Alamat berhasil dihapus')
      } catch (err) {
        notifyError(err, 'Gagal menghapus alamat')
      }
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

      socket.on('addresses_update', (data) => {
        this.fetchAddresses()
      })
    },
  },
})
