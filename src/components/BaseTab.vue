<template>
  <nav
    class="flex space-x-4 mb-6 border-b"
    :class="variant === 'underline' ? themeClass.border[color] : ''"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="getTabClass(tab.value)"
      @click="$emit('update:activeTab', tab.value)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'underline',
  },
  color: {
    type: String,
    default: 'sky',
  },
})

const themeClass = useThemeClass()

const getTabClass = (tab) => {
  const isActive = props.activeTab === tab

  const base = 'px-4 py-2 font-semibold transition-colors'

  if (props.variant === 'underline') {
    if (isActive) {
      return [
        base,
        'border-b-2',
        themeClass.value.border[props.color],
        themeClass.value.text[props.color],
      ].join(' ')
    } else {
      const hover = themeClass.value.hoverText[props.color] || `hover:text-${props.color}-300`
      const text = themeClass.value.textless[props.color] || `text-${props.color}-300/50`
      return [base, hover, text].join(' ')
    }
  }

  if (props.variant === 'pill') {
    if (isActive) {
      return [base, 'rounded-full px-5 py-2', themeClass.value.bg[props.color], 'text-white'].join(
        ' ',
      )
    } else {
      const hover = themeClass.value.hoverBg[props.color] || `hover:bg-${props.color}-100`
      const text = themeClass.value.textless[props.color] || `text-${props.color}-400`
      return [base, 'rounded-full px-5 py-2', hover, text].join(' ')
    }
  }

  if (props.variant === 'plain') {
    if (isActive) {
      return [base, themeClass.value.text[props.color]].join(' ')
    } else {
      const hover = themeClass.value.hoverText[props.color] || `hover:text-${props.color}-300`
      const text = themeClass.value.textless[props.color] || `text-${props.color}-400`
      return [base, hover, text].join(' ')
    }
  }

  return base
}
</script>
