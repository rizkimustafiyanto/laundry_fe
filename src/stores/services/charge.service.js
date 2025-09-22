// src/stores/charge.js
import { createStoreBuilder } from './store.builder.service'
import api from '@/utils/api'

export const useChargeStore = createStoreBuilder({
  storeId: 'chargeStore',
  endpoint: '/charges',
  defaultPayload: {
    category: '',
    type: '',
    value: 0,
    isEnabled: true,
  },
  customGetters: {
    categories: (state) =>
      state.items.map((c) => c.category).filter((v, i, a) => a.indexOf(v) === i),
    types: (state) => state.items.map((c) => c.type).filter((v, i, a) => a.indexOf(v) === i),
  },
  customActions: {
    async upsertCharge(payload) {
      if (payload.id) {
        await api.put(`/charges/${payload.id}`, payload)
      } else {
        await api.post('/charges', payload)
      }
      await this.fetchItems()
    },
  },
})
