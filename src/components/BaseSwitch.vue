<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="toggle"
    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
    :class="modelValue ? 'bg-teal-500' : 'bg-gray-300'"
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
})
const emit = defineEmits(['update:modelValue'])
const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>
