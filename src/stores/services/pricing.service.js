// src/stores/pricing.js
import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'
import socket from '@/plugins/socket'

export const usePricingStore = createStoreBuilder({
  storeId: 'pricingStore',
  endpoint: '/pricing',
  defaultPayload: {
    serviceTypeId: '',
    itemTypeId: '',
    pricePerKg: 0,
  },
  customGetters: {
    totalItems: (state) => state.items.length,
  },
  customActions: {
    async fetchPricingByCombination(serviceTypeId, itemTypeId) {
      const res = await api.get('/pricing/combination/check', {
        params: { serviceTypeId, itemTypeId },
      })
      return res.data.data
    },

    listenPricingUpdates() {
      socket.on('pricing_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('pricing_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('pricing_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})
