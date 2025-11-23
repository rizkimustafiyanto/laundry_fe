import { defineStore } from 'pinia'
import { api, apiForm } from '@/utils/api'
import { notifyError, notifySuccess, notifyConfirm } from '@/utils/notify'
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
          notifyError(err, `Gagal mengambil detail item data`)
        }
      },

      async createItem() {
        try {
          await api.post(endpoint, this.formPayload)
          notifySuccess(`Data berhasil dibuat`)
          this.resetForm()
        } catch (err) {
          notifyError(err, `Gagal membuat data`)
        }
      },

      async updateItem(id) {
        try {
          if (id) {
            await api.put(`${endpoint}/${id}`, this.formPayload)
          } else {
            await api.put(`${endpoint}`, this.formPayload)
          }
          notifySuccess(`Data berhasil diperbarui`)
          this.resetForm()
        } catch (err) {
          notifyError(err, `Gagal memperbarui data`)
        }
      },

      async deleteItem(id) {
        try {
          await notifyConfirm({
            title: 'Hapus Data',
            message: `Apakah Anda yakin ingin menghapus data ini?`,
          })

          await api.delete(`${endpoint}/${id}`)
          notifySuccess(`Data berhasil dihapus`)
        } catch (err) {
          if (err !== 'cancelled') {
            notifyError(err, `Gagal menghapus data`)
          }
        }
      },

      async createItemWithFormData(formData) {
        try {
          const res = await apiForm.post(endpoint, formData)
          notifySuccess(`Data berhasil dibuat`)
          this.resetForm()
          return res.data.data
        } catch (err) {
          notifyError(err, `Gagal membuat data`)
        }
      },

      async updateItemWithFormData(id, formData) {
        try {
          const res = await apiForm.put(`${endpoint}/${id}`, formData)
          notifySuccess(`Data berhasil diperbarui`)
          this.resetForm()
          return res.data.data
        } catch (err) {
          notifyError(err, `Gagal memperbarui data`)
        }
      },

      resetForm() {
        this.formPayload = { ...defaultPayload }
      },

      ...customActions,
    },
  })
}
