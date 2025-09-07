<template>
  <BaseCard variant="glass">
    <BaseTable
      :items="transactions"
      :columns="columns"
      :loading="loading"
      :pagination="meta"
      :dropdownItems="statusOptions"
      :dropdownLabel="'Filter Status'"
      choosable
      searchable
      @page-change="$emit('page-change', $event)"
      @dropdown-select="$emit('dropdown-select', $event)"
      @limit-change="$emit('limit-change', $event)"
      @search="$emit('search', $event)"
    >
      <template #customer="{ value }">
        {{ value?.name || '-' }}
      </template>

      <template #status="{ value }">
        <span class="capitalize" :class="value === 'CANCELLED' ? 'text-red-600' : ''">
          {{ value }}
        </span>
      </template>

      <template #createdAt="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <BaseButton size="sm" @edit="emit('edit', item)" variant="secondary" icon="pen" />
          <BaseButton size="sm" @edit="emit('delete', item.id)" variant="danger" icon="trash" />
        </div>
      </template>
    </BaseTable>
  </BaseCard>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue'
import { formatDate } from '@/utils/formatters.js'

defineProps({
  transactions: { type: Array, default: () => [] },
  meta: { type: Object, default: () => ({}) },
  columns: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits([
  'page-change',
  'dropdown-select',
  'limit-change',
  'search',
  'edit',
  'delete',
])
</script>
