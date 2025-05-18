<template>
  <div>
    <label v-if="label" class="block mb-2 text-sm font-medium" :class="themeClass.label">
      {{ label }}
    </label>
    <div :class="wrapperClass">
      <label
        v-for="option in options"
        :key="option.value"
        :class="[
          'flex items-center cursor-pointer',
          type === 'vertical' ? 'mb-2 last:mb-0' : 'mr-4 last:mr-0'
        ]"
      >
        <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="form-radio focus:ring-2"
          :class="themeClass.radio"
        />
        <span class="ml-2 text-sm" :class="themeClass.optionLabel">
          {{ option.label }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const { themeClass } = useThemeClass()

const props = defineProps({
  modelValue: [String, Number, Boolean],
  label: String,
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  type: {
    type: String,
    default: 'vertical',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
})

const wrapperClass = computed(() =>
  props.type === 'horizontal' ? 'flex flex-row flex-wrap' : 'flex flex-col'
)
</script>

<style scoped>
/* Additional styles if needed */
</style>
