<template>
  <div>
    <div class="space-y-6">
      <BaseCard type="grid" :cols="2" variant="secondary">
        <SummaryCard title="Transaksi Hari Ini" :value="todayTransactions" />
        <SummaryCard title="Transaksi Selesai" :value="completedTransactions" />
      </BaseCard>

      <StatusSummary :statusSummary="statusSummary" />

      <BaseCard variant="secondary" class="p-4 md:p-5 rounded-2xl shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 class="text-sm font-semibold flex items-center gap-2" :class="themeClass.text.subtle">
            <i class="fa-solid fa-star" :class="themeClass.text.warning"></i>
            Kepuasan Pelanggan
          </h3>

          <span
            class="text-[11px] px-2 py-1 rounded-full w-fit"
            :class="[themeClass.background.secondary, themeClass.text.muted]"
          >
            Total: {{ summary?.totalReviews || 0 }} ulasan
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col items-center md:items-center md:justify-center space-y-1">
            <span class="text-3xl font-bold" :class="themeClass.text.primary">
              {{ summary?.rating?.toFixed(1) || 0 }}
            </span>

            <div class="flex gap-1 text-sm">
              <i
                v-for="i in 5"
                :key="i"
                class="fa-star"
                :class="
                  i <= Math.round(summary?.rating)
                    ? ['fa-solid', themeClass.text.warning]
                    : ['fa-regular', themeClass.text.muted]
                "
              />
            </div>

            <span class="text-xs" :class="themeClass.text.muted"> Rata-rata rating </span>
          </div>

          <div class="space-y-3 col-span-1 md:col-span-2">
            <div
              v-for="rate in [5, 4, 3, 2, 1]"
              :key="rate"
              class="flex items-center gap-2 text-xs w-full"
            >
              <span class="w-4 shrink-0">{{ rate }}</span>

              <i class="fa-solid fa-star shrink-0" :class="themeClass.text.warning"></i>

              <div
                class="flex-1 h-2 rounded-full overflow-hidden"
                :class="themeClass.background.secondary"
              >
                <div
                  class="h-full rounded-full transition-all duration-500 ease-out"
                  :class="themeClass.background.primary"
                  :style="{ width: (ratingPercentage[rate] || 0) + '%' }"
                />
              </div>

              <span class="w-10 text-right shrink-0" :class="themeClass.text.muted">
                {{ ratingPercentage[rate] || 0 }}%
              </span>
            </div>
          </div>
        </div>

        <div
          class="border-t pt-4 space-y-3 max-h-[320px] md:max-h-[260px] overflow-y-auto pr-1"
          :class="themeClass.border.secondary"
        >
          <div
            v-if="!listReview?.length && !loading"
            class="text-center text-sm py-4"
            :class="themeClass.text.muted"
          >
            Belum ada ulasan dari pelanggan
          </div>

          <BaseLoadingSpinner v-else-if="loading" type="mini" />

          <div
            v-for="review in listReview"
            :key="review.id"
            class="p-3 md:p-4 rounded-xl space-y-2"
            :class="themeClass.background.secondary"
          >
            <div class="flex justify-between items-start gap-3">
              <div class="flex gap-2 items-center min-w-0">
                <img
                  v-if="review.user?.photo"
                  :src="`${__BASE_URL__}${review.user.photo}`"
                  class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0"
                />

                <div class="min-w-0">
                  <p class="font-medium text-sm truncate" :class="themeClass.text.primary">
                    {{ review.user?.name || 'Anonymous' }}
                  </p>

                  <div class="flex gap-1 text-[11px]">
                    <i
                      v-for="i in 5"
                      :key="i"
                      class="fa-star"
                      :class="
                        i <= review.rating
                          ? ['fa-solid', themeClass.text.warning]
                          : ['fa-regular', themeClass.text.muted]
                      "
                    />
                  </div>
                </div>
              </div>

              <span class="text-[10px] whitespace-nowrap" :class="themeClass.text.muted">
                {{ formatDate(review.createdAt) }}
              </span>
            </div>

            <p class="text-xs leading-relaxed break-words" :class="themeClass.text.subtle">
              {{ review.comment || 'Tidak ada komentar' }}
            </p>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="secondary" class="p-4 rounded-xl shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-sm font-medium flex items-center gap-2" :class="themeClass.text.subtle">
            <i :class="['fa-solid fa-chart-simple', themeClass.icon.secondary]"></i>
            Grafik Pesanan per Bulan
          </h3>
        </div>

        <BaseLoadingSpinner v-if="loading && !profitByMonth" type="mini" />
        <BaseChart
          v-else
          type="line"
          :categories="profitByMonth.categories"
          :data="profitByMonth.data"
          format="currency"
        />
      </BaseCard>

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

const companyStore = useCompanyProfileStore()
const transactionStore = useTransactionStatsStore()
const statusStore = useStatusStore()
const transactionStatStore = useTransactionStatsStore()
const reviewStore = useCompanyReviewStore()
const themeClass = useThemeClass()

const idValueSelected = ref(null)
const showEditModal = ref(false)
const showPaymentModal = ref(false)
const openViewModalValue = ref(false)
const openPaymentConfirmModalValue = ref(false)
const loading = ref(false)
const summary = ref(null)

const todayTransactions = computed(() => transactionStatStore.todayTransactions ?? 0)
const completedTransactions = computed(() => transactionStatStore.completedTransactions ?? 0)
const statusSummary = computed(() => transactionStatStore.runningTransactionsByStatus ?? [])
const transactions = computed(() => transactionStore.items ?? [])
const meta = computed(() => transactionStore.meta ?? {})
const statusOptions = computed(() => [{ label: 'All', value: '' }, ...statusStore.options])
const profitByMonth = computed(() => transactionStatStore.profitByMonth)
const listReview = computed(() => reviewStore.items)

const ratingCount = computed(() => {
  const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  if (!listReview.value?.length) return result

  listReview.value.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      result[r.rating]++
    }
  })

  return result
})

/* Hitung persentase per bintang */
const ratingPercentage = computed(() => {
  const total = summary.value?.totalReviews || 1
  const percent = {}

  for (let i = 1; i <= 5; i++) {
    percent[i] = Math.round((ratingCount.value[i] / total) * 100)
  }

  return percent
})

async function initPageData() {
  try {
    loading.value = true
    if (!transactionStore.items?.length) {
      await transactionStore.fetchItems()
    }
    if (!statusStore.items?.length) {
      await statusStore.fetch()
    }
    await transactionStatStore.fetchItems({ limit: 10000 })
    await reviewStore.fetchByCompany(companyStore.items[0].id)
    summary.value = await reviewStore.fetchRatingSummary(companyStore.items[0].id)
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

    console.log('AWW')

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
