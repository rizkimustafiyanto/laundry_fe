import socket from '@/plugins/socket'
import { createStoreBuilder } from './store.builder.service'

export const useCompanyProfileStore = createStoreBuilder({
  storeId: 'company-profiles',
  endpoint: '/company-profiles',
  defaultPayload: {
    name: '',
    logoUrl: '',
    heroImageUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    ctaText: '',
    ctaUrl: '',
    about: '',
    email: '',
    phone: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    tiktokUrl: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
  },
  customActions: {
    listenPortoUpdates() {
      socket.on('porto_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('porto_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('porto_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

export const useCompanyMediaStore = createStoreBuilder({
  storeId: 'company-medias',
  endpoint: '/company-medias',
  defaultPayload: {
    companyId: '',
    type: '',
    url: '',
    title: '',
    description: '',
    order: 0,
  },
  customActions: {
    listenMediaUpdates() {
      socket.on('media_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('media_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('media_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

export const useCompanyContentStore = createStoreBuilder({
  storeId: 'company-contents',
  endpoint: '/company-contents',
  defaultPayload: {
    companyId: '',
    type: '',
    title: '',
    subtitle: '',
    description: '',
    rating: null,
    icon: '',
    mediaId: null,
    link: '',
    order: 0,
  },
  customActions: {
    listenContentUpdates() {
      socket.on('content_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('content_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('content_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})

export const useCompanyReviewStore = createStoreBuilder({
  storeId: 'companyReview',

  endpoint: '/company-review',

  defaultPayload: {
    rating: null,
    comment: '',
  },

  customGetters: {
    averageRating: (state) => {
      if (!state.items.length) return 0
      const total = state.items.reduce((sum, r) => sum + (r.rating || 0), 0)
      return (total / state.items.length).toFixed(1)
    },
  },

  customActions: {
    async fetchByCompany(companyId, query = {}) {
      try {
        const res = await api.get(`/company-review/company/${companyId}`, {
          params: {
            page: query.page || this.meta.currentPage,
            limit: query.limit || this.meta.limit,
          },
        })

        this.items = res.data.data || []
        this.meta = res.data.meta || this.meta
      } catch (err) {
        notifyError(err, 'Gagal mengambil company reviews')
      }
    },

    async createReview(companyId) {
      try {
        await api.post(`/company-review/company/${companyId}`, this.formPayload)
      } catch (err) {
        notifyError(err, 'Gagal mengirim review')
      }
    },

    async fetchRatingSummary(companyId) {
      try {
        const res = await api.get(`/company-review/company/${companyId}/summary`)
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil rating summary')
      }
    },

    async fetchRatingUser(companyId, userId) {
      try {
        const res = await api.get(`/company-review/company/${companyId}/user/${userId}`)
        return res.data.data
      } catch (err) {
        notifyError(err, 'Gagal mengambil rating summary')
      }
    },

    hasUserReviewed(userId) {
      return this.items.some((r) => r.userId === userId)
    },

    listenReviewUpdates() {
      socket.on('review_created', (newTransaction) => {
        const exists = this.items.some((t) => t.id === newTransaction.id)
        if (!exists) {
          this.items.unshift(newTransaction)
        }
      })

      socket.on('review_updated', (updatedTransaction) => {
        const index = this.items.findIndex((t) => t.id === updatedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1, updatedTransaction)
        } else {
          this.items.push(updatedTransaction)
        }
      })

      socket.on('review_deleted', (deletedTransaction) => {
        const index = this.items.findIndex((t) => t.id === deletedTransaction.id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      })
    },
  },
})
