import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'

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
      const res = await api.post(`/payments/${transactionId}/payment`, payload)
      return res.data.data
    },

    async refundPayment(transactionId, note = null) {
      const res = await api.post(`/payments/${transactionId}/refund`, { note })
      return res.data.data
    },

    async voidPayment(transactionId) {
      const res = await api.post(`/payments/${transactionId}/void`)
      return res.data.data
    },
  },
})

export const useRunningPreviewStore = createStoreBuilder({
  storeId: 'runningPreviewStore',
  endpoint: '/payments/preview/running',
  defaultPayload: {},
  customActions: {
    async fetchRunningPreview() {
      const res = await api.get('/payments/preview/running')
      this.item = res.data.data
    },
  },
})

export const useTransactionPreviewStore = createStoreBuilder({
  storeId: 'transactionPreviewStore',
  endpoint: '/payments',
  defaultPayload: {},
  customActions: {
    async fetchTransactionPreview(transactionId) {
      const res = await api.get(`/payments/${transactionId}/preview`)
      this.item = res.data.data
    },

    async fetchInvoiceStatus(transactionId) {
      const res = await api.get(`/payments/${transactionId}/status`)
      this.item = res.data.data
    },
  },
})
