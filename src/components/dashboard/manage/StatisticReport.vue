<template>
  <BaseCard variant="mist">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-medium" :class="themeClass.text.subtle">Grafik Pesanan</h3>

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
</template>

<script setup>
const themeClass = useThemeClass()
const transactionStatStore = useTransactionStatsStore()
const { transactionsByMonth } = storeToRefs(transactionStatStore)

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
