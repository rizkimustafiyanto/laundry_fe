import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'
import socket from '@/plugins/socket'

export const useTransactionStore = createStoreBuilder({
  storeId: 'transactionStore',
  endpoint: '/transactions',
  defaultPayload: {
    status: '',
    notes: '',
    pickupRequested: false,
    pickupAddressId: '',
    deliveryRequested: false,
    deliveryAddressId: '',
    items: [],
    payment: {
      amountPaid: 0,
      paymentMethod: '',
      note: '',
    },
  },
  customGetters: {
    todayTransactions: (state) => {
      const today = new Date()
      return state.items.filter(
        (t) => new Date(t.createdAt).toDateString() === today.toDateString(),
      ).length
    },
    completedTransactions: (state) =>
      state.items.filter((t) => t.status.toLowerCase() === 'completed').length,
    runningTransactionsByStatus: (state) => {
      const runningTransactions = state.items
      const grouped = runningTransactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      }, {})
      return Object.entries(grouped).map(([status, count]) => ({ status, count }))
    },
    pickupRequested: (state) => state.items.filter((t) => t.pickupRequested),
  },
  customActions: {
    async fetchByStatus(status) {
      try {
        await this.fetchItems({ page: 1 }, { status })
      } catch (err) {
        notifyError(err, 'Gagal mengambil transaksi berdasarkan status')
      }
    },

    async fetchTransactionById(transactionId) {
      try {
        const res = await api.get(`/transactions/${transactionId}`)
        this.item = res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail transaksi')
      }
    },

    async updateTransactionStatus(transactionId, status) {
      try {
        await api.put(`/transactions/${transactionId}/status`, { status })
        notifySuccess(`Status transaksi berhasil diubah ke ${status}`)
      } catch (err) {
        notifyError(err, 'Gagal memperbarui status transaksi')
      }
    },

    async exportTransactions(payload) {
      try {
        const res = await api.post('/transactions/export', payload)
        notifySuccess('Export transaksi berhasil')
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal mengekspor transaksi')
      }
    },

    listenTrnasactionUpdates() {
      socket.on('transaction_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('payment_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('transaction_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('transaction_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

export const useTransactionStatsStore = createStoreBuilder({
  storeId: 'transactionStatsStore',
  endpoint: '/transactions',
  defaultPayload: {},

  customGetters: {
    transactionsByMonth: (state) => {
      const grouped = {}

      state.items.forEach((t) => {
        const date = new Date(t.createdAt)
        const month = date.toLocaleString('id-ID', { month: 'short' })
        grouped[month] = (grouped[month] || 0) + 1
      })

      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ]

      return {
        categories: months,
        data: months.map((m) => grouped[m] || 0),
      }
    },
    transactionsByStatus: (state) => {
      const grouped = state.items.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      }, {})
      return Object.entries(grouped).map(([status, count]) => ({
        status: formatText(status),
        count,
      }))
    },
    todayTransactions: (state) => {
      const today = new Date().toDateString()
      return state.items.filter((t) => new Date(t.createdAt).toDateString() === today).length
    },
    completedTransactions: (state) =>
      state.items.filter((t) => t.status.toLowerCase() === 'completed').length,
    runningTransactionsByStatus: (state) => {
      const runningTransactions = state.items
      const grouped = runningTransactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      }, {})
      return Object.entries(grouped).map(([status, count]) => ({ status, count }))
    },
    profitByMonth: (state) => {
      const monthly = {}

      state.items.forEach((t) => {
        if (t?.payment?.status === 'PAID' && typeof t?.payment?.amountPaid === 'number') {
          const date = new Date(t.createdAt)

          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          monthly[key] = (monthly[key] || 0) + t.payment.amountPaid
        }
      })

      const sortedKeys = Object.keys(monthly).sort()

      if (!sortedKeys.length) {
        return { categories: [], data: [] }
      }

      return {
        categories: sortedKeys.map((key) => {
          const [year, month] = key.split('-')

          return new Date(year, month - 1).toLocaleString('id-ID', {
            month: 'long',
            year: 'numeric',
          })
        }),

        data: sortedKeys.map((key) => monthly[key]),
      }
    },
  },
  customActions: {
    async exportTransactions(payload) {
      try {
        const res = await api.post('/transactions/export', payload)
        notifySuccess('Export transaksi berhasil')
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal mengekspor transaksi')
      }
    },
    listenStatUpdates() {
      socket.on('transaction_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('payment_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('transaction_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('transaction_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

export const useOrderStore = createStoreBuilder({
  storeId: 'orderStore',
  endpoint: '/transactions',
  defaultPayload: {
    status: '',
    notes: '',
    pickupRequested: false,
    pickupAddressId: '',
    deliveryRequested: false,
    deliveryAddressId: '',
    items: [],
    payment: {
      amountPaid: 0,
      paymentMethod: '',
      note: '',
    },
  },
  customGetters: {
    todayTransactions: (state) => {
      const today = new Date()
      return state.items.filter(
        (t) => new Date(t.createdAt).toDateString() === today.toDateString(),
      ).length
    },
    completedTransactions: (state) =>
      state.items.filter((t) => t.status.toLowerCase() === 'completed').length,
    runningTransactionsByStatus: (state) => {
      const runningTransactions = state.items
      const grouped = runningTransactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      }, {})
      return Object.entries(grouped).map(([status, count]) => ({ status, count }))
    },
    pickupRequested: (state) => state.items.filter((t) => t.pickupRequested),
  },
  customActions: {
    async fetchByStatus(status) {
      try {
        await this.fetchItems({ page: 1 }, { status })
      } catch (err) {
        notifyError(err, 'Gagal mengambil transaksi berdasarkan status')
      }
    },

    async fetchTransactionById(transactionId) {
      try {
        const res = await api.get(`/transactions/${transactionId}`)
        this.item = res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail transaksi')
      }
    },

    async updateTransactionStatus(transactionId, status) {
      try {
        await api.put(`/transactions/${transactionId}/status`, { status })
        notifySuccess(`Status transaksi berhasil diubah ke ${status}`)
      } catch (err) {
        notifyError(err, 'Gagal memperbarui status transaksi')
      }
    },

    async exportTransactions(payload) {
      try {
        const res = await api.post('/transactions/export', payload)
        notifySuccess('Export transaksi berhasil')
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal mengekspor transaksi')
      }
    },

    listenOrderUpdates() {
      socket.on('transaction_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('payment_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('transaction_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('transaction_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})
