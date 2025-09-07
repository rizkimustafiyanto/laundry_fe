<template>
  <div class="space-y-6">
    <BaseCard type="grid" :cols="2" variant="glass">
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
      @cancel="updateOrderStatusToCancelled"
      @delete="deleteOrder"
    />
  </div>
</template>

<script setup>
import SummaryCard from '@/components/transaction/manage/SummaryCard.vue'
import StatusSummary from '@/components/transaction/manage/StatusSummary.vue'
import TransactionTable from '@/components/transaction/manage/TransactionTable.vue'

const transactionStore = useTransactionStore()
const statusStore = useStatusStore()
const loadingStore = useLoadingStore()

const todayTransactions = computed(() => transactionStore.todayTransactions ?? 0)
const completedTransactions = computed(() => transactionStore.completedTransactions ?? 0)
const statusSummary = computed(() => transactionStore.runningTransactionsByStatus ?? [])
const transactions = computed(() => transactionStore.items ?? [])
const meta = computed(() => transactionStore.meta ?? {})
const loading = computed(() => loadingStore.isMiniLoading)
const statusOptions = computed(() => [{ label: 'All', value: '' }, ...statusStore.options])

async function initPageData() {
  if (!transactionStore.items?.length) {
    await transactionStore.fetchItems()
  }
  if (!statusStore.items?.length) {
    await statusStore.fetch()
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

function handlePageChange(newPage) {
  transactionStore.fetchItems({ page: newPage })
}

function setFilterStatus(status) {
  transactionStore.setFilter('status', status)
}

const handleLimitChange = (newLimit) => {
  transactionStore.fetchItems({ limit: newLimit })
}

const handleSearch = (search) => {
  transactionStore.fetchItems({ search })
}

async function updateOrderStatusToCancelled(orderId) {
  await transactionStore.updateTransactionStatus(orderId, 'CANCELLED')
}

async function deleteOrder(orderId) {
  await transactionStore.deleteItem(orderId)
}
</script>
