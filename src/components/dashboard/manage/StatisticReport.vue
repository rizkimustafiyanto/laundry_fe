<template>
  <div class="space-y-6">
    <BaseCard variant="mist" class="p-4 rounded-xl shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-medium flex items-center gap-2" :class="themeClass.text.subtle">
          <i :class="['fa-solid fa-chart-simple', themeClass.icon.secondary]"></i>
          Grafik Pesanan per Bulan
        </h3>

        <BaseSelect
          v-model="selectedLimit"
          :options="limitOptions"
          placeholder="Pilih Limit"
          size-variant="sm"
          @update:modelValue="changeLimit"
        />
      </div>

      <BaseChart
        type="donut"
        :categories="transactionsByMonth.categories"
        :data="transactionsByMonth.data"
      />
    </BaseCard>

    <BaseCard variant="mist" class="p-4 rounded-xl shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-medium flex items-center gap-2" :class="themeClass.text.subtle">
          <i :class="['fa-solid fa-chart-pie', themeClass.icon.secondary]"></i>
          Grafik Pesanan per Status
        </h3>

        <BaseSelect
          v-model="selectedLimit"
          :options="limitOptions"
          placeholder="Pilih Limit"
          size-variant="sm"
          @update:modelValue="changeLimit"
        />
      </div>

      <BaseChart
        type="pie"
        :categories="transactionsByStatus.map((s) => s.status)"
        :data="transactionsByStatus.map((s) => s.count)"
      />
    </BaseCard>
  </div>
</template>

<script setup>
const themeClass = useThemeClass()
const transactionStatStore = useTransactionStatsStore()
const { transactionsByMonth, transactionsByStatus } = storeToRefs(transactionStatStore)

const selectedLimit = ref(transactionStatStore.meta.limit)

const limitOptions = [
  { label: '10 Data', value: 10 },
  { label: '100 Data', value: 100 },
  { label: '5000 Data', value: 5000 },
]

onMounted(() => {
  transactionStatStore.fetchItems({ limit: selectedLimit.value })
})

const changeLimit = (value) => {
  transactionStatStore.fetchItems({ limit: value })
}
</script>
