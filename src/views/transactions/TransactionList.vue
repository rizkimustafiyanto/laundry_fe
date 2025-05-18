<template>
  <div class="space-y-6">
    <!-- TRANSAKSI HARI INI (SINGLE CARD) -->
    <BaseCard variant="primary">
      <div class="text-sm text-gray-400">Transaksi Hari Ini</div>
      <div class="text-2xl font-bold">{{ orderStore.summary.todayTotal }}</div>
    </BaseCard>

    <!-- TRANSAKSI PER STATUS (GRID MODE) -->
    <BaseCard variant="primary" type="grid" gridDirection="column">
      <template #grid>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BaseCard
            v-for="(count, status) in orderStore.summary.statusCount"
            :key="status"
            variant="secondary"
            type="single"
          >
            <div class="text-sm text-gray-400 capitalize">{{ status }}</div>
            <div class="text-2xl font-bold">{{ count }}</div>
          </BaseCard>
        </div>
      </template>
    </BaseCard>

    <!-- TABLE LIST -->
    <BaseTable
      v-model="orderStore.search"
      :items="filteredOrders"
      :headers="['Invoice', 'Customer', 'Status', 'Tanggal', 'Aksi']"
      :loading="orderStore.loading"
      :pagination="orderStore.pagination"
      withDropdown
      :dropdownItems="statusOptions"
      :dropdownLabel="'Filter Status'"
      @page-change="handlePageChange"
      @dropdown-select="setFilterStatus"
    >
      <template #default="{ items }">
        <tr
          v-for="order in items"
          :key="order.id"
          class="border-b"
          :class="themeClass.trHover"
        >
          <td class="px-6 py-4 font-medium whitespace-nowrap">
            {{ order.invoiceNumber }}
          </td>
          <td class="px-6 py-4">{{ order.customer?.name || '-' }}</td>
          <td class="px-6 py-4 capitalize">{{ order.status }}</td>
          <td class="px-6 py-4">{{ formatDate(order.createdAt) }}</td>
          <td class="px-6 py-4">
            <button
              v-if="order.status !== 'CANCELLED'"
              @click="updateOrderStatusToCancelled(order.id)"
              class="text-red-600 hover:text-red-800"
            >
              Cancel
            </button>
            <button
              @click="deleteOrder(order.id)"
              class="text-red-600 hover:text-red-800 ml-2"
            >
              Delete
            </button>
          </td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
// ===== IMPORTS =====
import { onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/services/order.js'
import { useAuthStore } from '@/stores/auth/auth.js'
import { useUIStore } from '@/stores/component/ui.js'
import { useThemeClass } from '@/composables/useThemeClass.js'

// ===== STORES =====
const orderStore = useOrderStore()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { themeClass } = useThemeClass()

// ===== COMPUTED PROPERTIES =====
const statusOptions = computed(() =>
  orderStore.filterList.filter((item) =>
    ['REGISTERED', 'PROCESS', 'COMPLETED', 'CANCELLED', 'DELIVERED', ''].includes(item.value)
))

const filteredOrders = computed(() => {
  return orderStore.filteredOrders.filter(order =>
    authStore.user?.role === 'SUPER_ADMIN'
      ? true
      : order.customerId === authStore.user?.id
  )
})

// ===== LIFECYCLE =====
onMounted(async () => {
  await orderStore.fetchAllOrders()
  await orderStore.fetchOrderSummary()
  await orderStore.fetchFilterListStatus()
})

// ===== METHODS =====
function handlePageChange(newPage) {
  orderStore.pagination.page = newPage
  orderStore.fetchAllOrders()
}

function setFilterStatus(status) {
  orderStore.setFilterStatus(status)
  orderStore.fetchAllOrders()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

async function updateOrderStatusToCancelled(orderId) {
  try {
    await orderStore.updateOrderStatus(orderId, 'CANCELLED')
    uiStore.show('success', 'Pesanan berhasil dibatalkan!')
  } catch (error) {
    uiStore.show('error', 'Gagal membatalkan pesanan.')
  }
}

async function deleteOrder(orderId) {
  try {
    await orderStore.deleteOrder(orderId)
    uiStore.show('success', 'Pesanan berhasil dihapus!')
  } catch (error) {
    uiStore.show('error', 'Gagal menghapus pesanan.')
  }
}
</script>
