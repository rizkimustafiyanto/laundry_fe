<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="toggle"
    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
    :class="[
      modelValue
        ? themeClass.background[variant] || 'bg-teal-500'
        : themeClass.background.gray || 'bg-gray-300',
      themeClass.hover[variant] || 'hover:bg-teal-600',
      themeClass.ring[variant],
    ]"
  >
    <span
      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
      :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  variant: { type: String, default: 'teal' },
})

const emit = defineEmits(['update:modelValue'])
const themeClass = useThemeClass()

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>
