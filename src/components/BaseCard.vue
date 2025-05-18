<template>
  <div
    :class="[ 
      'rounded-2xl shadow-md transition duration-300',
      variantClass,
      type === 'grid' ? gridLayoutClass : 'p-4',
      classOverride
    ]"
    :style="styleOverride"
  >
    <template v-if="type === 'grid'">
      <slot name="grid">
        <div
          :class="[ 
            gridDirection === 'row'
              ? 'flex flex-row flex-wrap gap-4'
              : 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
          ]"
        >
          <slot />
        </div>
      </slot>
    </template>

    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const { themeClass } = useThemeClass()

const props = defineProps({
  type: {
    type: String,
    default: 'single',
    validator: (val) => ['single', 'grid'].includes(val),
  },
  gridDirection: {
    type: String,
    default: 'column',
    validator: (val) => ['row', 'column'].includes(val),
  },
  theme: {
    type: String,
    default: 'light',
    validator: (val) => ['light', 'dark'].includes(val),
  },
  width: {
    type: String,
    default: 'auto',
  },
  height: {
    type: String,
    default: 'auto',
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
    validator: (val) => ['primary', 'secondary'].includes(val),
  },
})

const gridLayoutClass = computed(() => {
  return `w-${props.width} h-${props.height} p-4`
})

const variantClass = computed(() => {
  if (props.variant === 'primary') {
    return themeClass.value.variantPrimary
  } else {
    return themeClass.value.variantSecondary
  }
})

</script>
