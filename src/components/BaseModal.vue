<template>
  <transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="close"
    >
      <transition name="modal-scale">
        <div
          v-if="modelValue"
          :class="[
            'rounded-2xl shadow-xl w-full mx-4 relative max-h-[90vh] flex flex-col',
            widthClass,
            themeClass.baseDiv[variant],
          ]"
        >
          <div class="flex items-center justify-between px-6 pt-6 pb-4">
            <h3 class="text-lg font-semibold" :class="themeClass.text.secondary">
              {{ title }}
            </h3>
            <button
              class="p-1 rounded-full hover:opacity-80 transition"
              @click="close"
              :class="themeClass.text.secondary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto px-6 pb-6 scrollbar-none">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { useThemeClass } from '@/composables/useThemeClass'
import { computed } from 'vue'

const themeClass = useThemeClass()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'lg',
    validator: (val) =>
      ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].includes(val),
  },
  variant: {
    type: String,
    default: 'secondary',
  },
})

const widthClass = computed(() => {
  return `max-w-${props.size}`
})

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-scale-enter-from {
  transform: scale(0.95);
  opacity: 0;
}
.modal-scale-leave-active {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}
.modal-scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
