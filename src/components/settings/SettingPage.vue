<template>
  <div>
    <h1 class="text-3xl font-bold mb-6" :class="themeClass.text.secondary">Admin Settings</h1>

    <BaseTab :tabs="tabs" v-model:activeTab="activeTab" variant="underline" color="sky" />

    <div v-if="activeTab === 'profile'" class="flex flex-col gap-8">
      <div>
        <h3
          class="text-lg font-semibold flex items-center gap-2 mb-3"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-building mr-1', themeClass.icon.teal]"></i>
          Profil Perusahaan
        </h3>
        <CompanyProfileSection />
      </div>

      <div>
        <h3
          class="text-lg font-semibold flex items-center gap-2 mb-3"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-file-lines mr-1', themeClass.icon.teal]"></i>
          Konten (About, Layanan, Testimoni, dst)
        </h3>
        <CompanyContentSection />
      </div>

      <div>
        <h3
          class="text-lg font-semibold flex items-center gap-2 mb-3"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-images mr-1', themeClass.icon.teal]"></i>
          Media Perusahaan (Gallery, Sponsor, Avatar, dll)
        </h3>
        <CompanyMediaSection />
      </div>
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
import CompanyMediaSection from './sections/CompanyMediaSection.vue'
import CompanyProfileSection from './sections/CompanyProfileSection.vue'
import CompanyContentSection from './sections/CompanyContentSection.vue'
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
