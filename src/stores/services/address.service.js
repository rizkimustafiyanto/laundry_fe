import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta } from '@/utils/formatters'

export const useAddressStore = defineStore('addresses', {
  state: () => ({
    addresses: [],
    meta: {
      currentPage: 1,
      limit: 10,
      totalData: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }),

  actions: {
    async fetchAddresses(query = {}) {
      if (query.page !== undefined) this.meta.currentPage = query.page
      if (query.limit !== undefined) this.meta.limit = query.limit
      if (query.search !== undefined) this.meta.searchQuery = query.search

      try {
        const res = await api.get('/users/addresses/', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
            search: this.meta.searchQuery,
            customerId: query.customerId,
          },
        })

        this.addresses = res.data.data || []
        const meta = res.data.meta || {}
        this.meta = mapMeta(meta)
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar alamat')
      }
    },

    async createAddresses(payload) {
      try {
        await api.post('/users/addresses', payload)
        notifySuccess('Alamat berhasil ditambahkan')
        this.fetchAddresses()
      } catch (err) {
        notifyError(err, 'Gagal menambahkan alamat')
      }
    },

    async updateAddresses(id, payload) {
      try {
        await api.put(`/users/addresses/${id}`, payload)
        notifySuccess('Alamat berhasil diubah')
        this.fetchAddresses()
      } catch (err) {
        notifyError(err, 'Gagal mengubah alamat')
      }
    },

    async updateAddressesPrimary(id) {
      try {
        await api.put(`/users/addresses/${id}/set-primary`)
        notifySuccess('Alamat berhasil diubah')
        this.fetchAddresses()
      } catch (err) {
        notifyError(err, 'Gagal mengubah alamat')
      }
    },

    async deleteAddresses(id) {
      try {
        await api.delete(`/users/addresses/${id}`)
        notifySuccess('Alamat berhasil dihapus')
        this.fetchAddresses()
      } catch (err) {
        notifyError(err, 'Gagal menghapus alamat')
      }
    },

    clearData() {
      this.addresses = []
      this.meta = {
        currentPage: 1,
        limit: 10,
        totalData: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    },

    listenUserUpdates() {
      socket.on('addresses_update', () => {
        this.fetchAddresses()
      })
    },
  },
})
