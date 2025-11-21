<template>
  <apexchart :type="type" :height="height" :options="resolvedOptions" :series="resolvedSeries" />
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'line' },
  height: { type: [String, Number], default: 300 },
  categories: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  hoverOnly: { type: Boolean, default: true },
  format: {
    type: String,
    default: 'raw', // 'raw' | 'currency' | 'percent' | 'custom'
  },
  currency: {
    type: String,
    default: 'IDR',
  },
  locale: {
    type: String,
    default: 'id-ID',
  },
  customFormatter: {
    type: Function,
    default: null,
  },
})

const themeStore = useThemeStore()
const theme = computed(() => themeStore.theme || 'light')
const themeClass = useThemeClass()

const formatValue = (val) => {
  if (typeof val !== 'number') return val

  switch (props.format) {
    case 'currency':
      return formatCurrency(val, { currency: props.currency, locale: props.locale })

    case 'percent':
      return `${val}%`

    case 'custom':
      return props.customFormatter ? props.customFormatter(val) : val

    default:
      return val
  }
}

const resolvedSeries = computed(() => {
  if (props.type === 'donut' || props.type === 'pie') {
    return props.data.map((v) => Number(v) || 0)
  }

  return [
    {
      name: 'Data',
      data: props.data.map((v) => Number(v) || 0),
    },
  ]
})

const resolvedOptions = computed(() => {
  const common = {
    theme: { mode: theme.value },

    legend: {
      position: 'bottom',
      labels: { colors: themeClass.value.text.subtle },
    },

    tooltip: {
      y: {
        formatter: (val) => formatValue(val),
      },
    },
  }

  if (props.type === 'donut' || props.type === 'pie') {
    return {
      ...common,
      stroke: {
        show: true,
        colors: [theme.value === 'dark' ? '#1e1e1e' : '#fff'],
        width: 2,
      },

      chart: { type: props.type },

      labels: props.categories,

      dataLabels: {
        enabled: !props.hoverOnly,
        formatter: (val, opts) => {
          const realValue = opts.w.config.series[opts.seriesIndex] ?? 0

          return formatValue(realValue)
        },
      },

      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => formatValue(val),
        },
      },
    }
  }

  return {
    ...common,

    chart: { type: props.type, toolbar: { show: false } },

    dataLabels: {
      enabled: !props.hoverOnly,
      formatter: (val) => formatValue(val),
    },

    xaxis: {
      categories: props.categories,
      labels: { style: { colors: themeClass.value.text.subtle } },
    },

    yaxis: {
      labels: {
        style: { colors: themeClass.value.text.subtle },
        formatter: (val) => formatValue(val),
      },
    },

    stroke: { curve: 'smooth', width: 3 },
  }
})
</script>
