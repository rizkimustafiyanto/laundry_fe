<template>
  <div>
    <div class="space-y-6">
      <BaseCard type="grid" :cols="2" variant="secondary">
        <SummaryCard title="Transaksi Hari Ini" :value="todayTransactions" />
        <SummaryCard title="Transaksi Selesai" :value="completedTransactions" />
      </BaseCard>

      <StatusSummary :statusSummary="statusSummary" />

      <TransactionTable
        :transactions="transactions"
        :columns="columns"
        :meta="meta"
        :loading="loading"
        :statusOptions="statusOptions"
        @page-change="handlePageChange"
        @dropdown-select="setFilterStatus"
        @limit-change="handleLimitChange"
        @search="handleSearch"
        @confirm-payment="handleConfirmPayment"
        @view="handleView"
        @edit="handleEdit"
        @edit-payment="handleEditPayment"
        @delete="deleteOrder"
        @download="handleDownload"
      />
    </div>

    <OrderForm
      v-if="showEditModal"
      v-model="showEditModal"
      :orderId="idValueSelected"
      :editMode="true"
      mode="manualpickup"
    />

    <OrderForm
      v-if="showPaymentModal"
      v-model="showPaymentModal"
      :orderId="idValueSelected"
      :editMode="true"
      mode="paymentorder"
    />

    <OrderView v-if="openViewModalValue" v-model="openViewModalValue" :orderId="idValueSelected" />

    <PaymentConfirm
      v-if="openPaymentConfirmModalValue"
      v-model="openPaymentConfirmModalValue"
      :orderId="idValueSelected"
    />
  </div>
</template>

<script setup>
import SummaryCard from '@/components/transaction/manage/SummaryCard.vue'
import StatusSummary from '@/components/transaction/manage/StatusSummary.vue'
import TransactionTable from '@/components/transaction/manage/TransactionTable.vue'
import OrderForm from '@/components/dashboard/form/OrderForm.vue'
import OrderView from '@/components/dashboard/form/OrderView.vue'
import PaymentConfirm from '@/components/dashboard/form/PaymentConfirm.vue'

const transactionStore = useTransactionStatsStore()
const statusStore = useStatusStore()

const idValueSelected = ref(null)
const showEditModal = ref(false)
const showPaymentModal = ref(false)
const openViewModalValue = ref(false)
const openPaymentConfirmModalValue = ref(false)
const loading = ref(false)

const todayTransactions = computed(() => transactionStore.todayTransactions ?? 0)
const completedTransactions = computed(() => transactionStore.completedTransactions ?? 0)
const statusSummary = computed(() => transactionStore.runningTransactionsByStatus ?? [])
const transactions = computed(() => transactionStore.items ?? [])
const meta = computed(() => transactionStore.meta ?? {})
const statusOptions = computed(() => [{ label: 'All', value: '' }, ...statusStore.options])

async function initPageData() {
  try {
    loading.value = true
    if (!transactionStore.items?.length) {
      await transactionStore.fetchItems()
    }
    if (!statusStore.items?.length) {
      await statusStore.fetch()
    }
  } catch (err) {
    notifyError(err, 'Gagal memuat data awal')
  } finally {
    loading.value = false
  }
}
onMounted(initPageData)

const columns = [
  { key: 'invoiceNumber', label: 'Invoice' },
  { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Tanggal Pesanan' },
  { key: 'actions', label: 'Aksi' },
]

async function handlePageChange(newPage) {
  try {
    loading.value = true
    await transactionStore.fetchItems({ page: newPage })
  } catch (err) {
    notifyError(err, 'Gagal mengganti halaman')
  } finally {
    loading.value = false
  }
}

async function setFilterStatus(status) {
  try {
    loading.value = true
    transactionStore.setFilter('status', status)
    await transactionStore.fetchItems({ page: 1 })
  } catch (err) {
    notifyError(err, 'Gagal filter status')
  } finally {
    loading.value = false
  }
}

async function handleLimitChange(newLimit) {
  try {
    loading.value = true
    await transactionStore.fetchItems({ limit: newLimit })
  } catch (err) {
    notifyError(err, 'Gagal mengganti limit')
  } finally {
    loading.value = false
  }
}

async function handleSearch(search) {
  try {
    loading.value = true
    await transactionStore.fetchItems({ search })
  } catch (err) {
    notifyError(err, 'Gagal mencari data')
  } finally {
    loading.value = false
  }
}

async function deleteOrder(orderId) {
  try {
    loading.value = true
    await transactionStore.deleteItem(orderId)
    await transactionStore.fetchItems()
  } catch (err) {
    notifyError(err, 'Gagal menghapus pesanan')
  } finally {
    loading.value = false
  }
}

function handleView(orderId) {
  idValueSelected.value = orderId
  openViewModalValue.value = true
}

function handleEdit(orderId) {
  idValueSelected.value = orderId
  showEditModal.value = true
}

function handleEditPayment(orderId) {
  idValueSelected.value = orderId
  showPaymentModal.value = true
}

function handleConfirmPayment(orderId) {
  idValueSelected.value = orderId
  openPaymentConfirmModalValue.value = true
}

async function handleDownload() {
  try {
    loading.value = true

    await notifyConfirm({
      title: 'Download Data',
      message: `Apakah Anda yakin ingin download data ini?`,
    })

    const res = await transactionStore.exportTransactions({
      status: transactionStore.filters?.status || '',
      search: transactionStore.filters?.search || '',
    })

    const fileUrl = `${__BASE_URL__}${res.data.replace(/\\/g, '/')}`

    const link = document.createElement('a')
    link.href = fileUrl
    link.setAttribute('download', `transactions_${Date.now()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    if (err !== 'cancelled') {
      notifyError(err, `Gagal download data`)
    }
  } finally {
    loading.value = false
  }
}
</script>
