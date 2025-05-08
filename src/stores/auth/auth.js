import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await api.post('/auth/login', { email, password })
        this.user = res.data.user
        this.token = res.data.token
        this.role = res.data.user.role

        localStorage.setItem('role', this.role)
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)

        return {
          status: res.status,
          message: 'Login berhasil',
          user: res.data.user,
        }
      } catch (err) {
        const status = err.response?.status || 500
        const message = err.response?.data?.message || 'Terjadi kesalahan server'

        return {
          status,
          message,
        }
      }
    },

    checkTokenValidity() {
      if (!this.token) return false

      const decodedToken = JSON.parse(atob(this.token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        this.logout()
        return false
      }
      return true
    },

    async register(payload) {
      try {
        const res = await api.post('/auth/register', payload)

        return {
          status: res.status,
          message: 'Register berhasil',
          user: res.data.user,
        }
      } catch (error) {
        if (error.response) {
          return {
            status: error.response.status,
            message: error.response.data.message,
            missingFields: error.response.data.missingFields || [],
          }
        } else if (error.request) {
          return {
            status: 500,
            message: 'Tidak ada respons dari server',
          }
        } else {
          return {
            status: 500,
            message: `Terjadi kesalahan: ${error.message}`,
          }
        }
      }
    },

    async forgetPassword(email) {
      try {
        const res = await api.post('/auth/forgot-password', { email })

        return {
          status: res.status,
          message: res.data.message || 'Link reset password telah dikirim ke email Anda',
        }
      } catch (err) {
        const status = err.response?.status || 500
        const message = err.response?.data?.message || 'Terjadi kesalahan saat mengirim email reset'

        return {
          status,
          message,
        }
      }
    },

    async changePassword(payload) {
      try {
        const res = await api.post('/auth/change-password', payload)

        return {
          status: res.status,
          message: res.data.message || 'Link reset password telah dikirim ke email Anda',
        }
      } catch (err) {
        const status = err.response?.status || 500
        const message = err.response?.data?.message || 'Terjadi kesalahan saat mengirim email reset'

        return {
          status,
          message,
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.role = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
  },
})
