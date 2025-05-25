<template>
  <div class="relative overflow-x-auto sm:rounded-lg p-4" :class="themeClass.baseDiv">
    <div class="flex justify-between items-center pb-2">
      <BaseInput
        v-model="searchQuery"
        :placeholder="'Cari...'"
        :icon="'search'"
        style="max-width: 30%"
      />

      <BaseSelect
        v-if="withDropdown"
        :modelValue="selectedDropdownValue"
        @update:modelValue="handleDropdownSelect"
        :options="dropdownItems"
        :placeholder="dropdownLabel"
        required
      />
    </div>

    <div v-if="!loading && items?.length" class="w-full overflow-x-auto">
      <table
        class="w-full text-sm text-left rounded-xl border min-w-max"
        :class="[themeClass.borderColor]"
      >
        <thead class="text-xs uppercase" :class="themeClass.thead">
          <tr>
            <th v-for="(header, index) in headers" :key="index" class="px-6 py-3">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <slot :items="items"></slot>
        </tbody>
      </table>
    </div>

    <BaseLoadingSpinner v-else-if="loading" :type="'mini'" />
    <div v-else class="text-center p-4" :class="themeClass.label">Tidak ada data ditemukan.</div>

    <nav
      v-if="!loading && pagination && items?.length"
      class="flex items-center justify-between pt-4"
      aria-label="Table navigation"
    >
      <span class="text-sm" :class="themeClass.color1">
        Menampilkan <span class="font-semibold">{{ pagination.from }}</span> -
        <span class="font-semibold">{{ pagination.to }}</span> dari
        <span class="font-semibold">{{ pagination.total }}</span>
      </span>
      <ul class="inline-flex -space-x-px text-sm h-8">
        <li>
          <button
            :disabled="pagination.page <= 1"
            @click="$emit('page-change', pagination.page - 1)"
            class="px-3 h-8 rounded-s-lg disabled:opacity-50"
            :class="[themeClass.color2, themeClass.borderColor]"
          >
            Previous
          </button>
        </li>
        <li v-for="p in totalPages" :key="p">
          <button
            @click="$emit('page-change', p)"
            :class="[
              'px-3 h-8 border',
              p === pagination.page
                ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
              themeClass.borderColor,
            ]"
          >
            {{ p }}
          </button>
        </li>
        <li>
          <button
            :disabled="pagination.page >= totalPages"
            @click="$emit('page-change', pagination.page + 1)"
            class="px-3 h-8 rounded-e-lg disabled:opacity-50"
            :class="[themeClass.color2, themeClass.borderColor]"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'
import { createDebouncer } from '@/utils/debounce'

const { themeClass } = useThemeClass()

const props = defineProps({
  modelValue: String,
  items: Array,
  headers: Array,
  loading: Boolean,
  pagination: Object,
  withDropdown: {
    type: Boolean,
    default: false,
  },
  dropdownLabel: {
    type: String,
    default: 'Filter',
  },
  dropdownItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'page-change', 'dropdown-select'])

const searchQuery = ref(props.modelValue)

watch(searchQuery, (val) => {
  debouncedSearch(val)
})

watch(
  () => props.modelValue,
  (val) => {
    if (val !== searchQuery.value) searchQuery.value = val
  },
)

const debouncedSearch = createDebouncer((val) => {
  emit('search', val)
  emit('update:modelValue', val)
}, 400)

const selectedDropdownValue = ref(null)

const handleDropdownSelect = (value) => {
  selectedDropdownValue.value = value
  emit('dropdown-select', value)
}

const totalPages = computed(() => {
  if (!props.pagination?.total || !props.pagination?.limit) return 1
  return Math.ceil(props.pagination.total / props.pagination.limit)
})
</script>
