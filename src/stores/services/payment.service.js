import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'
import { notifySuccess, notifyError } from '@/utils/notify'

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
  },
})
