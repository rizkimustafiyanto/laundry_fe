// src/stores/payment.js
import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notifyError, notifySuccess } from '@/utils/notify'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    runningPreview: null,
    transactionPreview: null,
    invoiceStatus: null,
  }),

  actions: {
    async addPayment(transactionId, payload) {
      try {
        const res = await api.post(`/payments/${transactionId}/payment`, payload)
        notifySuccess('Pembayaran berhasil ditambahkan')
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal menambahkan pembayaran')
        throw err
      }
    },

    async fetchRunningPreview() {
      try {
        const res = await api.get('/payments/preview/running')
        this.runningPreview = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil preview tagihan berjalan')
        throw err
      }
    },

    async fetchTransactionPreview(transactionId) {
      try {
        const res = await api.get(`/payments/${transactionId}/preview`)
        this.transactionPreview = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil preview transaksi')
        throw err
      }
    },

    async fetchInvoiceStatus(transactionId) {
      try {
        const res = await api.get(`/payments/${transactionId}/status`)
        this.invoiceStatus = res.data.data
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil status invoice')
        throw err
      }
    },

    async refundPayment(transactionId, note = null) {
      try {
        const res = await api.post(`/payments/${transactionId}/refund`, { note })
        notifySuccess('Pembayaran berhasil direfund')
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal melakukan refund pembayaran')
        throw err
      }
    },

    async voidPayment(transactionId) {
      try {
        const res = await api.post(`/payments/${transactionId}/void`)
        notifySuccess('Pembayaran berhasil dibatalkan (void)')
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal melakukan void pembayaran')
        throw err
      }
    },
  },
})
