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
      <!-- Kolom Customer -->
      <template #customer="{ value }">
        <span :class="themeClass.text.secondary">
          {{ value?.name || '-' }}
        </span>
      </template>

      <!-- Kolom Status -->
      <template #status="{ value }">
        <span
          class="capitalize px-2 py-1 rounded-md text-xs font-medium"
          :class="[
            value === 'CANCELLED'
              ? [themeClass.text.danger, themeClass.background.danger]
              : value === 'COMPLETED'
                ? [themeClass.text.softGreen, themeClass.background.success]
                : [themeClass.text.secondary, themeClass.background.mist],
          ]"
        >
          {{ value }}
        </span>
      </template>

      <!-- Kolom Tanggal -->
      <template #createdAt="{ value }">
        <span :class="themeClass.text.secondary">
          {{ formatDate(value) }}
        </span>
      </template>

      <!-- Kolom Actions -->
      <template #actions="{ item }">
        <div class="flex gap-2">
          <BaseButton
            size="sm"
            @click="emit('view', item.id)"
            variant="secondary"
            :icon="'fa-solid fa-eye'"
            title="Lihat Detail"
          />
          <BaseButton
            v-if="item.payment?.status === 'PENDING' && ['SUPER_ADMIN', 'OWNER'].includes(role)"
            size="sm"
            @click="emit('confirm-payment', item.id)"
            variant="success"
            icon="fa-solid fa-circle-check"
            title="Konfirmasi Pembayaran"
          />
          <BaseButton
            v-if="item.status === 'COMPLETED' && ['SUPER_ADMIN', 'OWNER'].includes(role)"
            size="sm"
            @click="emit('edit-payment', item.id)"
            variant="teal"
            :icon="'fa-solid fa-dollar-sign'"
            title="Edit Pembayaran"
          />
          <BaseButton
            size="sm"
            @click="emit('edit', item.id)"
            variant="warning"
            :icon="'fa-solid fa-pen'"
            title="Edit Transaksi"
          />
          <BaseButton
            size="sm"
            @click="emit('delete', item.id)"
            variant="danger"
            :icon="'fa-solid fa-trash'"
            title="Hapus Transaksi"
          />
        </div>
      </template>
    </BaseTable>
  </BaseCard>
</template>

<script setup>
const { role } = storeToRefs(useAuthStore())
const themeClass = useThemeClass()

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
  'confirm-payment',
  'edit-payment',
  'download',
])
</script>
