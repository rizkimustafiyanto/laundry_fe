<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      class="w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl text-center animate-fade-in bg-white dark:bg-gray-800"
    >
      <font-awesome-icon
        :icon="status === 'success' ? ['far', 'thumbs-up'] : ['fas', 'exclamation-circle']"
        :class="[ 
          'text-5xl mb-4 transition-transform duration-300', 
          status === 'success' ? 'text-green-500 animate-pulse' : 'text-red-500 animate-shake', 
        ]"
      />
      <h2
        :class="[ 
          'text-2xl font-bold mb-2', 
          status === 'success' ? 'text-green-600' : 'text-red-600' 
        ]"
      >
        {{ status === 'success' ? 'SUCCESS' : 'FAILED' }}
      </h2>
      <p class="text-xl mb-6">{{ message }}</p>
      <button
        @click="$emit('close')"
        class="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
      >
        Tutup
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  status: String,
  message: String,
})
defineEmits(['close'])
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
