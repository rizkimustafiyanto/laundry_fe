// src/stores/options.js
import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta, toValueLabelOptions } from '@/utils/formatters'

export const useOptionsStore = defineStore('options', {
  state: () => ({
    serviceTypes: [],
    itemTypes: [],
    statuses: [],
    roles: [],
    genders: [],
    paymentMethods: [],

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
    // ==============================
    // SERVICE TYPE CRUD
    // ==============================
    async fetchServiceTypes() {
      try {
        const res = await api.get('/options/service-types', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
          },
        })
        this.serviceTypes = toValueLabelOptions(res.data.data) || []
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal ambil service types')
      }
    },

    async createServiceType(payload) {
      try {
        const res = await api.post('/options/service-types', payload)
        notifySuccess('Service type berhasil dibuat')
        await this.fetchServiceTypes()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal membuat service type')
      }
    },

    async updateServiceType(id, payload) {
      try {
        const res = await api.put(`/options/service-types/${id}`, payload)
        notifySuccess('Service type berhasil diupdate')
        await this.fetchServiceTypes()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal update service type')
      }
    },

    async deleteServiceType(id) {
      try {
        const res = await api.delete(`/options/service-types/${id}`)
        notifySuccess('Service type berhasil dihapus')
        await this.fetchServiceTypes()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal hapus service type')
      }
    },

    // ==============================
    // ITEM TYPE CRUD
    // ==============================
    async fetchItemTypes() {
      try {
        const res = await api.get('/options/item-types', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
          },
        })
        this.itemTypes = toValueLabelOptions(res.data.data) || []
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal ambil item types')
      }
    },

    async createItemType(payload) {
      try {
        const res = await api.post('/options/item-types', payload)
        notifySuccess('Item type berhasil dibuat')
        await this.fetchItemTypes()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal membuat item type')
      }
    },

    async updateItemType(id, payload) {
      try {
        const res = await api.put(`/options/item-types/${id}`, payload)
        notifySuccess('Item type berhasil diupdate')
        await this.fetchItemTypes()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal update item type')
      }
    },

    async deleteItemType(id) {
      try {
        const res = await api.delete(`/options/item-types/${id}`)
        notifySuccess('Item type berhasil dihapus')
        await this.fetchItemTypes()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal hapus item type')
      }
    },

    // ==============================
    // EXTRA OPTIONS (ENUMS)
    // ==============================
    async fetchStatuses() {
      try {
        const res = await api.get('/options/status')
        this.statuses = toValueLabelOptions(res.data.data) || []
      } catch (err) {
        notifyError(err, 'Gagal ambil status transaksi')
      }
    },

    async fetchPaymentMethod() {
      try {
        const res = await api.get('/options/payment-method')
        this.paymentMethods = toValueLabelOptions(res.data.data) || []
      } catch (err) {
        notifyError(err, 'Gagal ambil payment method')
      }
    },

    async fetchRoles() {
      try {
        const res = await api.get('/options/roles')
        this.roles = toValueLabelOptions(res.data.data) || []
      } catch (err) {
        notifyError(err, 'Gagal ambil roles')
      }
    },

    async fetchGenders() {
      try {
        const res = await api.get('/options/genders')
        this.genders = toValueLabelOptions(res.data.data) || []
      } catch (err) {
        notifyError(err, 'Gagal ambil genders')
      }
    },

    // ==============================
    // SOCKET LISTENER
    // ==============================
    listenOptionsUpdates() {
      socket.on('options_update', () => {
        this.fetchServiceTypes()
        this.fetchItemTypes()
      })
    },
  },
})
