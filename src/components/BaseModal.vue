<template>
  <transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="close"
    >
      <transition name="modal-scale">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative"
          v-if="modelValue"
        >
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white"
            @click="close"
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
          <slot />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
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
