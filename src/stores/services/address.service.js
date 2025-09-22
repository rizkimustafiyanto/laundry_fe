import { createStoreBuilder } from './store.builder.service'
import socket from '@/plugins/socket'

const defaultPayload = {
  label: '',
  addressLine: '',
  notes: '',
  latitude: '',
  longitude: '',
}

export const useAddressStore = createStoreBuilder({
  storeId: 'addresses',
  endpoint: '/users/addresses',
  defaultPayload,

  customActions: {
    async fetchByCustomer(customerId) {
      await this.fetchItems({ page: 1 }, { customerId })
    },

    clearData() {
      this.items = []
    },

    async updateAddressesPrimary(id) {
      try {
        await api.put(`/users/addresses/${id}/set-primary`)
        notifySuccess('Alamat berhasil dijadikan utama')
      } catch (err) {
        notifyError(err, 'Gagal mengubah alamat utama')
      }
    },

    listenAddressUpdates() {
      socket.on('address_updated', (updatedaddresses) => {
        const index = this.items.findIndex((t) => t.id === updatedaddresses.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedaddresses)
        } else {
          this.items.push(updatedaddresses)
        }
      })

      socket.on('address_created', (newaddresses) => {
        const exists = this.items.some((t) => t.id === newaddresses.id)
        if (!exists) {
          this.items.unshift(newaddresses)
        }
      })

      socket.on('address_deleted', (deletedaddresses) => {
        const index = this.items.findIndex((t) => t.id === deletedaddresses.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})
