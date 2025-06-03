import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifySuccess, notifyError } from '@/utils/notify'

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
      try {
        const res = await api.post('/laundry/transactions', payload)
        this.orders.push(res.data)
        notifySuccess(res.data.message)
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal membuat pesanan')
      }
    },

    async updateOrderStatus(transactionId, newStatus) {
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/status`, { newStatus })
        if (this.selectedOrder?.id === transactionId) this.selectedOrder = res.data
        const index = this.orders.findIndex((o) => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        notifySuccess(res.data.message)
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui status')
      }
    },

    async deleteOrderSoft(transactionId) {
      try {
        const res = await api.delete(`/laundry/transactions/${transactionId}/soft`)
        notifySuccess(res.data.message)
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal menghapus pesanan (soft delete)')
      }
    },

    async deleteOrderHard(transactionId) {
      try {
        const res = await api.delete(`/laundry/transactions/${transactionId}/hard`)
        notifySuccess(res.data.message)
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal menghapus pesanan secara permanen')
      }
    },

    async updateOrderDetail(transactionId, payload) {
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/detail`, payload)
        notifySuccess(res.data.message)
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal memperbarui detail pesanan')
      }
    },

    async fetchOrderById(transactionId) {
      try {
        const res = await api.get(`/laundry/transactions/${transactionId}`)
        this.selectedOrder = res.data
        return res.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil detail pesanan')
      }
    },

    async fetchAllOrders() {
      try {
        const res = await api.get('/laundry/transactions', {
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
        notifyError(err, 'Gagal mengambil daftar pesanan')
      }
    },

    async fetchOrderSummary() {
      try {
        const res = await api.get('/laundry/transactions/summary')
        this.summary = res.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil ringkasan pesanan')
      }
    },

    async fetchFilterListStatus() {
      try {
        const res = await api.get('/laundry/transactions/status-filter')
        this.filterList = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
        }))
        this.filterList.unshift({ label: 'ALL', value: '' })
      } catch (err) {
        notifyError(err, 'Gagal mengambil daftar filter status')
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
        notifyError(err, 'Gagal mengambil daftar layanan')
      }
    },

    async addPaymentToOrder(transactionId, paymentData, totalAmount) {
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/add-payment`, {
          paymentData,
          totalAmount,
        })
        if (this.selectedOrder?.id === transactionId) this.selectedOrder = res.data
        const index = this.orders.findIndex((o) => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        notifySuccess(res.data.message)
      } catch (err) {
        notifyError(err, 'Gagal menambahkan pembayaran')
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
