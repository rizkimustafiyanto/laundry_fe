<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const themeClass = useThemeClass()

const stars = computed(() => [1, 2, 3, 4, 5])

const setRating = (star) => {
  if (props.readonly) return
  emit('update:modelValue', star)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <span
      v-for="star in stars"
      :key="star"
      @click="setRating(star)"
      :class="[
        'transition-all select-none',
        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
        star <= modelValue ? themeClass.text.warning : themeClass.text.secondary,
        'text-xl sm:text-2xl',
      ]"
    >
      ★
    </span>
  </div>
</template>
