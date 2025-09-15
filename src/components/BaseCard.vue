<template>
  <div
    :class="[
      'rounded-2xl shadow-md transition duration-300',
      cardVisualClass,
      variantClass,
      type === 'grid' ? gridLayoutClass : 'p-4',
      classOverride,
    ]"
    :style="styleOverride"
  >
    <template v-if="type === 'grid'">
      <div v-if="gridDirection === 'row'" :class="[gridClass, `gap-${gap}`]">
        <slot />
      </div>
      <div v-else :class="[`flex flex-col gap-${gap}`]">
        <slot />
      </div>
    </template>

    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const themeStore = useThemeStore()
const themeClass = useThemeClass()

const props = defineProps({
  type: {
    type: String,
    default: 'single',
    validator: (val) => ['single', 'grid'].includes(val),
  },
  gridDirection: {
    type: String,
    default: 'row',
    validator: (val) => ['row', 'column'].includes(val),
  },
  cols: {
    type: Number,
    default: 2,
  },
  width: {
    type: String,
    default: 'auto',
  },
  height: {
    type: String,
    default: 'auto',
  },
  gap: {
    type: Number,
    default: 6,
  },
  classOverride: {
    type: String,
    default: '',
  },
  styleOverride: {
    type: Object,
    default: () => ({}),
  },
  variant: {
    type: String,
    default: 'secondary',
  },
  hasRing: {
    // <-- props baru
    type: Boolean,
    default: true,
  },
})

const gridLayoutClass = computed(() => {
  return `w-${props.width} h-${props.height} p-4`
})

const gridClass = computed(() => {
  const map = {
    1: 'grid grid-cols-1',
    2: 'grid grid-cols-1 sm:grid-cols-2',
    3: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }
  return map[props.cols] || `grid grid-cols-1 sm:grid-cols-${props.cols}`
})

const variantClass = computed(() => {
  return themeClass.value.baseDiv?.[props.variant] || themeClass.value.baseDiv.secondary
})

const cardVisualClass = computed(() => {
  const isDark = themeStore.theme === 'dark'
  const shadow = isDark ? 'shadow-lg backdrop-blur-md' : 'shadow-lg backdrop-blur-sm'

  if (props.hasRing) {
    const baseRing = themeClass.value.ring[props.variant] || 'ring-gray-200'
    return `${shadow} ring-1 ${baseRing}`
  }

  return shadow
})
</script>
