<template>
  <nav
    v-if="totalPages > 0"
    class="flex items-center justify-between pt-4 w-full overflow-x-auto"
    aria-label="Table navigation"
  >
    <span :class="['font-medium', labelClass, themeClass.text.dark]">
      Tampil <span class="font-semibold">{{ display.from }}</span> -
      <span class="font-semibold">{{ display.to }}</span> dari
      <span class="font-semibold">{{ display.total }}</span>
    </span>

    <ul :class="['inline-flex -space-x-px', ulClass]">
      <li>
        <button
          :disabled="display.page <= 1"
          @click="$emit('page-change', display.page - 1)"
          :class="[
            btnClass,
            themeClass.button.secondary,
            'rounded-s-lg',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ]"
        >
          Previous
        </button>
      </li>

      <li v-for="p in totalPages" :key="p">
        <button
          @click="$emit('page-change', p)"
          :class="[
            btnClass,
            p === display.page ? themeClass.button.primary : themeClass.button.secondary,
            'rounded-none',
          ]"
        >
          {{ p }}
        </button>
      </li>

      <li>
        <button
          :disabled="display.page >= totalPages"
          @click="$emit('page-change', display.page + 1)"
          :class="[
            btnClass,
            themeClass.button.secondary,
            'rounded-e-lg',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ]"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const themeClass = useThemeClass()

const props = defineProps({
  pagination: Object,
  size: { type: String, default: 'md' },
})

defineEmits(['page-change'])

const totalPages = computed(() => {
  if (!props.pagination?.totalData || !props.pagination?.limit) return 1
  return Math.ceil(props.pagination.totalData / props.pagination.limit)
})

const display = computed(() => {
  if (!props.pagination) return { from: 0, to: 0, total: 0, page: 1 }
  const { currentPage = 1, limit = 10, totalData = 0 } = props.pagination
  const from = totalData === 0 ? 0 : (currentPage - 1) * limit + 1
  const to = Math.min(currentPage * limit, totalData)
  return { from, to, total: totalData, page: currentPage }
})

const sizeMap = {
  xs: { btn: 'px-1 h-5 text-[10px]', ul: 'text-[10px] h-5', label: 'text-xs' },
  sm: { btn: 'px-2 h-6 text-xs', ul: 'text-xs h-6', label: 'text-xs' },
  md: { btn: 'px-3 h-8 text-sm', ul: 'text-sm h-8', label: 'text-sm' },
  lg: { btn: 'px-4 h-10 text-base', ul: 'text-base h-10', label: 'text-base' },
}

const btnClass = computed(() => sizeMap[props.size]?.btn || sizeMap.md.btn)
const ulClass = computed(() => sizeMap[props.size]?.ul || sizeMap.md.ul)
const labelClass = computed(() => sizeMap[props.size]?.label || sizeMap.md.label)
</script>
