import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'
import { notifySuccess, notifyError } from '@/utils/notify'
import socket from '@/plugins/socket'

export const usePaymentStore = createStoreBuilder({
  storeId: 'paymentStore',
  endpoint: '/payments',
  defaultPayload: {
    paymentMethod: '',
    note: '',
    amountPaid: '',
  },
  customActions: {
    async addPayment(transactionId, payload) {
      try {
        const res = await api.post(`/payments/${transactionId}/payment`, payload)
        notifySuccess('Pembayaran berhasil ditambahkan')
        return res.data.data
      } catch (error) {
        notifyError(error, 'Gagal menambahkan pembayaran')
        throw error
      }
    },

    async refundPayment(transactionId, note = null) {
      try {
        const res = await api.post(`/payments/${transactionId}/refund`, { note })
        notifySuccess('Refund berhasil diproses')
        return res.data.data
      } catch (error) {
        notifyError(error, 'Gagal memproses refund')
        throw error
      }
    },

    async voidPayment(transactionId) {
      try {
        const res = await api.post(`/payments/${transactionId}/void`)
        notifySuccess('Pembayaran berhasil dibatalkan')
        return res.data.data
      } catch (error) {
        notifyError(error, 'Gagal membatalkan pembayaran')
        throw error
      }
    },

    async confirmPayment(transactionId, payload) {
      try {
        await notifyConfirm({
          title: 'Confirmation',
          message: `Apakah Anda yakin ?`,
        })

        const res = await api.post(`/payments/${transactionId}/confirm`, payload)
        notifySuccess('Pembayaran berhasil ditambahkan')
        return res.data.data
      } catch (error) {
        console.log(error)
        if (error !== 'cancelled') {
          notifyError(error, `Gagal menghapus data`)
        }
      }
    },

    listenPaymentUpdates() {
      socket.on('transaction_updated', (updatedTransaction) => {
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

export const useRunningPreviewStore = createStoreBuilder({
  storeId: 'runningPreviewStore',
  endpoint: '/payments/preview/running',
  defaultPayload: {},
  customActions: {
    async fetchRunningPreview() {
      try {
        const res = await api.get('/payments/preview/running')
        this.item = res.data.data
      } catch (error) {
        notifyError(error, 'Gagal memuat preview pembayaran berjalan')
        throw error
      }
    },
    listenPaymentUpdates() {
      socket.on('transaction_updated', (updatedTransaction) => {
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

export const useTransactionPreviewStore = createStoreBuilder({
  storeId: 'transactionPreviewStore',
  endpoint: '/payments',
  defaultPayload: {},
  customActions: {
    async fetchTransactionPreview(transactionId) {
      try {
        const res = await api.get(`/payments/${transactionId}/preview`)
        this.item = res.data.data
      } catch (error) {
        notifyError(error, 'Gagal memuat preview transaksi')
        throw error
      }
    },

    async fetchInvoiceStatus(transactionId) {
      try {
        const res = await api.get(`/payments/${transactionId}/status`)
        this.item = res.data.data
      } catch (error) {
        notifyError(error, 'Gagal memuat status invoice')
        throw error
      }
    },
    listenPaymentUpdates() {
      socket.on('transaction_updated', (updatedTransaction) => {
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
