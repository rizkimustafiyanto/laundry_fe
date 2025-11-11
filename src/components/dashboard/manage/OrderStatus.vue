<template>
  <div class="space-y-4">
    <BaseLoadingSpinner v-if="loading" type="mini" class="mx-auto" />

    <div
      v-else-if="filteredOrders.length === 0 && !loading"
      class="text-center py-6 rounded-lg border border-dashed"
      :class="themeClass.border.airy"
    >
      <i :class="['fa-solid fa-box-open text-4xl mb-2', themeClass.icon.secondary]"></i>
      <p :class="themeClass.text.secondary">Belum ada pesanan.</p>
    </div>

    <div v-else class="space-y-4">
      <BaseCard
        v-for="order in filteredOrders"
        :key="order.id"
        class="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        variant="secondary"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="cursor-pointer w-full sm:w-auto" @click="openDetail(order.id)">
            <div
              class="font-semibold text-sm sm:text-base flex items-center gap-2"
              :class="themeClass.text.secondary"
            >
              <i :class="['fa-solid fa-receipt', themeClass.icon.secondary]"></i>
              #{{ order.invoiceNumber }}
            </div>
            <div class="text-xs sm:text-sm" :class="themeClass.text.subtle">
              {{ order.customer?.name }} • {{ formatDate(order.createdAt) }}
            </div>
          </div>

          <BaseBadge
            :variantText="statusConfig[statusDraft[order.id]]?.text || 'dark'"
            :variantBGColor="statusConfig[statusDraft[order.id]]?.bg || 'secondary'"
            :rounded="'full'"
            textSize="xs"
            class="flex items-center gap-1 px-3 py-1"
          >
            <i :class="statusConfig[statusDraft[order.id]]?.icon || 'fa-solid fa-info-circle'"></i>
            <span class="capitalize">{{ statusDraft[order.id] }}</span>
          </BaseBadge>
        </div>

        <div class="mt-3 text-sm space-y-1">
          <p v-if="order.items?.length" :class="themeClass.text.secondary">
            <i :class="['fa-solid fa-cube', themeClass.icon.secondary]"></i>
            {{ order.items[0].itemType?.name }} ({{ order.items[0].weightInKg }} kg)
            <span v-if="order.items.length > 1">+{{ order.items.length - 1 }} item</span>
          </p>

          <p :class="themeClass.text.secondary">
            <i :class="['fa-solid fa-money-bill-wave', themeClass.icon.secondary]"></i>
            {{ formatCurrency(order.invoice?.grandTotal) }}
          </p>
          <p v-if="order.payment" :class="themeClass.text.subtle">
            <i :class="['fa-solid fa-credit-card', themeClass.icon.secondary]"></i>
            {{ order.payment.paymentMethod }} -
            <span class="capitalize">{{ order.payment.status }}</span>
            <template v-if="order.payment.status === 'PENDING'">
              • Dibuat {{ formatDate(order.payment.createdAt) }}
            </template>
            <template v-else-if="order.payment.status === 'PAID'">
              • Dikonfirmasi {{ formatDate(order.payment.paidAt) }}
            </template>
          </p>
        </div>

        <div class="mt-4 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <BaseSelect
            v-model="statusDraft[order.id]"
            :options="statusOption"
            size-variant="sm"
            placeholder="Pilih Status"
            class="w-full sm:w-auto"
            :disabled="isCustomer"
          />

          <BaseButton
            v-if="canPay(order)"
            size="sm"
            @click.stop="emit('onPayment', order.id)"
            variant="teal"
            class="w-full sm:w-auto"
            icon="fa-solid fa-dollar-sign"
            label="Bayar"
          >
            <span>Bayar</span>
          </BaseButton>

          <BaseButton
            v-if="isStatusChanged(order.id) && !isCustomer"
            size="sm"
            @click.stop="updateStatus(order.id)"
            variant="primary"
            class="w-full sm:w-auto"
            icon="fa-solid fa-save"
            label="Simpan"
          >
            <span>Simpan</span>
          </BaseButton>

          <BaseButton
            v-if="canCancel(order)"
            size="sm"
            @click.stop="cancelOrder(order.id)"
            variant="danger"
            class="w-full sm:w-auto"
            icon="fa-solid fa-ban"
            label="Batalkan"
          >
            <span>Batalkan</span>
          </BaseButton>

          <BaseButton
            v-if="canConfirmPayment(order)"
            size="sm"
            @click.stop="emit('onConfirmPayment', order.id)"
            variant="success"
            class="w-full sm:w-auto"
            icon="fa-solid fa-circle-check"
            label="Konfirmasi Pembayaran"
          >
            <span>Konfirmasi Pembayaran</span>
          </BaseButton>
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
const orderStore = useOrderStore()
const loadingStore = useLoadingStore()
const themeClass = useThemeClass()
const authStore = useAuthStore()
const emit = defineEmits(['view', 'onPayment', 'onConfirmPayment'])

const originalStatuses = reactive({})
const statusDraft = reactive({})

const filteredOrders = computed(() => orderStore.items)

const pagination = computed(() => ({
  currentPage: orderStore.meta.currentPage,
  limit: orderStore.meta.limit,
  totalData: orderStore.meta.totalData || filteredOrders.value.length,
}))

const isCustomer = computed(() => authStore.user?.role === 'CUSTOMER')
const loading = computed(() => loadingStore.isLoading)

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
  await orderStore.fetchItems({ page, limit: orderStore.meta.limit })
}

const openDetail = (orderId) => emit('view', orderId)

const isStatusChanged = (id) => statusDraft[id] !== originalStatuses[id]

const canPay = (order) => {
  return (
    !['COMPLETED', 'CANCELLED'].includes(order.status) &&
    !['PAID', 'PENDING'].includes(order.payment?.status)
  )
}

const canCancel = (order) => {
  return (
    (order.status === 'REGISTERED' && isCustomer.value) ||
    (!isCustomer.value && statusDraft[order.id] === 'REGISTERED')
  )
}

const canConfirmPayment = (order) => {
  return !isCustomer.value && order.payment && order.payment.status === 'PENDING'
}

const updateStatus = async (id) => {
  await orderStore.updateTransactionStatus(id, statusDraft[id])
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
    await orderStore.updateTransactionStatus(id, statusDraft[id])
    originalStatuses[id] = statusDraft[id]
  } catch (error) {
    if (error !== 'cancelled') {
      notifyError(error, 'Cancel process gagal')
    }
  }
}

const handlePageChange = (page) => fetchTransactionPage(page)

const statusOption = computed(() => statusStore.options)

const statusConfig = {
  COMPLETED: { text: 'light', bg: 'success', icon: 'fa-solid fa-check-circle' },
  CANCELLED: { text: 'light', bg: 'danger', icon: 'fa-solid fa-ban' },
  REGISTERED: { text: 'dark', bg: 'warning', icon: 'fa-solid fa-clock' },
  PICKED_UP: { text: 'light', bg: 'info', icon: 'fa-solid fa-truck' },
}

onBeforeMount(() => {
  orderStore.fetchItems({ limit: 5 })
})
</script>
