// src/stores/pricing.js
import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta } from '@/utils/formatters'

export const usePricingStore = defineStore('pricing', {
  state: () => ({
    pricings: [],
    currentPricing: null,
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
    async fetchPricings(query = {}) {
      if (query.page !== undefined) this.meta.currentPage = query.page
      if (query.limit !== undefined) this.meta.limit = query.limit
      if (query.search !== undefined) this.meta.searchQuery = query.search

      try {
        const res = await api.get('/pricing', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
            search: this.meta.searchQuery,
          },
        })

        this.pricings = res.data.data
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar harga')
      }
    },

    async fetchPricingById(id) {
      try {
        const res = await api.get(`/pricing/${id}`)
        this.currentPricing = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail harga')
      }
    },

    async fetchPricingByCombination(serviceTypeId, itemTypeId) {
      try {
        const res = await api.get('/pricing/combination/check', {
          params: { serviceTypeId, itemTypeId },
        })
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil harga berdasarkan kombinasi')
      }
    },

    async createPricing(payload) {
      try {
        const res = await api.post('/pricing', payload)
        notifySuccess('Harga berhasil ditambahkan')
        await this.fetchPricings()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal menambahkan harga')
      }
    },

    async updatePricing(id, payload) {
      try {
        const res = await api.put(`/pricing/${id}`, payload)
        notifySuccess('Harga berhasil diperbarui')
        await this.fetchPricings()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui harga')
      }
    },

    async deletePricing(id) {
      try {
        const res = await api.delete(`/pricing/${id}`)
        notifySuccess('Harga berhasil dihapus')
        await this.fetchPricings()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal menghapus harga')
      }
    },

    listenPricingUpdates() {
      socket.on('pricing_updated', () => {
        this.fetchPricings()
      })
    },
  },
})
