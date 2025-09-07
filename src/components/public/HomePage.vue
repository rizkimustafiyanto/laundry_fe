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
  <div>
    <HeadSection />
    <BodySection />
    <FootSection />
  </div>
</template>
