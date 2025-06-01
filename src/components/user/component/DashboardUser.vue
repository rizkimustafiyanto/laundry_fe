<template>
  <div class="space-y-4">
    <BaseCard variant="primary">
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

    <BaseCard v-if="isCustomer || isSuperadmin" variant="primary">
      <h3 class="text-lg font-semibold mb-2">Minta Penjemputan Laundry</h3>
      <BaseButton label="Pesan Sekarang" @click="requestPickup" />
    </BaseCard>

    <BaseCard v-if="isOwner || isSuperadmin" variant="primary">
      <h3 class="text-lg font-semibold mb-2">Receive Laundry</h3>
      <BaseButton label="Pesanan Dibuat" @click="createOrder" />
    </BaseCard>

    <BaseCard v-if="isOwner || isSuperadmin" variant="primary" class="space-y-4">
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
        <BaseButton label="Sudah Diambil" @click="openEditModal(order, true)" variant="success" />
      </div>
    </BaseCard>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseCard v-if="isOwner || isSuperadmin" variant="primary">
        <h3 class="text-lg font-semibold mb-2">Kelola Status Pesanan</h3>
        <ManageOrderStatus />
      </BaseCard>

      <BaseCard v-if="isSuperadmin" variant="primary">
        <h3 class="text-lg font-semibold mb-2">Statistik & Laporan</h3>
        <p>Fitur laporan global akan ditambahkan di sini.</p>
      </BaseCard>
    </div>

    <EditOrderModal
      v-if="selectedOrder"
      :orderId="selectedOrder"
      :orderTake="orderTake"
      v-model="showEditModal"
    />
    <CreateOrderModal v-if="showCreateModal" v-model="showCreateModal" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { useOrderStore } from '@/stores/services/order'
import { formatDate, formatCurrency } from '@/utils/formatters'
import ManageOrderStatus from '@/components/order/component/ManageOrderStatus.vue'
import EditOrderModal from '@/components/order/modal/EditOrder.vue'
import CreateOrderModal from '@/components/order/modal/CreateOrder.vue'

const authStore = useAuthStore()
const orderStore = useOrderStore()

const user = computed(() => authStore.user)
const role = computed(() => authStore.role)

onMounted(() => {
  orderStore.fetchAllOrders()
})

const userOrders = computed(() =>
  orderStore.orders.filter((order) => order.customer?.id === user.value?.id),
)

const ongoingOrders = computed(() =>
  userOrders.value.filter((order) => order.status !== 'COMPLETED'),
)

const storeOngoingOrders = computed(() =>
  orderStore.orders.filter((order) => order.status !== 'COMPLETED'),
)

const totalPendingBill = computed(() => {
  return ongoingOrders.value.reduce((sum, order) => {
    const orderTotal = (order.items || []).reduce(
      (itemSum, item) => itemSum + (item.subtotal || 0),
      0,
    )
    return sum + orderTotal
  }, 0)
})

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

const requestPickup = async () => {
  await orderStore.createOrder({
    customerId: user.value.id,
    pickupRequested: true,
  })
}

const pickupOrders = computed(() => orderStore.pickedUpRequest)

const showEditModal = ref(false)
const showCreateModal = ref(false)
const selectedOrder = ref()
const orderTake = ref()

const createOrder = () => {
  showCreateModal.value = true
}

const openEditModal = (order, take = false) => {
  selectedOrder.value = order.id
  orderTake.value = take
  showEditModal.value = true
}
</script>
