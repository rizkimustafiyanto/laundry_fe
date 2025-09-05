<template>
  <BaseCard variant="glass" type="grid" gridDirection="column">
    <template #grid>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="statusSummary.length > 0">
          <BaseCard
            v-for="(count, status) in statusSummary"
            :key="status"
            variant="secondary"
            type="single"
          >
            <div class="text-sm text-gray-400 capitalize">{{ status }}</div>
            <div class="text-2xl font-bold">{{ count }}</div>
          </BaseCard>
        </template>
        <template v-else>
          <BaseCard variant="secondary" type="single">
            <div class="text-sm text-gray-400 capitalize">{{ noDataLabel }}</div>
          </BaseCard>
        </template>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
defineProps({
  statusSummary: { type: Array, default: () => [] },
  noDataLabel: { type: String, default: 'No Transaction' },
})
</script>
