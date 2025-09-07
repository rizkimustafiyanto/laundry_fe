// src/stores/transaction.js
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
      serviceCharge: 0,
      deliveryFee: 0,
      pickupFee: 0,
      tax: 0,
      discount: 0,
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
      const runningTransactions = state.items.filter(
        (t) => !['completed', 'cancelled'].includes(t.status.toLowerCase()),
      )
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
      await this.fetchItems({ page: 1 }, { status: status })
    },

    async fetchTransactionById(transactionId) {
      const res = await api.get(`/transactions/${transactionId}`)
      this.item = res.data.data
    },

    async updateTransactionStatus(transactionId, status) {
      await api.put(`/transactions/${transactionId}/status`, { status })
    },

    async exportTransactions(payload) {
      const res = await api.post('/transactions/export', payload, { responseType: 'blob' })
      return res.data
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
    },
  },
})
