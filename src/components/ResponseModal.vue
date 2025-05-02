<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white w-full max-w-md mx-4 p-6 rounded-2xl shadow-xl text-center animate-fade-in"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      <button
        @click="$emit('close')"
        class="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
      >
        Tutup
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
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
</style>
