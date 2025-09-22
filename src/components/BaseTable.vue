<template>
  <div :class="['relative overflow-x-auto sm:rounded-lg p-4']">
    <div class="flex justify-between items-center pb-2">
      <div class="flex flex-row gap-2">
        <BaseInput
          v-if="searchable"
          :modelValue="searchQuery"
          @update:modelValue="handleSearchQuery"
          placeholder="Cari..."
        />
        <div v-if="limitable" class="hidden md:flex gap-2 items-center text-sm">
          <select
            v-model="localLimit"
            @change="applyLimit"
            class="px-2"
            :class="themeClass.select.secondary"
          >
            <option v-for="n in [5, 10, 20, 50, 100]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <span :class="themeClass.text.secondary">: Tampilan Per Halaman</span>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <BaseButton
          v-if="exportable"
          icon="download"
          variant="mist"
          @click="emit('export')"
          class="w-full"
        />
        <BaseSelect
          v-if="choosable"
          :modelValue="selectedDropdownValue"
          @update:modelValue="handleDropdownSelect"
          :options="dropdownItems"
          :placeholder="dropdownLabel"
        />
      </div>
    </div>

    <div v-if="!loading && items?.length" class="w-full overflow-x-auto">
      <table
        class="w-full text-sm text-left rounded-xl border min-w-max"
        :class="themeClass.border.secondary"
      >
        <thead class="text-xs uppercase" :class="themeClass.thead">
          <tr>
            <th
              v-for="(col, index) in computedColumns"
              :key="index"
              class="px-6 py-3"
              :class="themeClass.text.secondary"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b"
            :class="[themeClass.hoverless.secondary, themeClass.border.secondary]"
          >
            <td
              v-for="col in computedColumns"
              :key="col.key"
              class="px-6 py-4"
              :class="themeClass.text.secondary"
            >
              <slot :name="col.key" :value="item[col.key]" :item="item">
                {{ item[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseLoadingSpinner v-else-if="loading" :type="'mini'" />
    <div v-else class="text-center p-4" :class="themeClass.text.secondary">
      Tidak ada data ditemukan.
    </div>

    <BasePagination
      v-if="!loading && items?.length && pagination"
      :pagination="pagination"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'
import { createDebouncer } from '@/utils/debounce'
import BasePagination from '@/components/BasePagination.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseLoadingSpinner from '@/components/BaseLoadingSpinner.vue'

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
const applyLimit = () => {
  emit('limit-change', localLimit.value)
}

const computedKeys = computed(() => (props.items?.length ? Object.keys(props.items[0]) : []))
const computedColumns = computed(() => {
  if (props.columns?.length)
    return props.columns.map((c) => (typeof c === 'string' ? { key: c, label: c } : c))
  return computedKeys.value.map((key) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  }))
})
</script>
