<script setup lang="ts">
import BodySection from './sections/BodySection.vue'
import FootSection from './sections/FootSection.vue'
import HeadSection from './sections/HeadSection.vue'

const store = useCompanyProfileStore()
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  try {
    store.fetchItems()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full bg-white">
    <div v-if="loading" class="flex justify-center py-12 text-gray-500">Memuat data...</div>

    <template v-else>
      <HeadSection />
      <main class="pt-8 md:pt-8">
        <BodySection />
        <FootSection class="mt-12" />
      </main>
    </template>
  </div>
</template>
