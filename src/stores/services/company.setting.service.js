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
  },
})
