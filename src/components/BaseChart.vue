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
  const common = {
    theme: { mode: theme.value },
    stroke: {
      show: true,
      colors: [theme.value === 'dark' ? '#1e1e1e' : '#fff'], // atau 'transparent'
      width: 2,
    },
    legend: {
      position: 'bottom',
      labels: { colors: themeClass.value.text.subtle },
    },
  }

  if (props.type === 'donut' || props.type === 'pie') {
    return {
      ...common,
      chart: { type: props.type },
      labels: props.categories,
    }
  }

  return {
    ...common,
    chart: { type: props.type, toolbar: { show: false } },
    xaxis: {
      categories: props.categories,
      labels: { style: { colors: themeClass.value.text.subtle } },
    },
    yaxis: {
      labels: { style: { colors: themeClass.value.text.subtle } },
    },
    stroke: { curve: 'smooth', width: 3 }, // khusus line/bar
  }
})
</script>
