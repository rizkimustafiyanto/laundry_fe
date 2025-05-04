<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-700">Selamat datang, {{ user?.name }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-xl shadow-md border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Status Cucian</h3>
        <p class="text-lg font-semibold text-gray-800">Sedang Diproses</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-md border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Tagihan</h3>
        <p class="text-lg font-semibold text-gray-800">Rp 75.000</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-md border">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Estimasi Selesai</h3>
        <p class="text-lg font-semibold text-gray-800">03 Mei 2025</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
const user = computed(() => useAuthStore().user)
</script>
