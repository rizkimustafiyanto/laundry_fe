<template>
  <div>
    <h1 class="text-3xl font-bold mb-6" :class="themeClass.text.secondary">Admin Settings</h1>

    <BaseTab :tabs="tabs" v-model:activeTab="activeTab" variant="underline" color="sky" />

    <div v-if="activeTab === 'profile'" class="flex flex-col gap-8">
      <CompanyProfileSection />
      <CompanyGallerySection />
      <CompanySponsorSection />
    </div>
    <div v-if="activeTab === 'pricing-service'">
      <PricingSection />
    </div>
    <div v-if="activeTab === 'service-type'">
      <ServiceItemTypeSetting />
    </div>
  </div>
</template>

<script setup>
import CompanyGallerySection from './sections/CompanyGallerySection.vue'
import CompanyProfileSection from './sections/CompanyProfileSection.vue'
import CompanySponsorSection from './sections/CompanySponsorSection.vue'
import PricingSection from './sections/PricingSection.vue'
import ServiceItemTypeSetting from './sections/ServiceItemTypeSetting.vue'

const themeClass = useThemeClass()
const activeTab = ref('profile')

const tabs = [
  { label: 'Company', value: 'profile' },
  { label: 'Service & Item', value: 'service-type' },
  { label: 'Pricing & Services', value: 'pricing-service' },
]
</script>
