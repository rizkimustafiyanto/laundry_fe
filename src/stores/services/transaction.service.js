// src/stores/transaction.js
import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifyError, notifySuccess } from '@/utils/notify'

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
        const res = await api.post('/transactions/export', payload, { responseType: 'blob' })
        notifySuccess('Export transaksi berhasil')
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal mengekspor transaksi')
        throw err
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
        notifySuccess(
          `Transaksi #${updatedTransaction.invoiceNumber || updatedTransaction.id} diperbarui`,
        )
      })
    },
  },
})
