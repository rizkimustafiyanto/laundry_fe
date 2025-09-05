// src/stores/charge.js
import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notifyError, notifySuccess } from '@/utils/notify'

export const useChargeStore = defineStore('charge', {
  state: () => ({
    charges: [],
    categories: [],
    types: [],
    selectedCharge: null,
  }),

  actions: {
    async fetchCharges() {
      try {
        const res = await api.get('charges/')
        this.charges = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar charge')
      }
    },

    async fetchChargeCategories() {
      try {
        const res = await api.get('charges/category')
        this.categories = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil kategori charge')
      }
    },

    async fetchChargeTypes() {
      try {
        const res = await api.get('charges/type')
        this.types = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil tipe charge')
      }
    },

    async fetchChargeById(id) {
      try {
        const res = await api.get(`/${id}`)
        this.selectedCharge = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil charge')
      }
    },

    async upsertCharge(payload) {
      try {
        const res = await api.post('charges/', payload)
        notifySuccess('Charge berhasil disimpan')
        await this.fetchCharges() // refresh data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal menyimpan charge')
      }
    },

    async deleteCharge(id) {
      try {
        await api.delete(`/${id}`)
        notifySuccess('Charge berhasil dihapus')
        this.charges = this.charges.filter((c) => c.id !== id)
      } catch (err) {
        notifyError(err, 'Gagal menghapus charge')
      }
    },
  },
})
