<template>
  <div>
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium" :class="themeClass.label">
      {{ label }}
    </label>

    <BaseInput
      v-if="type === 'search'"
      v-model="searchTerm"
      :placeholder="searchPlaceholder"
      :icon="'search'"
      class="mb-2"
    />

    <select
      :id="id"
      :multiple="type === 'multiple'"
      :value="modelValue"
      @change="onChange"
      class="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 transition"
      :class="themeClass.select"
      :required="required"
    >
      <option v-if="placeholder && type !== 'multiple'" disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="option in filteredOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseInput from './BaseInput.vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const { themeClass } = useThemeClass()

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number, Array],
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'search', 'multiple'].includes(val),
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
})

const emit = defineEmits(['update:modelValue'])
const searchTerm = ref('')

const filteredOptions = computed(() => {
  if (props.type === 'search' && searchTerm.value) {
    return props.options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.value.toLowerCase()),
    )
  }
  return props.options
})

const onChange = (e) => {
  if (props.type === 'multiple') {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value)
    emit('update:modelValue', selected)
  } else {
    emit('update:modelValue', e.target.value)
  }
}
</script>

<style scoped>
/* Additional styles for customization if needed */
</style>
