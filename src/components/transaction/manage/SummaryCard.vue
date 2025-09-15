<template>
  <BaseCard variant="mist">
    <div class="text-sm text-gray-400">{{ title }}</div>
    <div class="text-2xl font-bold">{{ value }}</div>
  </BaseCard>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
})
</script>
