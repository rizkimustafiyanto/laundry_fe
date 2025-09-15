<script setup lang="ts">
import BodySection from './sections/BodySection.vue'
import FootSection from './sections/FootSection.vue'
import HeadSection from './sections/HeadSection.vue'

const store = useCompanyProfileStore()

onBeforeMount(() => {
  store.fetchItems()
})
</script>

<template>
  <div class="w-full">
    <HeadSection />
    <main class="pt-8 md:pt-8">
      <BodySection />
      <FootSection class="mt-12" />
    </main>
  </div>
</template>
