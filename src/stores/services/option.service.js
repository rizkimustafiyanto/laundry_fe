// src/stores/options.js
import { toValueLabelOptions } from '@/utils/formatters'
import api from '@/utils/api'
import { notifyError } from '@/utils/notify'
import socket from '@/plugins/socket'
import { createStoreBuilder } from './store.builder.service'

// ==============================
// SERVICE TYPES STORE
// ==============================
export const useServiceTypeStore = createStoreBuilder({
  storeId: 'serviceTypeStore',
  endpoint: '/options/service-types',
  defaultPayload: { name: '', description: '' },
  customGetters: {
    options: (state) => toValueLabelOptions(state.items) || [],
  },
  customActions: {
    listenServiceTypeUpdates() {
      socket.on('service_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('service_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('service_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

// ==============================
// ITEM TYPES STORE
// ==============================
export const useItemTypeStore = createStoreBuilder({
  storeId: 'itemTypeStore',
  endpoint: '/options/item-types',
  defaultPayload: { name: '', description: '' },
  customGetters: {
    options: (state) => toValueLabelOptions(state.items) || [],
  },
  customActions: {
    listenItemTypeUpdates() {
      socket.on('item_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('item_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('item_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

// ==============================
// ENUM OPTIONS (fetch-only, no CRUD)
// ==============================
function createEnumStore(storeId, endpoint) {
  return createStoreBuilder({
    storeId,
    endpoint,
    defaultPayload: {},
    customGetters: {
      options: (state) => toValueLabelOptions(state.items) || [],
    },
    customActions: {
      async fetch() {
        try {
          const res = await api.get(endpoint)
          this.items = res.data.data
        } catch (err) {
          notifyError(err, `Gagal ambil ${storeId}`)
        }
      },
    },
  })
}

export const useStatusStore = createEnumStore('statusStore', '/options/status')
export const usePaymentMethodStore = createEnumStore(
  'paymentMethodStore',
  '/options/payment-method',
)
export const useRolesStore = createEnumStore('rolesStore', '/options/roles')
export const useGendersStore = createEnumStore('gendersStore', '/options/genders')
export const useChargeCategoryStore = createEnumStore('chargeCategoryStore', '/charges/category')
export const useChargeTypeStore = createEnumStore('chargeTypeStore', '/charges/type')

// ==============================
// SOCKET LISTENER
// ==============================
export function listenOptionsUpdates() {
  socket.on('options_update', () => {
    useServiceTypeStore().fetchItems()
    useItemTypeStore().fetchItems()
  })
}
