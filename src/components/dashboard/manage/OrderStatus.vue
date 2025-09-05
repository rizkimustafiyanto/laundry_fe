<template>
  <div class="space-y-2">
    <div v-if="filteredOrders.length === 0" class="text-gray-400">Belum ada pesanan.</div>

    <BaseCard
      v-for="order in filteredOrders"
      :key="order.id"
      class="p-2 rounded-lg space-y-2"
      variant="secondary"
    >
      <div class="flex justify-between items-center">
        <div class="cursor-pointer" @click="openDetail(order.id)">
          <div class="font-semibold">#{{ order.invoiceNumber }}</div>
          <div class="text-sm text-gray-500">Status: {{ statusDraft[order.id] }}</div>
        </div>
        <div class="flex gap-2">
          <BaseSelect
            v-model="statusDraft[order.id]"
            :options="statusOption"
            placeholder="Pilih Status"
          />
          <BaseButton
            v-if="isStatusChanged(order.id)"
            label="Simpan"
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
    </BaseCard>
    <OrderView v-if="showModalDetail" v-model="showModalDetail" :orderId="selectedOrderId" />
    <BasePagination
      v-if="pagination.totalData > 0"
      :pagination="pagination"
      @page-change="handlePageChange"
      class="px-1"
      size="md"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useOptionsStore } from '@/stores/services/option.service'
import { useTransactionStore } from '@/stores/services/transaction.service'
import OrderView from '@/components/dashboard/form/OrderView.vue'
import BaseCard from '@/components/BaseCard.vue'
import BasePagination from '@/components/BasePagination.vue'

const optionStore = useOptionsStore()
const transactionStore = useTransactionStore()

const originalStatuses = reactive({})
const statusDraft = reactive({})
const filteredOrders = ref([])

const currentPage = ref(1)
const limit = ref(5)

const pagination = computed(() => ({
  currentPage: currentPage.value,
  limit: limit.value,
  totalData: transactionStore.meta?.totalData || filteredOrders.value.length,
}))

onMounted(async () => {
  await optionStore.fetchStatuses()
})

watch(
  () => transactionStore.transactions,
  (newOrders) => {
    filteredOrders.value = newOrders

    newOrders.forEach((order) => {
      if (!(order.id in originalStatuses)) {
        originalStatuses[order.id] = order.status
        statusDraft[order.id] = order.status
      }
    })
  },
  { immediate: true },
)

const showModalDetail = ref(false)
const selectedOrderId = ref('')

const openDetail = (orderId) => {
  selectedOrderId.value = orderId
  showModalDetail.value = true
}

const isStatusChanged = (id) => {
  return statusDraft[id] !== originalStatuses[id]
}

const isCancelledOrder = (status) => {
  return ['REGISTERED', 'PICKED_UP'].includes(status)
}

const updateStatus = async (id) => {
  await transactionStore.updateTransactionStatus(id, statusDraft[id])
  originalStatuses[id] = statusDraft[id]
}

const cancelOrder = async (id) => {
  statusDraft[id] = 'CANCELLED'
  await updateStatus(id)
}

const statusOption = computed(() => {
  return optionStore.statuses.filter((q) => q.label.toLowerCase() !== 'all')
})
</script>
