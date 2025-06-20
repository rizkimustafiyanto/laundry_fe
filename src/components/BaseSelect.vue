<template>
  <div class="relative min-w-32 p-1" ref="dropdownRef">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium" :class="themeClass.label">
      {{ label }}
    </label>

    <div
      class="w-full p-2.5 border rounded-xl focus-within:ring-2 transition cursor-pointer flex justify-between items-center"
      :class="themeClass.select"
      @click="toggleDropdown"
    >
      <span class="block truncate">
        {{ selectedLabel || placeholder }}
      </span>
      <font-awesome-icon :icon="dropdownOpen ? 'angle-up' : 'angle-down'" class="ml-2" />
    </div>

    <div
      v-if="dropdownOpen"
      :class="[
        'absolute z-10 w-full bg-white dark:bg-gray-800 dark:border-gray-600 border rounded-xl shadow-lg max-h-60 overflow-auto scrollbar-none',
        dropdownDirection === 'down' ? 'top-full' : 'bottom-full',
      ]"
    >
      <BaseInput
        v-if="type === 'search'"
        v-model="searchTerm"
        :placeholder="searchPlaceholder"
        :icon="'search'"
        class="p-2 sticky top-0 bg-white dark:bg-gray-800 z-10"
      />

      <div v-if="options.length === 0" class="px-4 py-2 text-sm text-gray-500">Tidak ada data</div>

      <div
        v-for="option in options"
        :key="option.value"
        class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, nextTick } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'
import { createDebouncer } from '@/utils/debounce'

const { themeClass } = useThemeClass()

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi',
  },
  type: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'search'].includes(val),
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
  onSearch: Function,
})

const emit = defineEmits(['update:modelValue'])

const dropdownOpen = ref(false)
const dropdownDirection = ref('down')
const searchTerm = ref('')
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

const toggleDropdown = async () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    await nextTick()
    adjustDropdownDirection()
  }
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  dropdownOpen.value = false
}

const doSearch = createDebouncer(async (val) => {
  if (props.onSearch) await props.onSearch(val)
}, 400)

watch(searchTerm, (val) => {
  if (props.type === 'search') doSearch(val)
})

const adjustDropdownDirection = () => {
  if (!dropdownRef.value) return

  const rect = dropdownRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const estimatedDropdownHeight = 160

  dropdownDirection.value = spaceBelow < estimatedDropdownHeight ? 'up' : 'down'
}

const onClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}
document.addEventListener('click', onClickOutside)
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
