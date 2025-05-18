import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
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
    loading: false,
    error: null,
  }),
  getters: {
    filteredOrders(state) {
      const keyword = state.search.toLowerCase()
      return state.orders
        .filter((order) =>
          state.filterStatus ? order.status === state.filterStatus : true
        )
        .filter((order) =>
          order.invoiceNumber.toLowerCase().includes(keyword) ||
          order.customer?.name?.toLowerCase().includes(keyword)
        )
    },
  },
  actions: {
    // Create order (without payment, payment added later)
    async createOrder(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/laundry/transactions', payload)  // Path diperbarui
        this.orders.push(res.data)  // Menambahkan transaksi yang baru dibuat
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create order'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Update order status
    async updateOrderStatus(transactionId, newStatus) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/status`, {
          newStatus,  // Tidak lagi membutuhkan transactionId dalam body
        })
        if (this.selectedOrder?.id === transactionId) {
          this.selectedOrder = res.data
        }
        // Update the list of orders
        const index = this.orders.findIndex(o => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update status'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Fetch order by ID
    async fetchOrderById(transactionId) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(`/laundry/transactions/${transactionId}`)  // Path diperbarui
        this.selectedOrder = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch order'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Fetch all orders with pagination
    async fetchAllOrders() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/laundry/transactions', {  // Path diperbarui
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            status: this.filterStatus,  // Add filtering by status
            search: this.search,         // Add search functionality
          },
        })
        this.orders = res.data.data?.orders
        this.pagination.total = res.data.data?.total
        this.pagination.from = res.data.data?.from
        this.pagination.to = res.data.data?.to
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch orders'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Fetch order summary (daily totals, counts by status)
    async fetchOrderSummary() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/laundry/transactions/summary')  // Path diperbarui
        this.summary = res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch summary'
      } finally {
        this.loading = false
      }
    },

    // Fetch the list of statuses for filter options
    async fetchFilterListStatus() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/laundry/transactions/status-filter')  // Path diperbarui
        this.filterList = res.data.map((item) => ({
          label: item,
          value: item
        }))
        this.filterList.unshift({ label: 'ALL', value: '' })
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch list'
      } finally {
        this.loading = false
      }
    },

    // Set filter status for orders
    setFilterStatus(status) {
      this.filterStatus = status
    },

    // Update payment for an order
    async addPaymentToOrder(transactionId, paymentData, totalAmount) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/add-payment`, {  // Path diperbarui
          paymentData,
          totalAmount
        })
        // Update the selected order and the orders list with the new payment data
        if (this.selectedOrder?.id === transactionId) {
          this.selectedOrder = res.data
        }
        const index = this.orders.findIndex(o => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add payment'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
