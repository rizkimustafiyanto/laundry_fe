<template>
  <div>
    <div class="space-y-4">
      <!-- Welcome Card -->
      <BaseCard variant="secondary">
        <h2 class="text-lg font-semibold" :class="themeClass.text.secondary">
          Selamat datang, {{ user?.name }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <!-- Status Cucian -->
          <BaseCard variant="mist">
            <h3 class="text-sm font-medium mb-2" :class="themeClass.text.subtle">Status Cucian</h3>
            <p class="text-lg font-semibold" :class="themeClass.text.secondary">
              {{
                storeOngoingOrders.length > 0
                  ? storeOngoingOrders.length + ' pesanan dalam proses'
                  : 'Tidak ada cucian diproses'
              }}
            </p>
          </BaseCard>

          <!-- Total Tagihan -->
          <BaseCard variant="mist">
            <h3 class="text-sm font-medium mb-2" :class="themeClass.text.subtle">Total Tagihan</h3>
            <p class="text-lg font-semibold" :class="themeClass.text.secondary">
              {{ formatCurrency(totalPendingBill) }}
            </p>
          </BaseCard>

          <!-- Estimasi Selesai -->
          <BaseCard variant="mist">
            <h3 class="text-sm font-medium mb-2" :class="themeClass.text.subtle">
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

      <!-- Pickup Laundry Section -->
      <BaseCard v-if="isCustomer || isSuperadmin" variant="secondary">
        <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">
          Minta Penjemputan Laundry
        </h3>
        <BaseButton
          label="Pesan Sekarang"
          @click="showPickupModal = true"
          :class="themeClass.button.teal"
        />
      </BaseCard>

      <!-- Receive Laundry Section -->
      <BaseCard v-if="isOwner || isSuperadmin" variant="secondary">
        <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">
          Receive Laundry
        </h3>
        <BaseButton
          label="Pesanan Dibuat"
          @click="showCreateModal = true"
          :class="[themeClass.button.teal, 'rounded-md']"
        />
      </BaseCard>

      <!-- Penjemputan Laundry List -->
      <BaseCard v-if="isOwner || isSuperadmin" variant="secondary" class="space-y-4">
        <h3 class="text-lg font-semibold" :class="themeClass.text.secondary">
          Penjemputan Laundry
        </h3>
        <div v-if="pickupOrders.length === 0" :class="themeClass.text.subtle">
          Tidak ada pesanan yang perlu dijemput saat ini.
        </div>
        <div
          v-for="order in pickupOrders"
          :key="order.id"
          class="flex justify-between items-center p-3 rounded-lg"
          :class="themeClass.baseDiv.secondary"
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
            variant="pink"
            :class="themeClass.button.pink"
          />
        </div>
      </BaseCard>

      <!-- Kelola Status Pesanan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseCard v-if="isOwner || isSuperadmin" variant="secondary">
          <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">
            Kelola Status Pesanan
          </h3>
          <ManageOrderStatus @view="openViewModal" @on-payment="openPaymentModal" />
        </BaseCard>

        <!-- Statistik & Laporan -->
        <BaseCard v-if="isSuperadmin" variant="secondary">
          <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">
            Statistik & Laporan
          </h3>
          <p :class="themeClass.text.secondary">Fitur laporan global akan ditambahkan di sini.</p>
        </BaseCard>
      </div>
    </div>
    <!-- Order Forms -->
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
  </div>
</template>

<script setup>
import ManageOrderStatus from '@/components/dashboard/manage/OrderStatus.vue'
import OrderForm from '@/components/dashboard/form/OrderForm.vue'
import OrderView from './form/OrderView.vue'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const runningPreview = useRunningPreviewStore()
const themeClass = useThemeClass()

const user = computed(() => authStore.user)
const role = computed(() => authStore.role)

onMounted(() => {
  transactionStore.fetchItems()
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
const isCustomer = computed(() => role.value === 'CUSTOMER')

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
  showEditModal.value = true
  pickedUp.value = true
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
</script>
