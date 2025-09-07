<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6" :class="themeClass.text.secondary">Admin Settings</h1>

    <!-- Tabs -->
    <nav class="flex space-x-4 mb-6 border-b" :class="themeClass.border.sky">
      <button :class="getTabClass('profile')" @click="activeTab = 'profile'">
        Company Profile
      </button>
      <button :class="getTabClass('gallery')" @click="activeTab = 'gallery'">Gallery</button>
      <button :class="getTabClass('sponsor')" @click="activeTab = 'sponsor'">Sponsor</button>
    </nav>

    <!-- Tab Contents -->
    <div>
      <CompanyProfileSection v-if="activeTab === 'profile'" />
      <CompanyGallerySection v-if="activeTab === 'gallery'" />
      <CompanySponsorSection v-if="activeTab === 'sponsor'" />
    </div>
  </div>
</template>

<script setup>
import CompanyGallerySection from './sections/CompanyGallerySection.vue'
import CompanyProfileSection from './sections/CompanyProfileSection.vue'
import CompanySponsorSection from './sections/CompanySponsorSection.vue'

const themeClass = useThemeClass()
const activeTab = ref('profile')

const getTabClass = (tab) => {
  const base = 'px-4 py-2 font-semibold border-b-2'
  const isActive = activeTab.value === tab

  if (isActive) {
    return [base, themeClass.value.border.sky, themeClass.value.text.sky].join(' ')
  } else {
    const hover = themeClass.value.hoverText.sky || 'hover:text-sky-300'
    const text = themeClass.value.textless.sky || 'text-sky-300/50'
    return [base.replace('font-semibold border-b-2', ''), hover, text].join(' ')
  }
}
</script>
