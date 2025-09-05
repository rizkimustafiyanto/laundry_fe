<template>
  <div class="relative py-1 border-none bg-inherit">
    <label v-if="label" :for="id" class="block mb-2 font-medium" :class="themeClass.text.dark">
      {{ label }}
    </label>

    <div
      ref="toggleRef"
      class="w-full px-4 p-2.5 border rounded-xl focus-within:ring-2 transition cursor-pointer flex justify-between items-center"
      :class="themeClass.select.mist"
      @click="toggleDropdown"
    >
      <span class="block truncate">{{ selectedLabel || placeholder }}</span>
      <font-awesome-icon :icon="dropdownOpen ? 'angle-up' : 'angle-down'" class="ml-2" />
    </div>

    <teleport to="body">
      <div
        v-if="dropdownOpen"
        :style="dropdownStyles"
        class="absolute z-50 border rounded-xl shadow-lg max-h-60 overflow-auto scrollbar-none"
        :class="[themeClass.select.mist]"
      >
        <BaseInput
          v-if="type === 'search'"
          v-model="searchTerm"
          :placeholder="searchPlaceholder"
          :icon="'search'"
          class="p-2 sticky top-0 z-10"
          :class="themeClass.input.dark"
        />

        <div v-if="options.length === 0" class="px-4 py-2" :class="themeClass.text.dark">
          Tidak ada data
        </div>

        <div
          v-for="option in options"
          :key="option.value"
          class="px-4 py-2 cursor-pointer"
          :class="themeClass.item.dark"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, nextTick, reactive } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'
import { createDebouncer } from '@/utils/debounce'
import BaseInput from '@/components/BaseInput.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const { themeClass } = useThemeClass()

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Pilih opsi' },
  type: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'search'].includes(val),
  },
  searchPlaceholder: { type: String, default: 'Search...' },
  onSearch: Function,
})

const emit = defineEmits(['update:modelValue'])

const dropdownOpen = ref(false)
const toggleRef = ref(null)
const searchTerm = ref('')
const dropdownStyles = reactive({ top: '0px', left: '0px', width: 'auto' })

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

const toggleDropdown = async () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    await nextTick()
    positionDropdown()
  }
}

const positionDropdown = () => {
  if (!toggleRef.value) return
  const rect = toggleRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const estimatedHeight = 240

  dropdownStyles.top =
    spaceBelow < estimatedHeight
      ? `${rect.top + window.scrollY - estimatedHeight}px`
      : `${rect.bottom + window.scrollY}px`

  dropdownStyles.left = `${rect.left + window.scrollX}px`
  dropdownStyles.width = `${rect.width}px`
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

const onClickOutside = (e) => {
  if (toggleRef.value && !toggleRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}
document.addEventListener('click', onClickOutside)
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
