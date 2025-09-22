<template>
  <BaseCard variant="secondary">
    <BaseTable
      :items="transactions"
      :columns="columns"
      :loading="loading"
      :pagination="meta"
      :dropdownItems="statusOptions"
      :dropdownLabel="'Filter Status'"
      choosable
      searchable
      limitable
      @page-change="$emit('page-change', $event)"
      @dropdown-select="$emit('dropdown-select', $event)"
      @limit-change="$emit('limit-change', $event)"
      @search="$emit('search', $event)"
      @export="$emit('download')"
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
          <BaseButton size="sm" @click="emit('view', item.id)" variant="secondary" icon="eye" />
          <BaseButton
            v-if="item.status === 'COMPLETED' && ['SUPER_ADMIN', 'OWNER'].includes(role)"
            size="sm"
            @click="emit('edit-payment', item.id)"
            variant="teal"
            icon="dollar"
          />
          <BaseButton size="sm" @click="emit('edit', item.id)" variant="warning" icon="pen" />
          <BaseButton size="sm" @click="emit('delete', item.id)" variant="danger" icon="trash" />
        </div>
      </template>
    </BaseTable>
  </BaseCard>
</template>

<script setup>
const { role } = storeToRefs(useAuthStore())

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
  'view',
  'edit-payment',
  'download',
])
</script>
