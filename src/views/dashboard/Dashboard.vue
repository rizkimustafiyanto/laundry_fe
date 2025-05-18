<template>
  <div class="space-y-4">
    <!-- User Dashboard Section -->
    <BaseCard variant="primary">
      <h2 class="text-lg font-semibold">Selamat datang, {{ user?.name }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <BaseCard variant="secondary">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Status Cucian</h3>
          <p class="text-lg font-semibold">
            {{ latestOrder?.status || 'Belum Ada Pesanan' }}
          </p>
        </BaseCard>
        <BaseCard variant="secondary">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Total Tagihan</h3>
          <p class="text-lg font-semibold">
            Rp {{ formatCurrency(totalBill) }}
          </p>
        </BaseCard>
        <BaseCard variant="secondary">
          <h3 class="text-sm font-medium text-gray-400 mb-2">Estimasi Selesai</h3>
          <p class="text-lg font-semibold">
            {{ latestOrder?.estimatedCompletion
              ? formatDate(latestOrder.estimatedCompletion)
              : 'Belum Ada' }}
          </p>
        </BaseCard>
      </div>
    </BaseCard>

    <!-- Action Section -->
    <!-- CUSTOMER: Tombol Pesan Sekarang -->
    <BaseCard v-if="isCustomer || isSuperadmin" variant="primary">
      <h3 class="text-lg font-semibold mb-2">Minta Penjemputan Laundry</h3>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="requestPickup"
      >
        Pesan Sekarang
      </button>
    </BaseCard>

    <BaseCard v-if="isOwner || isSuperadmin" variant="primary" class="space-y-4">
      <h3 class="text-lg font-semibold">Penjemputan Laundry</h3>
      <div v-if="pickupOrders.length === 0" class="text-sm text-gray-400">
        Tidak ada pesanan yang perlu dijemput saat ini.
      </div>
      <div
        v-for="order in pickupOrders"
        :key="order.id"
        class="flex justify-between items-center border p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
      >
        <div>
          <div class="font-medium">#{{ order.invoiceNumber }}</div>
          <div class="text-sm text-gray-500">
            {{ order.customer?.name || 'Customer tidak diketahui' }}
          </div>
        </div>
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          @click="openEditModal(order)"
        >
          Sudah Diambil
        </button>
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
      :order="selectedOrder"
      v-model="showEditModal"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { useOrderStore } from '@/stores/services/order'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import ManageOrderStatus from '@/components/order/ManageOrderStatus.vue'
import EditOrderModal from '@/components/order/EditOrderModal.vue'
import { useUIStore } from '@/stores/component/ui'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const ui = useUIStore()

const user = computed(() => authStore.user)
const role = computed(() => authStore.role)

onMounted(() => {
  orderStore.fetchAllOrders()
})

const userOrders = computed(() =>
  orderStore.orders.filter(order => order.customer?.id === user.value?.id)
)

const latestOrder = computed(() => {
  return userOrders.value.length
    ? userOrders.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null
})

const totalBill = computed(() => {
  return userOrders.value
    .filter(order => order.status === 'COMPLETED' || order.status === 'DELIVERED')
    .reduce((sum, order) => sum + (order.total || 0), 0)
})

function formatCurrency(value) {
  return value.toLocaleString('id-ID')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return format(date, 'dd MMMM yyyy', { locale: idLocale })
}

// Role checks
const isSuperadmin = computed(() => role.value === 'SUPER_ADMIN')
const isOwner = computed(() => role.value === 'OWNER')
const isCustomer = computed(() => role.value === 'CUSTOMER')

// Customer request pickup
const requestPickup = async () => {
  try {
    await orderStore.createOrder({
      customerId: user.value.id,
      pickupRequested: true,
    })
    ui.show('success', 'Permintaan penjemputan berhasil dikirim!')
    await orderStore.fetchAllOrders()
  } catch (err) {
    ui.show('error', 'Gagal mengirim permintaan penjemputan.')
  }
}

// Penjemputan oleh petugas
const pickupOrders = computed(() =>
  orderStore.orders.filter(order => order.status === 'REGISTERED' && order.pickupRequested === true)
)

const showEditModal = ref(false)
const selectedOrder = ref([])

const openEditModal = (order) => {
  selectedOrder.value = order
  showEditModal.value = true
}

const markAsPickedUp = async (order) => {
  try {
    await orderStore.updateOrderStatus(order.id, 'PROCESS')
    ui.show('success', `Status pesanan #${order.invoiceNumber} diubah ke PROCESS.`)
    await orderStore.fetchAllOrders()
  } catch (err) {
    ui.show('error', 'Gagal memperbarui status pesanan.')
  }
}
</script>
