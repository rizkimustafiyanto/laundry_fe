<template>
  <div class="space-y-4">
    <div v-if="orders.length === 0" class="text-gray-400">Belum ada pesanan.</div>

    <div
      v-for="order in orders"
      :key="order.id"
      class="p-4 border rounded-lg space-y-2 bg-gray-100 dark:bg-gray-800"
    >
      <div class="flex justify-between items-center">
        <div>
          <div class="font-semibold">#{{ order.invoiceNumber }}</div>
          <div class="text-sm text-gray-500">Status: {{ order.status }}</div>
        </div>
        <div class="flex gap-2">
          <BaseSelect
            id="status_order"
            v-model="order.status"
            :options="statusOption"
            placeholder="Pilih Status"
            type="default"
          />
          <button
            @click="updateStatus(order)"
            class="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            Simpan
          </button>
          <button
            v-if="order.status !== 'CANCELLED'"
            @click="cancelOrder(order)"
            class="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/services/order'
import { useUIStore } from '@/stores/component/ui'
import { useAuthStore } from '@/stores/auth/auth'
import BaseSelect from '../BaseSelect.vue'

const orderStore = useOrderStore()
const ui = useUIStore()
const auth = useAuthStore()


const orders = computed(() => {
  return auth.role === 'SUPER_ADMIN'
    ? orderStore.orders
    : orderStore.orders.filter(order => order.branchId === auth.user?.branchId)
})

const updateStatus = async (order) => {
  try {
    await orderStore.updateOrderStatus(order.id, order.status)
    ui.show('success', 'Status pesanan diperbarui.')
    orderStore.fetchAllOrders()
  } catch (err) {
    ui.show('error', 'Gagal memperbarui status.')
  }
}

const cancelOrder = async (order) => {
  try {
    await orderStore.updateOrderStatus(order.id, 'CANCELLED')
    ui.show('success', 'Pesanan berhasil dibatalkan.')
    orderStore.fetchAllOrders()
  } catch (err) {
    ui.show('error', 'Gagal membatalkan pesanan.')
  }
}

const statusOption = [
  { label: 'REGISTERED', value: 'REGISTERED'},
  { label: 'PROCESS', value: 'PROCESS'},
  { label: 'COMPLETED', value: 'COMPLETED'},
  { label: 'DELIVERED', value: 'DELIVERED'},
  { label: 'CANCELLED', value: 'CANCELLED'},
]
</script>
