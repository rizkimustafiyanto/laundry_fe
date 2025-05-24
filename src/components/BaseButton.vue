<template>
  <button
    :type="type"
    :disabled="isLoading || disabled"
    @click="handleClick"
    :class="[
      'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium focus:outline-none transition-colors duration-200',
      buttonClass,
      customClass,
    ]"
  >
    <!-- Loading Spinner -->
    <template v-if="isLoading">
      <svg
        class="animate-spin h-5 w-5 mr-2 text-current"
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
      <span>Loading...</span>
    </template>

    <!-- Icon + Label -->
    <template v-else>
      <template v-if="icon">
        <font-awesome-icon :icon="icon" class="w-4 h-4 mr-2" />
      </template>
      <slot>{{ label }}</slot>
    </template>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  label: { type: String, default: 'Submit' },
  icon: { type: [Array, String], default: null },
  isLoading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' },
})

const emit = defineEmits(['click'])

const { themeClass } = useThemeClass()
const isDebouncing = ref(false)

const handleClick = (event) => {
  if (isDebouncing.value || props.isLoading || props.disabled) return

  isDebouncing.value = true
  emit('click', event)

  setTimeout(() => {
    isDebouncing.value = false
  }, 300)
}

const buttonClass = computed(() => {
  if (props.disabled || props.isLoading) return 'opacity-50 cursor-not-allowed'

  const variants = {
    primary: themeClass.value.buttonPrimary,
    secondary: themeClass.value.buttonSecondary,
    outline: themeClass.value.buttonOutline,
    danger: themeClass.value.buttonDanger,
    success: themeClass.value.buttonSuccess,
  }

  return variants[props.variant] || themeClass.value.button
})
</script>
