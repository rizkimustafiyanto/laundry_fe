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
      socket.on('pricing_updated', () => {
        this.fetchItems()
      })
    },
  },
})
