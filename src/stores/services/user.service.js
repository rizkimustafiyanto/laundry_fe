// src/stores/users.js
import socket from '@/plugins/socket'

export const useUserStore = createStoreBuilder({
  storeId: 'userStore',
  endpoint: '/users',
  defaultPayload: {
    name: '',
    email: '',
    gender: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bio: '',
    password: '',
    role: '',
    isActive: '',
  },
  customGetters: {
    totalUsers: (state) => state.items.length,
  },
  customActions: {
    async fetchProfile() {
      const res = await api.get('/users/profile')
      this.item = res.data.data
    },

    async updateProfile(payload) {
      try {
        const res = await api.put('/users/profile', payload)
        this.item = res.data.data
        notifySuccess('Data berhasil diperbarui')
      } catch (err) {
        notifyError(err, `Gagal memperbarui profile`)
      }
    },

    async updateProfileWithItem(payload) {
      try {
        const formData = new FormData()
        for (const key in payload) {
          formData.append(key, payload[key])
        }
        const res = await apiForm.put('/users/profile', formData)
        this.item = res.data.data
        notifySuccess('Data berhasil diperbarui')
      } catch (err) {
        notifyError(err, `Gagal memperbarui profile`)
      }
    },

    listenUserUpdates() {
      socket.on('user_updated', (updatedUser) => {
        const updatedData = updatedUser.user || updatedUser
        const index = this.items.findIndex((u) => u.id === updatedData.id)

        if (index !== -1) {
          this.items.splice(index, 1, updatedData)
        } else {
          this.items.push(updatedData)
        }

        if (updatedData.id == this.item?.id) {
          this.item = updatedData
        }
      })

      socket.on('user_created', (newUser) => {
        const newData = newUser.user || newUser
        const exists = this.items.some((u) => u.id === newData.id)
        if (!exists) {
          this.items.unshift(newData)
        }
      })

      socket.on('user_deleted', (deletedUser) => {
        const deletedData = deletedUser.user || deletedUser
        const index = this.items.findIndex((u) => u.id === deletedData.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }

        if (deletedData.id == this.item?.id) {
          this.item = {}
        }
      })
    },
  },
})
