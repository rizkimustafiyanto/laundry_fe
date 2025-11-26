// src/stores/charge.js
import socket from '@/plugins/socket'
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
    listenChargeUpdates() {
      socket.on('charge_upsert', (transaction) => {
        const index = this.items.findIndex((t) => t.id === transaction.id)

        if (index !== -1) {
          this.items.splice(index, 1, transaction)
        } else {
          this.items.unshift(transaction)
        }
      })

      socket.on('charge_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})
