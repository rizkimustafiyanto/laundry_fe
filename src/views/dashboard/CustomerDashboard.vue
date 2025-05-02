<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">Dashboard Customer</h1>
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
      >
        Logout
      </button>
    </header>

    <main class="p-6 space-y-4">
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
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/auth/user'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
