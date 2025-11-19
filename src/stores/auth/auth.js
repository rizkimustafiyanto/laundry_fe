import { defineStore } from 'pinia'
import api from '@/utils/api'
import socket from '@/plugins/socket'
import { notifySuccess, notifyError } from '@/utils/notify'
import router from '@/router'

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
          isActive: data.isActive,
        }
        this.token = data.token
        this.role = data.role

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        localStorage.setItem('role', this.role)

        router.push({ name: 'DashboardHome' })

        notifySuccess(res.data.message)
      } catch (err) {
        const message = err.response?.data?.message || 'Email atau password salah'
        notifyError(err, message)
      }
    },

    async loginWithGoogle(idToken) {
      try {
        const res = await api.post('/auth/google', { idToken })
        const data = res.data.data

        this.user = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          photo: data.photo,
          bio: data.bio,
          isActive: data.isActive,
        }
        this.token = data.token
        this.role = data.role

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        localStorage.setItem('role', this.role)

        router.push({ name: 'DashboardHome' })

        notifySuccess(res.data.message)
      } catch (err) {
        const message = err.response?.data?.message || 'Login Google gagal'
        notifyError(err, message)
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
        await api.post('/auth/register', payload)
        notifySuccess('Register berhasil! Silakan cek email untuk verifikasi.')
        return true
      } catch (err) {
        const message =
          err.response?.data?.message || 'Registrasi gagal. Periksa kembali data Anda.'
        notifyError(err, message)
      }
    },

    async forgetPassword(email) {
      try {
        const res = await api.post('/auth/forgot-password', { email })
        notifySuccess(res.data.message || 'Link reset sudah dikirim ke email Anda')
        return res
      } catch (err) {
        notifyError(err, 'Gagal mengirim email reset password')
      }
    },

    async changePassword(payload) {
      try {
        const res = await api.post('/auth/change-password', payload)
        notifySuccess(res.data.message || 'Password berhasil diubah')
        router.push({ name: 'Login' })
      } catch (err) {
        notifyError(err, 'Gagal mengubah password')
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

    async requestEmailVerification() {
      try {
        const res = await api.post('/auth/email/request-verification')
        notifySuccess(res.data.message || 'Email verifikasi telah dikirim')
      } catch (err) {
        notifyError(err, 'Gagal mengirim email verifikasi')
      }
    },

    async verifingEmail(token) {
      try {
        const res = await api.post('/auth/email/verify', { token })
        notifySuccess(res.data.message || 'Email berhasil diverifikasi!')
      } catch (err) {
        notifyError(err, 'Token verifikasi tidak valid')
      }
    },

    listenAuthUpdates() {
      socket.on('user_updated', (updatedUser) => {
        const updatedData = updatedUser.user || updatedUser

        if (this.user?.id === updatedData.id && updatedData.isActive === false) {
          notifyError('Akun Anda telah dinonaktifkan oleh admin')
          this.logout()

          router.push({ name: 'Login' })
        }
      })
    },
  },
})
