<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      type="button"
      class="inline-flex items-center text-gray-500 bg-white font-medium rounded-lg text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      {{ label }}
      <svg class="w-2.5 h-2.5 ml-2.5" fill="none" viewBox="0 0 10 6">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M1 1l4 4 4-4"
        />
      </svg>
    </button>
    <div
      v-show="isOpen"
      class="absolute right-0 mt-2 z-10 w-44 rounded-lg shadow bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <ul class="py-1 text-sm text-gray-700">
        <li v-for="(item, index) in items" :key="index">
          <a href="#" @click.prevent="selectItem(item.value)" class="block px-4 py-2">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (value) => {
  isOpen.value = false
  emit('select', value)
}
</script>

<!-- CONTOH -->

<!-- <TableList
:items="users.data"
:headers="['Nama', 'Role', 'Tanggal Bergabung', 'Action']"
:loading="isMiniLoading"
:pagination="{ page: page, limit: limit, total: users.total, from: fromIndex, to: toIndex }"
v-model="search"
@search="onSearchChange"
@page-change="changePage"
:withDropdown="true"
:dropdown-label="'Status'"
:dropdown-items="[
  { label: 'Semua', value: '' },
  { label: 'Aktif', value: 'aktif' },
  { label: 'Nonaktif', value: 'nonaktif' }
]"
@dropdown-select="status => selectedStatus = status"
> -->
