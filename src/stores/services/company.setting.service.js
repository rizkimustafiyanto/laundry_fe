// store/companyProfileStore.js
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
