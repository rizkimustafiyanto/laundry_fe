<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      :class="[
        'w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl text-center animate-fade-in',
        themeClass.baseDiv.secondary,
      ]"
    >
      <i
        :class="[
          'text-5xl mb-4 transition-transform duration-300',
          status === 'success'
            ? 'far fa-thumbs-up ' + themeClass.icon.success + ' animate-pulse'
            : 'fas fa-exclamation-circle ' + themeClass.icon.red + ' animate-shake',
        ]"
      ></i>

      <h2
        :class="[
          'text-2xl font-bold mb-2',
          status === 'success' ? themeClass.text.success : themeClass.text.red,
        ]"
      >
        {{ status === 'success' ? 'SUCCESS' : 'FAILED' }}
      </h2>

      <p class="text-xl mb-6">{{ message }}</p>

      <button
        @click="$emit('close')"
        :class="[
          'inline-flex items-center justify-center px-5 py-2 rounded-lg font-semibold transition duration-200',
          status === 'success' ? themeClass.button.success : themeClass.button.danger,
        ]"
      >
        Tutup
      </button>
    </div>
  </div>
</template>

<script setup>
import { useThemeClass } from '@/composables/useThemeClass.js'

defineProps({
  visible: Boolean,
  status: String,
  message: String,
})
defineEmits(['close'])

const themeClass = useThemeClass()
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-6px);
  }
  40%,
  80% {
    transform: translateX(6px);
  }
}

.animate-shake {
  animation: shake 0.6s ease-in-out;
}
</style>
