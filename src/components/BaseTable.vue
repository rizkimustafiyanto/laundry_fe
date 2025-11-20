<template>
  <div
    :class="[
      'relative overflow-x-auto sm:rounded-lg',
      themeClass.baseDiv.secondary,
      sizeClass.wrapper,
    ]"
  >
    <div class="flex justify-between items-center" :class="sizeClass.header">
      <div class="flex flex-row gap-2 items-center">
        <BaseInput
          v-if="searchable"
          :modelValue="searchQuery"
          @update:modelValue="handleSearchQuery"
          placeholder="Cari..."
          :size-variant="sizeVariant"
        />

        <div v-if="limitable" class="hidden md:flex gap-2 items-center" :class="sizeClass.font">
          <BaseSelect
            :modelValue="localLimit"
            @update:modelValue="applyLimit"
            :options="[5, 10, 20, 50, 100].map((n) => ({ label: n, value: n }))"
            placeholder="Tampilan Per Halaman"
            :theme-class="themeClass.select"
            :size-variant="sizeVariant"
          />
          <span :class="themeClass.text.secondary">: Tampilan Per Halaman</span>
        </div>
      </div>

      <div class="hidden md:flex flex-row gap-2">
        <BaseButton
          v-if="exportable"
          @click="$emit('export')"
          variant="mist"
          :size="sizeVariant"
          no-bg
          no-border
        >
          <i :class="['fa-solid fa-download', themeClass.icon.primary]"></i>
        </BaseButton>

        <BaseSelect
          v-if="choosable"
          :modelValue="selectedDropdownValue"
          @update:modelValue="handleDropdownSelect"
          :options="dropdownItems"
          :placeholder="dropdownLabel"
          :size-variant="sizeVariant"
        />
      </div>

      <div class="md:hidden relative mobile-menu-wrapper">
        <BaseButton
          variant="mist"
          icon="fa-solid fa-ellipsis-vertical"
          no-border
          no-bg
          :size="sizeVariant"
          @click.stop="toggleMobileMenu"
        />

        <div
          v-if="showMobileMenu"
          class="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 p-2"
          :class="themeClass.background.dark"
        >
          <BaseButton
            v-if="exportable"
            variant="mist"
            label="Export"
            icon="fa-solid fa-download mr-2"
            no-border
            no-bg
            :size="sizeVariant"
            @click="clickMobile(() => emit('export'))"
          />

          <div v-if="choosable" class="px-2 py-2">
            <BaseSelect
              :modelValue="selectedDropdownValue"
              @update:modelValue="(v) => clickMobile(() => handleDropdownSelect(v))"
              :options="dropdownItems"
              :placeholder="dropdownLabel"
              :size-variant="sizeVariant"
            />
          </div>

          <div v-if="limitable" class="px-2 py-2">
            <BaseSelect
              :modelValue="localLimit"
              @update:modelValue="(v) => clickMobile(() => applyLimit(v))"
              :options="[5, 10, 20, 50, 100].map((n) => ({ label: n, value: n }))"
              placeholder="Limit"
              :size-variant="sizeVariant"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && items?.length" class="w-full overflow-x-auto">
      <table
        class="w-full text-left rounded-xl border min-w-max"
        :class="[themeClass.border.secondary, sizeClass.font]"
      >
        <thead class="uppercase bg-gray-50" :class="[themeClass.thead, sizeClass.thead]">
          <tr>
            <th
              v-for="(col, index) in computedColumns"
              :key="index"
              :class="[themeClass.text.secondary, sizeClass.th]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b transition"
            :class="[themeClass.hoverless.secondary, themeClass.border.secondary]"
          >
            <td
              v-for="col in computedColumns"
              :key="col.key"
              :class="[themeClass.text.secondary, sizeClass.td]"
            >
              <slot :name="col.key" :value="item[col.key]" :item="item">
                {{ item[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseLoadingSpinner v-else-if="loading" type="mini" class="my-4 mx-auto" />

    <div
      v-else
      class="text-center rounded-lg border border-dashed"
      :class="[themeClass.text.secondary, themeClass.border.airy, sizeClass.empty]"
    >
      <i :class="['fa-regular fa-inbox mb-2', themeClass.icon.secondary, sizeClass.emptyIcon]"></i>
      Tidak ada data ditemukan.
    </div>

    <BasePagination
      v-if="!loading && items?.length && pagination"
      :pagination="pagination"
      @page-change="$emit('page-change', $event)"
      class="mt-4"
      :size-variant="sizeVariant"
    />
  </div>
</template>

<script setup>
const themeClass = useThemeClass()

const props = defineProps({
  items: Array,
  columns: Array,
  loading: Boolean,
  pagination: Object,
  searchable: { type: Boolean, default: false },
  choosable: { type: Boolean, default: false },
  limitable: { type: Boolean, default: false },
  exportable: { type: Boolean, default: false },
  dropdownLabel: { type: String, default: 'Filter' },
  dropdownItems: { type: Array, default: () => [] },
  sizeVariant: {
    type: String,
    default: 'md',
    validator: (val) => ['xs', 'sm', 'md', 'lg'].includes(val),
  },
})

const emit = defineEmits([
  'update:modelValue',
  'search',
  'page-change',
  'dropdown-select',
  'limit-change',
  'export',
])

const searchQuery = ref('')
const debouncedSearch = createDebouncer((val) => {
  emit('search', val)
}, 400)

const handleSearchQuery = (value) => {
  searchQuery.value = value
  debouncedSearch(value)
}

const selectedDropdownValue = ref(null)
const handleDropdownSelect = (value) => {
  selectedDropdownValue.value = value
  emit('dropdown-select', value)
}

const localLimit = ref(props.pagination?.limit || 10)
const applyLimit = (value) => {
  localLimit.value = value
  emit('limit-change', value)
}

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const clickMobile = (callback) => {
  callback()
  showMobileMenu.value = false
}

const handleClickOutside = (e) => {
  const wrapper = document.querySelector('.mobile-menu-wrapper')
  if (!wrapper) return

  if (showMobileMenu.value && !wrapper.contains(e.target)) {
    showMobileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const computedKeys = computed(() => (props.items?.length ? Object.keys(props.items[0]) : []))
const computedColumns = computed(() => {
  if (props.columns?.length)
    return props.columns.map((c) => (typeof c === 'string' ? { key: c, label: c } : c))
  return computedKeys.value.map((key) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  }))
})

const sizeClass = computed(() => {
  switch (props.sizeVariant) {
    case 'xs':
      return {
        wrapper: 'p-1 text-xs',
        header: 'pb-1',
        font: 'text-xs',
        thead: 'text-[10px]',
        th: 'px-2 py-1',
        td: 'px-2 py-1',
        empty: 'p-2 text-xs',
        emptyIcon: 'text-lg',
      }
    case 'sm':
      return {
        wrapper: 'p-2 text-sm',
        header: 'pb-2',
        font: 'text-sm',
        thead: 'text-xs',
        th: 'px-3 py-2',
        td: 'px-3 py-2',
        empty: 'p-4 text-sm',
        emptyIcon: 'text-xl',
      }
    case 'md':
      return {
        wrapper: 'p-4 text-base',
        header: 'pb-2',
        font: 'text-base',
        thead: 'text-sm',
        th: 'px-4 py-3',
        td: 'px-4 py-3',
        empty: 'p-6 text-base',
        emptyIcon: 'text-2xl',
      }
    case 'lg':
      return {
        wrapper: 'p-6 text-lg',
        header: 'pb-3',
        font: 'text-lg',
        thead: 'text-base',
        th: 'px-6 py-4',
        td: 'px-6 py-4',
        empty: 'p-8 text-lg',
        emptyIcon: 'text-3xl',
      }
    default:
      return {}
  }
})
</script>
