<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar
      title="Admin Panel"
      :active="activeMenu"
      :menuItems="filteredMenuItems"
      @change="activeMenu = $event"
    />

    <main class="p-6">
      <DashboardView v-if="activeMenu === 'dashboard'" />
      <UserList v-else-if="activeMenu === 'users'" />
      <TransactionList v-else-if="activeMenu === 'transactions'" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import Navbar from '@/components/Navbar.vue'
import DashboardView from './component/DashboardView.vue'
import UserList from './component/UserList.vue'
import TransactionList from './component/TransactionList.vue'

const userStore = useAuthStore()
const activeMenu = ref('dashboard')

const role = computed(() => userStore.role)

const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'users', label: 'Daftar User' },
  { key: 'transactions', label: 'Transaksi' },
]

const filteredMenuItems = computed(() => {
  if (role.value === 'SUPER_ADMIN') {
    return menuItems
  }
  return menuItems.filter((item) => item.key !== 'users')
})
</script>
