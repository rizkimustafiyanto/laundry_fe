<template>
  <div class="space-y-2">
    <BaseLoadingSpinner v-if="loading" :type="'mini'" />
    <div v-else-if="filteredOrders.length === 0 && !loading" :class="themeClass.text.dark">
      Belum ada pesanan.
    </div>
    <div class="space-y-2" v-else>
      <BaseCard
        v-for="order in filteredOrders"
        :key="order.id"
        class="p-2 rounded-lg"
        variant="secondary"
      >
        <div class="flex justify-between items-center">
          <div class="cursor-pointer" @click="openDetail(order.id)">
            <div class="font-semibold">#{{ order.invoiceNumber }}</div>
            <div class="text-sm text-gray-500">Status: {{ statusDraft[order.id] }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <BaseSelect
              v-model="statusDraft[order.id]"
              :options="statusOption"
              class="text-xs"
              placeholder="Pilih Status"
            />
            <BaseButton
              v-if="!['COMPLETED', 'CANCELLED'].includes(order.status)"
              size="sm"
              @click="emit('onPayment', order.id)"
              variant="teal"
              icon="dollar"
            />
            <BaseButton
              v-if="isStatusChanged(order.id)"
              icon="save"
              size="md"
              @click="updateStatus(order.id)"
              variant="primary"
            />
            <BaseButton
              v-if="isCancelledOrder(statusDraft[order.id])"
              icon="stop"
              size="md"
              @click="cancelOrder(order.id)"
              variant="danger"
            />
          </div>
        </div>
      </BaseCard>
    </div>

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
const statusStore = useStatusStore()
const transactionStore = useTransactionStore()
const loadingStore = useLoadingStore()
const themeClass = useThemeClass()

const originalStatuses = reactive({})
const statusDraft = reactive({})

const filteredOrders = computed(() => transactionStore.items)

const pagination = computed(() => ({
  currentPage: transactionStore.meta.currentPage,
  limit: transactionStore.meta.limit,
  totalData: transactionStore.meta.totalData || filteredOrders.value.length,
}))

const loading = computed(() => loadingStore.isLoading)

const emit = defineEmits(['view', 'onPayment'])

onMounted(async () => {
  await statusStore.fetchItems()
})

watchEffect(() => {
  filteredOrders.value.forEach((order) => {
    if (!(order.id in originalStatuses)) {
      originalStatuses[order.id] = order.status
    }
    if (!(order.id in statusDraft)) {
      statusDraft[order.id] = order.status
    }
  })
})

const fetchTransactionPage = async (page = 1) => {
  await transactionStore.fetchItems({ page, limit: transactionStore.meta.limit })
}

const openDetail = (orderId) => {
  emit('view', orderId)
}

const isStatusChanged = (id) => statusDraft[id] !== originalStatuses[id]

const isCancelledOrder = (status) => ['REGISTERED', 'PICKED_UP'].includes(status)

const updateStatus = async (id) => {
  await transactionStore.updateTransactionStatus(id, statusDraft[id])
  originalStatuses[id] = statusDraft[id]
}

const cancelOrder = async (id) => {
  try {
    await notifyConfirm({
      title: 'Batalkan Pesanan',
      message: 'Apakah Anda yakin ingin membatalkan pesanan ini?',
      requireReason: true,
    })

    statusDraft[id] = 'CANCELLED'
    await transactionStore.updateTransactionStatus(id, statusDraft[id])
    originalStatuses[id] = statusDraft[id]
  } catch (error) {
    if (error !== 'cancelled') {
      notifyError(error, 'Cancel process gagal')
    }
  }
}

const handlePageChange = (page) => fetchTransactionPage(page)

const statusOption = computed(() => statusStore.options)
</script>
