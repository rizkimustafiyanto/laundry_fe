import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { useUIStore } from '@/stores/component/ui.js'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    pickedUpRequest: [],
    selectedOrder: null,
    summary: {
      todayTotal: 0,
      statusCount: {},
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    filterStatus: null,
    filterList: [],
    search: '',
    serviceTypeList: [],
  }),
  getters: {
    filteredOrders(state) {
      const keyword = state.search.toLowerCase()
      return state.orders
        .filter((order) => (state.filterStatus ? order.status === state.filterStatus : true))
        .filter(
          (order) =>
            order.invoiceNumber?.toLowerCase().includes(keyword) ||
            order.customer?.name?.toLowerCase().includes(keyword),
        )
    },
  },
  actions: {
    async createOrder(payload) {
      let res
      try {
        res = await api.post('/laundry/transactions', payload)
        this.orders.push(res.data)
        useUIStore().show('success', res.data.message)
        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to create order'
        useUIStore().show('error', message)
      }
    },

    async updateOrderStatus(transactionId, newStatus) {
      let res
      try {
        res = await api.put(`/laundry/transactions/${transactionId}/status`, { newStatus })
        if (this.selectedOrder?.id === transactionId) this.selectedOrder = res.data
        const index = this.orders.findIndex((o) => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        useUIStore().show('success', res.data.message)
        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to update status'
        useUIStore().show('error', message)
      }
    },

    async deleteOrderSoft(transactionId) {
      let res
      try {
        res = await api.delete(`/laundry/transactions/${transactionId}/soft`)
        useUIStore().show('success', res.data.message)
        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete'
        useUIStore().show('error', message)
      }
    },

    async deleteOrderHard(transactionId) {
      let res
      try {
        res = await api.delete(`/laundry/transactions/${transactionId}/hard`)
        useUIStore().show('success', res.data.message)
        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete'
        useUIStore().show('error', message)
      }
    },

    async updateOrderDetail(transactionId, payload) {
      let res
      try {
        res = await api.put(`/laundry/transactions/${transactionId}/detail`, payload)
        useUIStore().show('success', res.data.message)
        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to update detail'
        useUIStore().show('error', message)
      }
    },

    async fetchOrderById(transactionId) {
      let res
      try {
        res = await api.get(`/laundry/transactions/${transactionId}`)
        this.selectedOrder = res.data
        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch order'
        useUIStore().show('error', message)
      }
    },

    async fetchAllOrders() {
      let res
      try {
        res = await api.get('/laundry/transactions', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            status: this.filterStatus,
            search: this.search,
          },
        })
        this.orders = res.data.data?.orders
        this.pagination.total = res.data.data?.total
        this.pagination.from = res.data.data?.from
        this.pagination.to = res.data.data?.to
        this.pickedUpRequest = this.orders.filter(
          (order) => order.status === 'REGISTERED' && order.pickupRequested === true,
        )
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch orders'
        useUIStore().show('error', message)
      }
    },

    async fetchOrderSummary() {
      let res
      try {
        res = await api.get('/laundry/transactions/summary')
        this.summary = res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch summary'
        useUIStore().show('error', message)
      }
    },

    async fetchFilterListStatus() {
      let res
      try {
        res = await api.get('/laundry/transactions/status-filter')
        this.filterList = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
        }))
        this.filterList.unshift({ label: 'ALL', value: '' })
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch list'
        useUIStore().show('error', message)
      }
    },

    setFilterStatus(status) {
      this.filterStatus = status
    },

    async fetchServiceType() {
      try {
        const res = await api.get('/laundry/transactions/service-type')
        this.serviceTypeList = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
        }))
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch list'
        useUIStore().show('error', message)
      }
    },

    async addPaymentToOrder(transactionId, paymentData, totalAmount) {
      let res
      try {
        res = await api.put(`/laundry/transactions/${transactionId}/add-payment`, {
          paymentData,
          totalAmount,
        })
        if (this.selectedOrder?.id === transactionId) this.selectedOrder = res.data
        const index = this.orders.findIndex((o) => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        useUIStore().show('success', res.data.message)
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to add payment'
        useUIStore().show('error', message)
      }
    },

    listenOrderUpdates() {
      socket.on('order_updated', () => {
        this.fetchAllOrders()
        this.fetchOrderSummary()
      })
    },
  },
})
