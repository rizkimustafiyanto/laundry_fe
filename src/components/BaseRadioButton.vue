<script setup>
const themeClass = useThemeClass()

const props = defineProps({
  modelValue: [String, Number, Boolean],
  label: String,
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  type: {
    type: String,
    default: 'vertical',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
  },
  noBorder: {
    type: Boolean,
    default: false,
  },
  sizeVariant: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
})

const wrapperClass = computed(() =>
  props.type === 'horizontal' ? 'flex flex-row flex-wrap' : 'flex flex-col',
)

const sizeMap = {
  xs: { circle: 'w-4 h-4', text: 'text-xs', gap: 'ml-1' },
  sm: { circle: 'w-6 h-6', text: 'text-sm', gap: 'ml-2' },
  md: { circle: 'w-8 h-8', text: 'text-base', gap: 'ml-2' },
  lg: { circle: 'w-10 h-10', text: 'text-lg', gap: 'ml-3' },
  xl: { circle: 'w-12 h-12', text: 'text-xl', gap: 'ml-3' },
}

const sizeStyle = computed(() => sizeMap[props.sizeVariant] || sizeMap.sm)
</script>

<template>
  <div class="relative">
    <label
      v-if="label"
      class="block mb-2 font-medium"
      :class="[themeClass.text.dark, sizeStyle.text]"
    >
      {{ label }}
    </label>

    <div :class="wrapperClass">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center cursor-pointer transition"
        :class="type === 'vertical' ? 'mb-2 last:mb-0' : 'mr-4 last:mr-0'"
      >
        <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="hidden peer"
        />

        <div
          class="rounded-full flex items-center justify-center transition-all"
          :class="[sizeStyle.circle, 'border-2']"
        >
          <div
            v-if="modelValue === option.value"
            class="rounded-full transition-all"
            :class="[
              'bg-blue-600',
              {
                'w-2 h-2': sizeVariant === 'xs',
                'w-3 h-3': sizeVariant === 'sm',
                'w-4 h-4': sizeVariant === 'md',
                'w-5 h-5': sizeVariant === 'lg',
                'w-6 h-6': sizeVariant === 'xl',
              },
            ]"
          ></div>
        </div>

        <span :class="[sizeStyle.gap, themeClass.text.dark, sizeStyle.text]">
          {{ option.label }}
        </span>
      </label>
    </div>
  </div>
</template>
