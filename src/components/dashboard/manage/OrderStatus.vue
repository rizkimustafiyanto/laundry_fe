<template>
  <div class="space-y-2">
    <BaseLoadingSpinner v-if="loading" :type="'mini'" />
    <div v-else-if="filteredOrders.length === 0 && !loading" :class="themeClass.text.dark">
      Belum ada pesanan.
    </div>
    <div v-else>
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
              icon="save"
              @click="updateStatus(order.id)"
              variant="success"
            />
            <BaseButton
              v-if="isCancelledOrder(statusDraft[order.id])"
              icon="stop"
              @click="cancelOrder(order.id)"
              variant="danger"
            />
          </div>
        </div>
      </BaseCard>
    </div>
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
import OrderView from '@/components/dashboard/form/OrderView.vue'

const statusStore = useStatusStore()
const transactionStore = useTransactionStore()
const loadingStore = useLoadingStore()
const themeClass = useThemeClass()

const originalStatuses = reactive({})
const statusDraft = reactive({})
const filteredOrders = ref([])

const pagination = computed(() => ({
  currentPage: transactionStore.meta.currentPage,
  limit: transactionStore.meta.limit,
  totalData: transactionStore.meta.totalData || filteredOrders.value.length,
}))

const loading = computed(() => loadingStore.isLoading)

onMounted(async () => {
  await statusStore.fetchItems()
})

watch(
  () => transactionStore.items,
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

const fetchTransactionPage = async (page = 1) => {
  await transactionStore.fetchItems({ page, limit: transactionStore.meta.limit })
}

const openDetail = (orderId) => {
  selectedOrderId.value = orderId
  showModalDetail.value = true
}

const isStatusChanged = (id) => statusDraft[id] !== originalStatuses[id]

const isCancelledOrder = (status) => ['REGISTERED', 'PICKED_UP'].includes(status)

const updateStatus = async (id) => {
  await transactionStore.updateTransactionStatus(id, statusDraft[id])
  originalStatuses[id] = statusDraft[id]
}

const cancelOrder = async (id) => {
  statusDraft[id] = 'CANCELLED'
  await updateStatus(id)
}

const handlePageChange = (page) => fetchTransactionPage(page)

const statusOption = computed(() =>
  statusStore.options.filter((q) => q.label.toLowerCase() !== 'all'),
)
</script>
