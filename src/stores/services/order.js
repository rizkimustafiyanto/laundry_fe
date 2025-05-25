import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'

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
    loading: false,
    error: null,
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
    // Create order (without payment, payment added later)
    async createOrder(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/laundry/transactions', payload)
        this.orders.push(res.data)
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
          newStatus,
        })
        if (this.selectedOrder?.id === transactionId) {
          this.selectedOrder = res.data
        }
        // Update the list of orders
        const index = this.orders.findIndex((o) => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update status'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteOrderSoft(transactionId) {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete(`/laundry/transactions/${transactionId}/soft`)
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteOrderHard(transactionId) {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete(`/laundry/transactions/${transactionId}/hard`)
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateOrderDetail(transactionId, payload) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/detail`, payload)
        console.log(res)
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
        const res = await api.get(`/laundry/transactions/${transactionId}`)
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
        const res = await api.get('/laundry/transactions/summary')
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
        const res = await api.get('/laundry/transactions/status-filter')
        this.filterList = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
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

    async fetchServiceType() {
      try {
        const res = await api.get('/laundry/transactions/service-type')
        this.serviceTypeList = res.data.map((item) => ({
          label: item.replace(/_/g, ' '),
          value: item,
        }))
      } catch (err) {
        this.error = err.response.data.message || 'Failed to fetch list'
      }
    },

    // Update payment for an order
    async addPaymentToOrder(transactionId, paymentData, totalAmount) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/laundry/transactions/${transactionId}/add-payment`, {
          paymentData,
          totalAmount,
        })

        if (this.selectedOrder?.id === transactionId) {
          this.selectedOrder = res.data
        }
        const index = this.orders.findIndex((o) => o.id === transactionId)
        if (index !== -1) this.orders[index] = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add payment'
        throw err
      } finally {
        this.loading = false
      }
    },

    listenOrderUpdates() {
      socket.on('order_updated', () => {
        this.fetchAllOrders()
        this.fetchOrderSummary()
      })
      // socket.on('user_updated', (updatedUser) => {
      //   const updatedData = updatedUser.user
      //   const index = this.users.data.findIndex((u) => u.id === updatedData.id)

      //   if (index !== -1) {
      //     this.users.data.splice(index, 1, updatedData)
      //   }
      // })
    },
  },
})
