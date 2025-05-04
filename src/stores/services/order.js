import { defineStore } from 'pinia'
import api from '@/api'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
  }),
  actions: {
    async fetchOrders() {
      const res = await api.get('/orders')
      this.orders = res.data
    },
    async createOrder(payload) {
      await api.post('/orders', payload)
      await this.fetchOrders()
    },
    async updateOrder(id, payload) {
      await api.put(`/orders/${id}`, payload)
      await this.fetchOrders()
    },
    async deleteOrder(id) {
      await api.delete(`/orders/${id}`)
      await this.fetchOrders()
    },
  },
})
