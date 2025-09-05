<template>
  <button
    :type="type"
    :disabled="isLoading || disabled"
    @click="handleClick"
    :title="showOnlyIcon ? label : ''"
    :class="[
      'inline-flex items-center justify-center font-medium focus:outline-none transition-colors duration-200',
      roundedClass,
      buttonClass,
      sizeClass,
      customClass,
    ]"
  >
    <!-- Loading State -->
    <template v-if="isLoading">
      <svg
        :class="['animate-spin text-current', iconSizeClass, showOnlyIcon ? '' : 'mr-2']"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span v-if="!showOnlyIcon">Loading...</span>
    </template>

    <!-- Normal State -->
    <template v-else>
      <template v-if="icon">
        <font-awesome-icon
          :icon="icon"
          :class="[
            iconSizeClass,
            !showOnlyIcon ? 'mr-2' : '',
            themeClass.icon[props.variant] || themeClass.icon.primary,
          ]"
        />
      </template>
      <template v-if="!showOnlyIcon">
        <slot>{{ label }}</slot>
      </template>
    </template>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  label: { type: String, default: '' },
  icon: { type: [Array, String], default: null },
  isLoading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' },
  size: { type: String, default: 'md' },
  noBg: { type: Boolean, default: false },
  rounded: { type: String, default: 'md' },
})

const emit = defineEmits(['click'])
const { themeClass } = useThemeClass()
const isDebouncing = ref(false)

const showOnlyIcon = computed(() => props.icon && !props.label)

const handleClick = (event) => {
  if (isDebouncing.value || props.isLoading || props.disabled) return
  isDebouncing.value = true
  emit('click', event)
  setTimeout(() => (isDebouncing.value = false), 300)
}

const roundedClass = computed(() => {
  if (!props.rounded || props.rounded === 'none') return ''
  return `rounded-${props.rounded}`
})

const buttonClass = computed(() => {
  if (props.disabled || props.isLoading) return 'opacity-50 cursor-not-allowed'

  if (props.noBg) {
    return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-current border border-gray-300 dark:border-gray-600'
  }

  return themeClass.value.button?.[props.variant] || themeClass.value.button.secondary
})

const sizeClass = computed(() => {
  const base = showOnlyIcon.value
    ? {
        xl: 'p-4 text-xl',
        lg: 'p-3 text-lg',
        md: 'p-2.5 text-base',
        sm: 'p-2 text-sm',
        xs: 'p-1.5 text-xs',
      }
    : {
        xl: 'px-6 py-3 text-xl',
        lg: 'px-5 py-2.5 text-lg',
        md: 'px-4 py-2 text-base',
        sm: 'px-3 py-1.5 text-sm',
        xs: 'px-2 py-1 text-xs',
      }
  return base[props.size] || base.md
})

const iconSizeClass = computed(() => {
  const sizes = { xl: 'w-6 h-6', lg: 'w-5 h-5', md: 'w-4 h-4', sm: 'w-3.5 h-3.5', xs: 'w-3 h-3' }
  return sizes[props.size] || sizes.md
})
</script>
