// src/stores/transaction.js
import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'
import { mapMeta } from '@/utils/formatters'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    pickupRequested: [],
    selectedTransaction: null,
    meta: {
      currentPage: 1,
      limit: 10,
      searchQuery: '',
      statusQuery: '',
      totalData: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }),
  getters: {
    todayTransactions: (state) => {
      const today = new Date()
      return state.transactions.filter((t) => {
        const createdDate = new Date(t.createdAt)
        return (
          createdDate.getFullYear() === today.getFullYear() &&
          createdDate.getMonth() === today.getMonth() &&
          createdDate.getDate() === today.getDate()
        )
      }).length
    },
    completedTransactions: (state) => {
      const completedTransaction = state.transactions.filter(
        (t) => t.status.toLowerCase() === 'completed',
      ).length
      return completedTransaction
    },
    runningTransactionsByStatus: (state) => {
      const runningTransactions = state.transactions.filter(
        (t) => t.status.toLowerCase() !== 'completed' && t.status.toLowerCase() !== 'cancelled',
      )

      const grouped = runningTransactions.reduce((acc, t) => {
        const status = t.status
        if (!acc[status]) acc[status] = 0
        acc[status] += 1
        return acc
      }, {})

      return Object.keys(grouped).map((status) => ({
        status,
        count: grouped[status],
      }))
    },
  },
  actions: {
    async fetchTransactions(query = {}) {
      if (query.page !== undefined) this.meta.currentPage = query.page
      if (query.limit !== undefined) this.meta.limit = query.limit
      if (query.search !== undefined) this.meta.searchQuery = query.search
      if (query.status !== undefined) this.meta.statusQuery = query.status

      try {
        const res = await api.get('/transactions', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
            search: this.meta.searchQuery,
            status: this.meta.statusQuery,
          },
        })
        this.transactions = res.data.data
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar transaksi')
      }
    },

    async fetchTransactionById(transactionId) {
      try {
        const res = await api.get(`/transactions/${transactionId}`)
        this.selectedTransaction = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail transaksi')
      }
    },

    async createTransaction(payload) {
      try {
        const res = await api.post('/transactions', payload)
        notifySuccess('Transaksi berhasil dibuat')
        await this.fetchTransactions()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal membuat transaksi')
      }
    },

    async updateTransaction(transactionId, payload) {
      try {
        const res = await api.put(`/items/${transactionId}`, payload)
        notifySuccess('Transaksi berhasil diupdate (Admin)')
        await this.fetchTransactions()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal update transaksi (Admin)')
      }
    },

    async updateTransactionStatus(transactionId, status) {
      try {
        const res = await api.put(`/transactions/${transactionId}/status`, { status })
        notifySuccess('Status transaksi berhasil diperbarui')
        await this.fetchTransactions()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui status transaksi')
      }
    },

    async adminUpdateTransaction(transactionId, payload) {
      try {
        const res = await api.put(`/transactions/${transactionId}`, payload)
        notifySuccess('Transaksi berhasil diupdate (Admin)')
        await this.fetchTransactions()
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal update transaksi (Admin)')
      }
    },

    async adminDeleteTransaction(transactionId) {
      try {
        await api.delete(`/transactions/${transactionId}`)
        notifySuccess('Transaksi berhasil dihapus (Admin)')
        this.transactions = this.transactions.filter((t) => t.id !== transactionId)
      } catch (err) {
        notifyError(err, 'Gagal menghapus transaksi (Admin)')
      }
    },

    async exportTransactions(payload) {
      try {
        const res = await api.post('/transactions/export', payload, { responseType: 'blob' })
        // bisa langsung trigger download file excel/pdf
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal export transaksi')
      }
    },

    async fetchPickupRequest(query = {}) {
      if (query.page !== undefined) this.meta.currentPage = query.page
      if (query.limit !== undefined) this.meta.limit = query.limit
      if (query.search !== undefined) this.meta.searchQuery = query.search

      try {
        const res = await api.get('/transactions/pickup-request', {
          params: {
            page: this.meta.currentPage,
            limit: this.meta.limit,
            search: this.meta.searchQuery,
          },
        })
        this.pickupRequested = res.data.data
        this.meta = mapMeta(res.data.meta)
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar transaksi')
      }
    },

    listenOrderUpdates() {
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
