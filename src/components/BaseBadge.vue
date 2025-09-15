<template>
  <span
    class="inline-block px-2 py-1 font-medium transition-colors duration-200"
    :class="computedClass"
  >
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variantText: { type: String, default: 'secondary' },
  variantBGColor: { type: String, default: 'pink' },
  variantHover: { type: String, default: null },
  textSize: { type: String, default: 'sm' },
  rounded: { type: String, default: 'xl' },
})

const themeClass = useThemeClass()

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

const computedClass = computed(() => {
  const classes = []

  if (props.variantText && themeClass.value.text[props.variantText]) {
    classes.push(themeClass.value.text[props.variantText])
  }

  if (props.variantBGColor && themeClass.value.background[props.variantBGColor]) {
    classes.push(themeClass.value.background[props.variantBGColor])
  }

  if (props.variantHover && themeClass.value.hover[props.variantHover]) {
    classes.push(themeClass.value.hover[props.variantHover])
  }

  if (textSizeMap[props.textSize]) {
    classes.push(textSizeMap[props.textSize])
  }

  if (roundedMap[props.rounded]) {
    classes.push(roundedMap[props.rounded])
  }

  return classes
})
</script>
