<template>
  <BaseCard variant="secondary" type="grid" :cols="2" class="gap-2 p-4">
    <template v-if="statusSummary.length > 0">
      <BaseCard
        v-for="i in statusSummary"
        :key="i.status"
        :variant="statusVariant(i.status)"
        type="single"
        class="flex flex-col items-center justify-center p-4 rounded-lg"
      >
        <div class="text-sm font-medium capitalize" :class="statusTextClass(i.status)">
          {{ upperCase(formatText(i.status)) }}
        </div>
        <div class="text-2xl font-bold" :class="statusTextClass(i.status)">
          {{ i.count }}
        </div>
      </BaseCard>
    </template>
    <template v-else>
      <BaseCard
        variant="secondary"
        type="single"
        class="flex items-center justify-center p-4 rounded-lg"
      >
        <div class="text-sm font-medium text-gray-400">{{ noDataLabel }}</div>
      </BaseCard>
    </template>
  </BaseCard>
</template>

<script setup>
import { upperCase } from 'lodash'

defineProps({
  statusSummary: { type: Array, default: () => [] },
  noDataLabel: { type: String, default: 'No Transaction' },
})

const themeClass = useThemeClass()

const statusVariant = (status) => {
  switch (status) {
    case 'REGISTERED':
    case 'PICKED_UP':
    case 'WASHING':
    case 'DRYING':
    case 'IRONING':
    case 'READY':
      return 'softViolet'
    case 'ON_DELIVERY':
    case 'DELIVERED':
    case 'COMPLETED':
      return 'softGreen'
    case 'CANCELLED':
      return 'softPink'
    default:
      return 'secondary'
  }
}

const statusTextClass = (status) => {
  const variant = statusVariant(status)
  return themeClass.value.textless[variant]
}
</script>
