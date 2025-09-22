<template>
  <div class="relative border-none bg-inherit">
    <label
      v-if="label"
      :for="id"
      class="block mb-2 font-medium"
      :class="[themeClass.text.dark, sizeClass.font]"
    >
      {{ label }}
    </label>

    <div
      ref="toggleRef"
      class="w-full border rounded-lg transition flex justify-between items-center"
      :class="[
        themeClass.select.mist,
        sizeClass.wrapper,
        props.disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
          : 'cursor-pointer focus-within:ring-2',
      ]"
      @click="!props.disabled && toggleDropdown()"
    >
      <span class="block truncate" :class="sizeClass.font">
        {{ selectedLabel || placeholder }}
      </span>
      <font-awesome-icon
        :icon="dropdownOpen ? 'angle-up' : 'angle-down'"
        :class="['ml-2', sizeClass.icon]"
      />
    </div>

    <teleport to="body">
      <div
        v-if="dropdownOpen && !props.disabled"
        ref="dropdownRef"
        :style="dropdownStyles"
        class="absolute z-50 border rounded-lg shadow-lg max-h-60 overflow-auto scrollbar-none"
        :class="[themeClass.select.mist, sizeClass.dropdown]"
      >
        <BaseInput
          v-if="type === 'search'"
          ref="searchInputRef"
          v-model="searchTerm"
          :placeholder="searchPlaceholder"
          :icon="'search'"
          class="sticky top-0 z-10"
          :class="[themeClass.input.dark, sizeClass.font, sizeClass.wrapper]"
          rounded="lg"
        />

        <div
          v-if="options.length === 0"
          class="px-4 py-2"
          :class="[themeClass.baseDiv.dark, sizeClass.font]"
        >
          Tidak ada data
        </div>

        <div
          v-for="option in options"
          :key="option.value"
          class="cursor-pointer"
          :class="[themeClass.item.dark, sizeClass.option]"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
const themeClass = useThemeClass()

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
  disabled: { type: Boolean, default: false },

  sizeVariant: {
    type: String,
    default: 'sm',
    validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(val),
  },
})

const emit = defineEmits(['update:modelValue'])

const dropdownOpen = ref(false)
const toggleRef = ref(null)
const dropdownRef = ref(null)
const searchInputRef = ref(null)
const searchTerm = ref('')
const dropdownStyles = reactive({ top: '0px', left: '0px', width: 'auto' })

const sizeClass = computed(() => {
  switch (props.sizeVariant) {
    case 'xs':
      return {
        font: 'text-xs',
        wrapper: 'px-3 py-2 text-xs',
        option: 'px-3 py-2 text-xs',
        icon: 'text-xs',
        dropdown: 'text-xs',
      }
    case 'sm':
      return {
        font: 'text-sm',
        wrapper: 'px-3 py-2 text-sm',
        option: 'px-3 py-2 text-sm',
        icon: 'text-sm',
        dropdown: 'text-sm',
      }
    case 'md':
      return {
        font: 'text-base',
        wrapper: 'px-3 py-2 text-base',
        option: 'px-3 py-2 text-base',
        icon: 'text-base',
        dropdown: 'text-base',
      }
    case 'lg':
      return {
        font: 'text-lg',
        wrapper: 'px-3 py-2 text-lg',
        option: 'px-3 py-2 text-lg',
        icon: 'text-lg',
        dropdown: 'text-lg',
      }
    case 'xl':
      return {
        font: 'text-xl',
        wrapper: 'px-3 py-2 text-xl',
        option: 'px-3 py-2 text-xl',
        icon: 'text-xl',
        dropdown: 'text-xl',
      }
    default:
      return {
        font: 'text-base',
        wrapper: 'px-3 py-2 text-base',
        option: 'px-3 py-2 text-base',
        icon: 'text-base',
        dropdown: 'text-base',
      }
  }
})

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

const toggleDropdown = async () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    await nextTick()
    positionDropdown()
    if (props.type === 'search' && searchInputRef.value?.focus) {
      searchInputRef.value.focus()
    }
  }
}

const positionDropdown = () => {
  if (!toggleRef.value) return
  const rect = toggleRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom

  const dropdownHeight = dropdownRef.value ? Math.min(dropdownRef.value.scrollHeight, 240) : 240

  if (spaceBelow < dropdownHeight) {
    dropdownStyles.top = `${rect.top + window.scrollY - dropdownHeight}px`
  } else {
    dropdownStyles.top = `${rect.bottom + window.scrollY}px`
  }

  dropdownStyles.left = `${rect.left + window.scrollX}px`
  dropdownStyles.width = `${rect.width}px`
}

const selectOption = (option) => {
  if (props.disabled) return
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
  if (!toggleRef.value) return
  if (
    props.type === 'search' &&
    (searchInputRef.value?.$el?.contains(e.target) || toggleRef.value.contains(e.target))
  ) {
    return
  }
  if (toggleRef.value && !toggleRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

document.addEventListener('click', onClickOutside)
window.addEventListener('resize', positionDropdown)
window.addEventListener('scroll', positionDropdown, true)

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('resize', positionDropdown)
  window.removeEventListener('scroll', positionDropdown, true)
})
</script>
