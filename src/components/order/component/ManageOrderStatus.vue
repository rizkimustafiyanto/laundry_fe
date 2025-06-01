<template>
  <div class="space-y-4">
    <div v-if="filteredOrders.length === 0" class="text-gray-400">Belum ada pesanan.</div>

    <div
      v-for="order in filteredOrders"
      :key="order.id"
      class="p-4 border rounded-lg space-y-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-500"
    >
      <div class="flex justify-between items-center">
        <div>
          <div class="font-semibold">#{{ order.invoiceNumber }}</div>
          <div class="text-sm text-gray-500">Status: {{ statusDraft[order.id] }}</div>
        </div>
        <div class="flex gap-2">
          <BaseSelect
            id="status_order"
            v-model="statusDraft[order.id]"
            :options="statusOption"
            placeholder="Pilih Status"
            type="default"
          />
          <BaseButton
            :label="!isStatusChanged(order.id) ? '...' : 'Simpan'"
            @click="updateStatus(order.id)"
            :disabled="!isStatusChanged(order.id)"
          />
          <BaseButton
            v-if="isCancelledOrder(statusDraft[order.id])"
            label="Batalkan"
            @click="cancelOrder(order.id)"
            variant="danger"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useOrderStore } from '@/stores/services/order'
import { useAuthStore } from '@/stores/auth/auth'

const orderStore = useOrderStore()
const auth = useAuthStore()

const originalStatuses = reactive({})
const statusDraft = reactive({})
const filteredOrders = ref([])

onMounted(async () => {
  await orderStore.fetchFilterListStatus()
})

watch(
  () => orderStore.orders,
  (newOrders) => {
    const filtered =
      auth.role === 'SUPER_ADMIN'
        ? newOrders
        : newOrders.filter((order) => order.branchId === auth.user?.branchId)

    filteredOrders.value = filtered

    filtered.forEach((order) => {
      if (!(order.id in originalStatuses)) {
        originalStatuses[order.id] = order.status
        statusDraft[order.id] = order.status
      }
    })
  },
  { immediate: true },
)

const isStatusChanged = (id) => {
  return statusDraft[id] !== originalStatuses[id]
}

const isCancelledOrder = (status) => {
  return ['REGISTERED', 'PICKED_UP'].includes(status)
}

const updateStatus = async (id) => {
  await orderStore.updateOrderStatus(id, statusDraft[id])
  originalStatuses[id] = statusDraft[id]
}

const cancelOrder = async (id) => {
  statusDraft[id] = 'CANCELLED'
  await updateStatus(id)
}

const statusOption = computed(() => {
  return orderStore.filterList.filter((q) => q.label.toLowerCase() !== 'all')
})
</script>
