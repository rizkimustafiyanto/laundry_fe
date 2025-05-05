<template>
  <div
    v-if="type === 'full'"
    class="absolute inset-0 z-50 bg-white/50 flex items-center justify-center"
  >
    <div class="flex items-center gap-2 text-gray-500">
      <svg
        class="animate-spin h-5 w-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{{ message }}</span>
    </div>
  </div>

  <div v-else-if="type === 'mini'" class="flex items-center justify-center text-gray-500 p-4">
    <div class="flex items-center gap-2">
      <svg
        class="animate-spin h-5 w-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'full',
  },
  message: {
    type: String,
    default: 'Memuat data...',
  },
})
</script>
