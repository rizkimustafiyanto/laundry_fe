import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta } from '@/utils/formatters'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [],
    company: null,
    meta: {
      currentPage: 1,
      limit: 10,
      searchQuery: '',
      totalData: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }),

  actions: {
    async fetchCompanies(query = {}) {
      if (query.page !== undefined) this.meta.currentPage = query.page
      if (query.limit !== undefined) this.meta.limit = query.limit
      if (query.search !== undefined) this.meta.searchQuery = query.search

      try {
        const res = await api.get('/company-profiles', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
            search: this.meta.searchQuery,
          },
        })

        this.companies = res.data.data
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar company profiles')
      }
    },

    async fetchCompanyById(id) {
      try {
        const res = await api.get(`/company-profiles/${id}`)
        this.company = res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail company profile')
      }
    },

    async createCompany(payload) {
      try {
        const res = await api.post('/company-profiles', payload)
        notifySuccess('Company profile berhasil dibuat')
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal membuat company profile')
        throw err
      }
    },

    async updateCompany(id, payload) {
      try {
        const res = await api.put(`/company-profiles/${id}`, payload)
        notifySuccess('Company profile berhasil diperbarui')
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui company profile')
        throw err
      }
    },

    async deleteCompany(id) {
      try {
        await api.delete(`/company-profiles/${id}`)
        notifySuccess('Company profile berhasil dihapus')
        this.companies = this.companies.filter((c) => c.id !== id)
      } catch (err) {
        notifyError(err, 'Gagal menghapus company profile')
        throw err
      }
    },
  },
})
