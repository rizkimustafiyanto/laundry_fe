<template>
  <div class="relative overflow-x-auto sm:rounded-lg border p-4 bg-white">
    <div class="flex justify-between items-center pb-2">
      <BaseInput
        v-model="searchQuery"
        :placeholder="'Cari...'"
        :icon="'search'"
        style="max-width: 30%"
      />

      <!-- Optional dropdown -->
      <div v-if="withDropdown">
        <BaseDropdown
          :label="dropdownLabel"
          :items="dropdownItems"
          @select="handleDropdownSelect"
        />
      </div>
    </div>

    <table v-if="!loading && items?.length" class="w-full text-sm text-left">
      <thead class="text-xs text-gray-700 uppercase bg-gray-300">
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="px-6 py-3">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <slot :items="items"></slot>
      </tbody>
    </table>

    <LoadingSpinner v-else-if="loading" :type="'mini'" />
    <div v-else class="text-gray-500 p-4">Tidak ada data ditemukan.</div>

    <nav
      v-if="!loading && pagination && items?.length"
      class="flex items-center justify-between pt-4"
      aria-label="Table navigation"
    >
      <span class="text-sm text-gray-500">
        Menampilkan <span class="font-semibold">{{ pagination.from }}</span> -
        <span class="font-semibold">{{ pagination.to }}</span> dari
        <span class="font-semibold">{{ pagination.total }}</span>
      </span>
      <ul class="inline-flex -space-x-px text-sm h-8">
        <li>
          <button
            :disabled="pagination.page <= 1"
            @click="$emit('page-change', pagination.page - 1)"
            class="px-3 h-8 text-gray-500 border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
        </li>
        <li v-for="p in totalPages" :key="p">
          <button
            @click="$emit('page-change', p)"
            :class="[
              'px-3 h-8 border',
              p === pagination.page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            {{ p }}
          </button>
        </li>
        <li>
          <button
            :disabled="pagination.page >= totalPages"
            @click="$emit('page-change', pagination.page + 1)"
            class="px-3 h-8 text-gray-500 border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50"
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
import BaseInput from './BaseInput.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import BaseDropdown from './BaseDropdown.vue'

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

watch(
  () => props.modelValue,
  (val) => {
    searchQuery.value = val
  },
)

watch(searchQuery, (val) => {
  emit('update:modelValue', val)
  emit('search', val)
})

const handleDropdownSelect = (value) => {
  emit('dropdown-select', value)
}

const totalPages = computed(() => {
  if (!props.pagination?.total || !props.pagination?.limit) return 1
  return Math.ceil(props.pagination.total / props.pagination.limit)
})
</script>
