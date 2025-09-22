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
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4"
        >
          <div class="cursor-pointer w-full sm:w-auto" @click="openDetail(order.id)">
            <div class="font-semibold text-sm sm:text-base">#{{ order.invoiceNumber }}</div>
            <div class="text-xs sm:text-sm text-gray-500">Status: {{ statusDraft[order.id] }}</div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <BaseSelect
              v-model="statusDraft[order.id]"
              :options="statusOption"
              size-variant="sm"
              placeholder="Pilih Status"
              class="w-full sm:w-auto"
              :disabled="isCustomer"
            />
            <BaseButton
              v-if="
                !['COMPLETED', 'CANCELLED'].includes(order.status) &&
                order.payment?.status !== 'PAID'
              "
              size="sm"
              @click="emit('onPayment', order.id)"
              variant="teal"
              icon="dollar"
              class="w-full sm:w-auto"
            />
            <BaseButton
              v-if="isStatusChanged(order.id) && !isCustomer"
              icon="save"
              size="sm"
              @click="updateStatus(order.id)"
              variant="primary"
              class="w-full sm:w-auto"
            />
            <BaseButton
              v-if="isCancelledOrder(statusDraft[order.id])"
              icon="stop"
              size="sm"
              @click="cancelOrder(order.id)"
              variant="danger"
              class="w-full sm:w-auto"
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

const authStore = useAuthStore()

const isCustomer = computed(() => authStore.user?.role === 'CUSTOMER')

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

watch(
  filteredOrders,
  (newOrders) => {
    newOrders.forEach((order) => {
      if (!(order.id in originalStatuses)) {
        originalStatuses[order.id] = order.status
      }

      statusDraft[order.id] = order.status
    })
  },
  { deep: true },
)

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
