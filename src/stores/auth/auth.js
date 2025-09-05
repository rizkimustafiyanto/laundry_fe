import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await api.post('/auth/login', { email, password })

        const data = res.data.data

        this.user = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          photo: data.photo,
          bio: data.bio,
        }
        this.token = data.token
        this.role = data.role

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        localStorage.setItem('role', this.role)

        return {
          status: res.status,
          message: res.data.message,
          user: this.user,
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

      try {
        const parts = this.token.split('.')
        if (parts.length !== 3) return false

        const payload = JSON.parse(atob(parts[1]))
        const exp = payload.exp
        if (!exp) return false

        const currentTime = Math.floor(Date.now() / 1000)
        return exp > currentTime
      } catch (error) {
        console.error('Invalid token format', error)
        return false
      }
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
