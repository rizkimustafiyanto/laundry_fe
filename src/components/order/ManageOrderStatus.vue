<template>
  <div class="space-y-4">
    <div v-if="orders.length === 0" class="text-gray-400">Belum ada pesanan.</div>

    <div
      v-for="order in orders"
      :key="order.id"
      class="p-4 border rounded-lg space-y-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-500"
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
          <BaseButton
            :label="!isStatusChanged(order) ? '...' : 'Simpan'"
            @click="updateStatus(order)"
            :disabled="!isStatusChanged(order)"
          />
          <BaseButton
            v-if="order.status !== 'CANCELLED'"
            label="Batalkan"
            @click="cancelOrder(order)"
            variant="danger"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useOrderStore } from '@/stores/services/order'
import { useUIStore } from '@/stores/component/ui'
import { useAuthStore } from '@/stores/auth/auth'

const orderStore = useOrderStore()
const ui = useUIStore()
const auth = useAuthStore()

const orders = computed(() => {
  return auth.role === 'SUPER_ADMIN'
    ? orderStore.orders
    : orderStore.orders.filter((order) => order.branchId === auth.user?.branchId)
})

const originalStatuses = reactive({})

// Fetch ulang saat komponen dimuat
onMounted(async () => {
  await orderStore.fetchAllOrders()

  orders.value.forEach((order) => {
    originalStatuses[order.id] = order.status
  })
})

const isStatusChanged = (order) => {
  return order.status !== originalStatuses[order.id]
}

const updateStatus = async (order) => {
  try {
    await orderStore.updateOrderStatus(order.id, order.status)
    ui.show('success', 'Status pesanan diperbarui.')
    await orderStore.fetchAllOrders()
    orders.value.forEach((order) => {
      originalStatuses[order.id] = order.status
    })
  } catch (err) {
    ui.show('error', 'Gagal memperbarui status.')
  }
}

const cancelOrder = async (order) => {
  try {
    await orderStore.updateOrderStatus(order.id, 'CANCELLED')
    ui.show('success', 'Pesanan berhasil dibatalkan.')
    await orderStore.fetchAllOrders()
    orders.value.forEach((order) => {
      originalStatuses[order.id] = order.status
    })
  } catch (err) {
    ui.show('error', 'Gagal membatalkan pesanan.')
  }
}

const statusOption = [
  { label: 'REGISTERED', value: 'REGISTERED' },
  { label: 'PROCESS', value: 'PROCESS' },
  { label: 'COMPLETED', value: 'COMPLETED' },
  { label: 'DELIVERED', value: 'DELIVERED' },
  { label: 'CANCELLED', value: 'CANCELLED' },
]
</script>
