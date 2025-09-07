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

    listenUserUpdates() {
      socket.on('addresses_update', () => {
        this.fetchItems()
      })
    },
  },
})
