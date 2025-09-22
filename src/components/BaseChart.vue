<template>
  <apexchart :type="type" :height="height" :options="resolvedOptions" :series="resolvedSeries" />
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'line' },
  height: { type: [String, Number], default: 300 },
  categories: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
})

const themeStore = useThemeStore()
const theme = computed(() => themeStore.theme || 'light')
const themeClass = useThemeClass()

const resolvedSeries = computed(() => {
  if (props.type === 'donut' || props.type === 'pie') {
    return props.data
  }
  return [{ name: 'Data', data: props.data }]
})

const resolvedOptions = computed(() => {
  if (props.type === 'donut' || props.type === 'pie') {
    return {
      chart: { type: props.type },
      theme: { mode: theme.value },
      labels: props.categories,
      legend: { position: 'bottom', labels: { colors: themeClass.value.text.subtle } },
    }
  }
  return {
    chart: { type: props.type, toolbar: { show: false } },
    theme: { mode: theme.value },
    xaxis: {
      categories: props.categories,
      labels: { style: { colors: themeClass.value.text.subtle } },
    },
    stroke: { curve: 'smooth', width: 3 },
    yaxis: {
      labels: { style: { colors: themeClass.value.text.subtle } },
    },
  }
})
</script>
