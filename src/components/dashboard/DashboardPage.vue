<template>
  <div>
    <div class="space-y-6">
      <BaseCard variant="secondary">
        <h2
          class="text-lg font-semibold flex items-center gap-2"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-user-circle', themeClass.icon.primary]"></i>
          Selamat datang, {{ user?.name }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <BaseCard variant="mist" class="p-4 rounded-xl shadow-sm">
            <h3 class="text-sm font-medium mb-2" :class="themeClass.text.subtle">
              <i :class="['fa-solid fa-soap mr-2', themeClass.icon.info]"></i>
              Status Cucian
            </h3>
            <p class="text-lg font-semibold" :class="themeClass.text.secondary">
              {{
                storeOngoingOrders.length > 0
                  ? storeOngoingOrders.length + ' pesanan dalam proses'
                  : 'Tidak ada cucian diproses'
              }}
            </p>
          </BaseCard>

          <BaseCard variant="mist" class="p-4 rounded-xl shadow-sm">
            <h3 class="text-sm font-medium mb-2" :class="themeClass.text.subtle">
              <i :class="['fa-solid fa-wallet mr-2', themeClass.icon.warning]"></i>
              Total Tagihan
            </h3>
            <p class="text-lg font-semibold" :class="themeClass.text.secondary">
              {{ formatCurrency(totalPendingBill) }}
            </p>
          </BaseCard>

          <BaseCard variant="mist" class="p-4 rounded-xl shadow-sm">
            <h3 class="text-sm font-medium mb-2" :class="themeClass.text.subtle">
              <i :class="['fa-solid fa-clock mr-2', themeClass.icon.secondary]"></i>
              Estimasi Selesai
            </h3>
            <p class="text-lg font-semibold" :class="themeClass.text.secondary">
              {{
                storeOngoingOrders.length
                  ? formatDate(estimatedCompletion)
                  : 'Tidak ada cucian aktif'
              }}
            </p>
          </BaseCard>
        </div>
      </BaseCard>

      <BaseCard variant="secondary">
        <h3
          class="text-lg font-semibold mb-3 flex items-center gap-2"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-truck mr-1', themeClass.icon.teal]"></i>
          Minta Penjemputan Laundry
        </h3>
        <BaseButton
          label="Pesan Sekarang"
          @click="showPickupModal = true"
          icon="fa-solid fa-cart-plus"
          :class="themeClass.button.teal"
        />
      </BaseCard>

      <BaseCard variant="secondary">
        <h3
          class="text-lg font-semibold mb-3 flex items-center gap-2"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-clipboard-list mr-1', themeClass.icon.secondary]"></i>
          Manual Form
        </h3>
        <BaseButton
          label="Pesanan Dibuat"
          @click="showCreateModal = true"
          icon="fa-solid fa-plus"
          :class="[themeClass.button.teal, 'rounded-md']"
        />
      </BaseCard>

      <BaseCard v-if="isOwner || isSuperadmin" variant="secondary" class="space-y-4">
        <h3
          class="text-lg font-semibold flex items-center gap-2"
          :class="themeClass.text.secondary"
        >
          <i :class="['fa-solid fa-motorcycle mr-1', themeClass.icon.softPink]"></i>
          Penjemputan Laundry
        </h3>
        <div v-if="pickupOrders.length === 0" :class="themeClass.text.subtle">
          Tidak ada pesanan yang perlu dijemput saat ini.
        </div>
        <div
          v-for="order in pickupOrders"
          :key="order.id"
          class="flex justify-between items-center p-4 rounded-lg shadow-sm transition hover:shadow-md"
          :class="themeClass.baseDiv.softTeal"
        >
          <div>
            <div class="font-medium" :class="themeClass.text.secondary">
              #{{ order.invoiceNumber }}
            </div>
            <div class="text-sm" :class="themeClass.text.subtle">
              {{ order.customer?.name || 'Customer tidak diketahui' }}
            </div>
          </div>
          <BaseButton
            label="Sudah Diambil"
            @click="openEditModal(order)"
            icon="fa-solid fa-check"
            :class="themeClass.button.teal"
          />
        </div>
      </BaseCard>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseCard variant="secondary">
          <h3
            class="text-lg font-semibold mb-3 flex items-center gap-2"
            :class="themeClass.text.secondary"
          >
            <i :class="['fa-solid fa-list-check mr-1', themeClass.icon.primary]"></i>
            Kelola Status Pesanan
          </h3>
          <ManageOrderStatus @view="openViewModal" @on-payment="openPaymentModal"  @on-confirm-payment="openPaymentConfirmModal" />
        </BaseCard>

        <BaseCard variant="secondary">
          <h3
            class="text-lg font-semibold mb-3 flex items-center gap-2"
            :class="themeClass.text.secondary"
          >
            <i :class="['fa-solid fa-chart-pie mr-1', themeClass.icon.info]"></i>
            Statistik & Laporan
          </h3>
          <StatisticReport />
        </BaseCard>
      </div>
    </div>

    <OrderForm v-if="showCreateModal" v-model="showCreateModal" mode="manualpickup" />
    <OrderForm v-if="showPickupModal" v-model="showPickupModal" mode="requestpickup" />
    <OrderForm
      v-if="showEditModal"
      v-model="showEditModal"
      :pickedByEmployee="pickedUp"
      :orderId="selectedOrder"
      :editMode="true"
      mode="manualpickup"
    />
    <OrderView v-if="openViewModalValue" v-model="openViewModalValue" :orderId="selectedOrderId" />
    <OrderView
      v-if="openPaymentModalValue"
      v-model="openPaymentModalValue"
      :orderId="selectedOrderId"
      mode="payment"
    />
    <PaymentConfirm
      v-if="openPaymentConfirmModalValue"
      v-model="openPaymentConfirmModalValue"
      :orderId="selectedOrderId"
    />
  </div>
</template>

<script setup>
import ManageOrderStatus from '@/components/dashboard/manage/OrderStatus.vue'
import OrderForm from '@/components/dashboard/form/OrderForm.vue'
import OrderView from './form/OrderView.vue'
import StatisticReport from './manage/StatisticReport.vue'
import PaymentConfirm from './form/PaymentConfirm.vue'

const authStore = useAuthStore()
const transactionStore = useTransactionStatsStore()
const runningPreview = useRunningPreviewStore()
const themeClass = useThemeClass()

const user = computed(() => authStore.user)
const role = computed(() => authStore.role)

onMounted(() => {
  runningPreview.fetchRunningPreview()
})

const storeOngoingOrders = computed(() =>
  transactionStore.items.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)),
)

const totalPendingBill = computed(() => runningPreview.runningPreview)

const estimatedCompletion = computed(() => {
  const total = storeOngoingOrders.value.length
  const daysNeeded = Math.ceil(total / 2)
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + daysNeeded)
  return estimatedDate
})

const isSuperadmin = computed(() => role.value === 'SUPER_ADMIN')
const isOwner = computed(() => role.value === 'OWNER')

const pickedUp = ref(false)

const pickupOrders = computed(() =>
  transactionStore.items.filter((o) => o.pickupRequested && o.status === 'REGISTERED'),
)

const showEditModal = ref(false)
const showCreateModal = ref(false)
const showPickupModal = ref(false)
const selectedOrder = ref()

const openEditModal = (order) => {
  selectedOrder.value = order.id
  pickedUp.value = true
  showEditModal.value = true
}

const selectedOrderId = ref(undefined)

const openViewModalValue = ref(false)
const openViewModal = (order) => {
  selectedOrderId.value = order
  openViewModalValue.value = true
}

const openPaymentModalValue = ref(false)
const openPaymentModal = (order) => {
  selectedOrderId.value = order
  openPaymentModalValue.value = true
}

const openPaymentConfirmModalValue = ref(false)
const openPaymentConfirmModal = (order) => {
  selectedOrderId.value = order
  openPaymentConfirmModalValue.value = true
}
</script>
