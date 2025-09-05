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
      @hard-delete="hardDelete"
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTransactionStore } from '@/stores/services/transaction.service.js'
import { useOptionsStore } from '@/stores/services/option.service.js'
import { useLoadingStore } from '@/stores/utils/loading.js'

import SummaryCard from '@/components/transaction/manage/SummaryCard.vue'
import StatusSummary from '@/components/transaction/manage/StatusSummary.vue'
import TransactionTable from '@/components/transaction/manage/TransactionTable.vue'

const transactionStore = useTransactionStore()
const statusStore = useOptionsStore()
const loadingStore = useLoadingStore()

const todayTransactions = computed(() => transactionStore.todayTransactions ?? 0)
const completedTransactions = computed(() => transactionStore.completedTransactions ?? 0)
const statusSummary = computed(() => transactionStore.runningTransactionsByStatus ?? [])
const transactions = computed(() => transactionStore.transactions ?? [])
const meta = computed(() => transactionStore.meta ?? {})
const loading = computed(() => loadingStore.isMiniLoading)
const statusOptions = computed(() => [{ label: 'All', value: '' }, ...statusStore.statuses])

async function initPageData() {
  if (!transactionStore.transactions?.length) {
    await transactionStore.fetchTransactions()
  }
  if (!statusStore.statuses?.length) {
    await statusStore.fetchStatuses()
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
  transactionStore.fetchTransactions({ page: newPage })
}

function setFilterStatus(status) {
  transactionStore.fetchTransactions({ page: 1, status })
}

const handleLimitChange = (newLimit) => {
  transactionStore.fetchTransactions({ page: 1, limit: newLimit })
}

const handleSearch = (search) => {
  transactionStore.fetchTransactions({ page: 1, search })
}

async function updateOrderStatusToCancelled(orderId) {
  await transactionStore.updateOrderStatus(orderId, 'CANCELLED')
}

async function deleteOrder(orderId) {
  await transactionStore.deleteOrderSoft(orderId)
}

async function hardDelete(orderId) {
  await transactionStore.deleteOrderHard(orderId)
}
</script>
