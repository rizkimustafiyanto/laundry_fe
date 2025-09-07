// store/companyProfileStore.js
import { createStoreBuilder } from './store.builder.service'

export const useCompanyProfileStore = createStoreBuilder({
  storeId: 'company-profiles',
  endpoint: '/company-profiles',
  defaultPayload: {
    name: '',
    logoUrl: '',
    about: '',
    email: '',
    phone: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    tiktokUrl: '',
  },
})

export const useCompanyGalleryStore = createStoreBuilder({
  storeId: 'company-galleries',
  endpoint: '/company-galleries',
  defaultPayload: { companyId: '', imageUrl: '', caption: '' },
})

export const useCompanySponsorStore = createStoreBuilder({
  storeId: 'company-sponsors',
  endpoint: '/company-sponsors',
  defaultPayload: { companyId: '', sponsorName: '', logoUrl: '', websiteUrl: '' },
})
