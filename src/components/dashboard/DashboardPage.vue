<template>
  <div class="space-y-4">
    <BaseCard variant="glass">
      <h2 class="text-lg font-semibold">Selamat datang, {{ user?.name }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <BaseCard variant="secondary">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Status Cucian</h3>
          <p class="text-lg font-semibold">
            {{
              ongoingOrders.length > 0
                ? ongoingOrders.length + ' pesanan dalam proses'
                : 'Tidak ada cucian diproses'
            }}
          </p>
        </BaseCard>

        <BaseCard variant="secondary">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Total Tagihan</h3>
          <p class="text-lg font-semibold">{{ formatCurrency(totalPendingBill) }}</p>
        </BaseCard>

        <BaseCard variant="secondary">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Estimasi Selesai</h3>
          <p class="text-lg font-semibold">
            {{
              storeOngoingOrders.length ? formatDate(estimatedCompletion) : 'Tidak ada cucian aktif'
            }}
          </p>
        </BaseCard>
      </div>
    </BaseCard>

    <!-- Customer Request Pickup -->
    <BaseCard v-if="isCustomer || isSuperadmin" variant="glass">
      <h3 class="text-lg font-semibold mb-2">Minta Penjemputan Laundry</h3>
      <BaseButton
        label="Pesan Sekarang"
        @click="showPickupModal = true"
        :class="useThemeClass().themeClass.value.button.teal"
      />
    </BaseCard>

    <!-- Admin/Owner Create Order -->
    <BaseCard v-if="isOwner || isSuperadmin" variant="glass">
      <h3 class="text-lg font-semibold mb-2">Receive Laundry</h3>
      <BaseButton
        label="Pesanan Dibuat"
        @click="showCreateModal = true"
        :class="useThemeClass().themeClass.value.button.teal"
      />
    </BaseCard>

    <!-- Pickup Orders -->
    <BaseCard v-if="isOwner || isSuperadmin" variant="glass" class="space-y-4">
      <h3 class="text-lg font-semibold">Penjemputan Laundry</h3>
      <div v-if="pickupOrders.length === 0" class="text-sm text-gray-400">
        Tidak ada pesanan yang perlu dijemput saat ini.
      </div>
      <div
        v-for="order in pickupOrders"
        :key="order.id"
        class="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
      >
        <div>
          <div class="font-medium">#{{ order.invoiceNumber }}</div>
          <div class="text-sm text-gray-500">
            {{ order.customer?.name || 'Customer tidak diketahui' }}
          </div>
        </div>
        <BaseButton
          label="Sudah Diambil"
          @click="openEditModal(order)"
          variant="success"
          :class="useThemeClass().themeClass.value.button.teal"
        />
      </div>
    </BaseCard>

    <!-- Manage Orders -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseCard v-if="isOwner || isSuperadmin" variant="glass">
        <h3 class="text-lg font-semibold mb-2">Kelola Status Pesanan</h3>
        <ManageOrderStatus />
      </BaseCard>

      <BaseCard v-if="isSuperadmin" variant="glass">
        <h3 class="text-lg font-semibold mb-2">Statistik & Laporan</h3>
        <p>Fitur laporan global akan ditambahkan di sini.</p>
      </BaseCard>
    </div>

    <!-- Order Modals -->
    <OrderForm v-if="showCreateModal" v-model="showCreateModal" mode="admin" />

    <OrderForm v-if="showPickupModal" v-model="showPickupModal" mode="customer" />

    <OrderForm
      v-if="showEditModal"
      v-model="showEditModal"
      :orderId="selectedOrder"
      :editMode="true"
      mode="admin"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { useTransactionStore } from '@/stores/services/transaction.service'
import { usePaymentStore } from '@/stores/services/payment.service'
import { formatDate, formatCurrency } from '@/utils/formatters'
import ManageOrderStatus from '@/components/dashboard/manage/OrderStatus.vue'
import OrderForm from '@/components/dashboard/form/OrderForm.vue'
import { useThemeClass } from '@/composables/useThemeClass'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const paymentStore = usePaymentStore()

const user = computed(() => authStore.user)
const role = computed(() => authStore.role)

// Fetch global data
onMounted(() => {
  transactionStore.fetchTransactions()
  paymentStore.fetchRunningPreview()
})

// Orders for logged in customer
const userOrders = computed(() =>
  transactionStore.transactions.filter((o) => o.customerId === user.value?.id),
)

const ongoingOrders = computed(() =>
  userOrders.value.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)),
)

// All ongoing orders
const storeOngoingOrders = computed(() =>
  transactionStore.transactions.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)),
)

const totalPendingBill = computed(() => paymentStore.runningPreview)

const estimatedCompletion = computed(() => {
  const total = storeOngoingOrders.value.length
  const daysNeeded = Math.ceil(total / 2)
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + daysNeeded)
  return estimatedDate
})

// Roles
const isSuperadmin = computed(() => role.value === 'SUPER_ADMIN')
const isOwner = computed(() => role.value === 'OWNER')
const isCustomer = computed(() => role.value === 'CUSTOMER')

// Orders needing pickup
const pickupOrders = computed(() =>
  transactionStore.transactions.filter((o) => o.pickupRequested && o.status === 'REGISTERED'),
)

// Modal controls
const showEditModal = ref(false)
const showCreateModal = ref(false)
const showPickupModal = ref(false)
const selectedOrder = ref()

const openEditModal = (order) => {
  selectedOrder.value = order.id
  showEditModal.value = true
}
</script>
