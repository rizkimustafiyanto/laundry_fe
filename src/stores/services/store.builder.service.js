import { defineStore } from 'pinia'
import { api, apiForm } from '@/utils/api'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta } from '@/utils/formatters'

export function createStoreBuilder({
  storeId,
  endpoint,
  defaultPayload,
  customGetters = {},
  customActions = {},
}) {
  return defineStore(storeId, {
    state: () => ({
      items: [],
      item: null,
      formPayload: { ...defaultPayload },
      meta: {
        currentPage: 1,
        limit: 10,
        searchQuery: '',
        totalData: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      filters: {},
    }),

    getters: {
      totalItems: (state) => state.items.length,
      ...customGetters,
    },

    actions: {
      async fetchItems(query = {}, extraFilters = {}) {
        if (query.page !== undefined) this.meta.currentPage = query.page
        if (query.limit !== undefined) this.meta.limit = query.limit
        if (query.search !== undefined) this.meta.searchQuery = query.search

        this.filters = { ...this.filters, ...extraFilters }

        try {
          const res = await api.get(endpoint, {
            params: {
              page: this.meta.currentPage,
              limit: this.meta.limit,
              search: this.meta.searchQuery,
              ...this.filters,
            },
          })
          this.items = res.data.data || []
          this.meta = mapMeta(res.data.meta || {})
        } catch (err) {
          notifyError(err, `Gagal mengambil data dari ${storeId}`)
        }
      },

      setFilter(key, value) {
        this.fetchItems({ page: 1 }, { [key]: value })
      },

      setFilters(newFilters) {
        this.fetchItems({ page: 1 }, newFilters)
      },

      resetFilters() {
        this.filters = {}
        this.fetchItems({ page: 1 })
      },

      async fetchItemById(id) {
        try {
          const res = await api.get(`${endpoint}/${id}`)
          this.item = res.data.data
          this.formPayload = { ...res.data.data }
        } catch (err) {
          notifyError(err, `Gagal mengambil detail item ${storeId}`)
        }
      },

      async createItem() {
        try {
          const res = await api.post(endpoint, this.formPayload)
          notifySuccess(`${storeId} berhasil dibuat`)
          this.items.push(res.data.data)
          this.resetForm()
        } catch (err) {
          notifyError(err, `Gagal membuat ${storeId}`)
        }
      },

      async updateItem(id) {
        try {
          const res = await api.put(`${endpoint}/${id}`, this.formPayload)
          notifySuccess(`${storeId} berhasil diperbarui`)
          const index = this.items.findIndex((i) => i.id === id)
          if (index !== -1) this.items[index] = res.data.data
          this.resetForm()
        } catch (err) {
          notifyError(err, `Gagal memperbarui ${storeId}`)
        }
      },

      async deleteItem(id) {
        try {
          await api.delete(`${endpoint}/${id}`)
          notifySuccess(`${storeId} berhasil dihapus`)
          this.items = this.items.filter((i) => i.id !== id)
        } catch (err) {
          notifyError(err, `Gagal menghapus ${storeId}`)
        }
      },

      async createItemWithFormData(formData) {
        try {
          const res = await apiForm.post(endpoint, formData)
          notifySuccess(`${storeId} berhasil dibuat`)
          this.items.push(res.data.data)
          this.resetForm()
        } catch (err) {
          notifyError(err, `Gagal membuat ${storeId}`)
        }
      },

      async updateItemWithFormData(id, formData) {
        try {
          const res = await apiForm.put(`${endpoint}/${id}`, formData)
          notifySuccess(`${storeId} berhasil diperbarui`)
          const index = this.items.findIndex((i) => i.id === id)
          if (index !== -1) this.items[index] = res.data.data
          this.resetForm()
        } catch (err) {
          notifyError(err, `Gagal memperbarui ${storeId}`)
        }
      },

      resetForm() {
        this.formPayload = { ...defaultPayload }
      },

      ...customActions,
    },
  })
}
