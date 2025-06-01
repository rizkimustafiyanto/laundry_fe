<template>
  <div class="min-h-screen">
    <BaseNavbar
      title="Admin Panel"
      :active="route.path"
      :menuItems="filteredMenuItems"
      @change="navigateTo"
    />

    <main class="p-6">
      <router-view v-slot="{ Component }">
        <Transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'

const route = useRoute()
const router = useRouter()
const userStore = useAuthStore()

const role = computed(() => userStore.role)

const menuItems = [
  { key: '/home', label: 'Dashboard' },
  {
    key: '/home/users',
    label: 'User Management',
    children: [
      { key: '/home/users', label: 'Daftar User' },
      { key: '/home/profile', label: 'Profile' },
    ],
  },
  { key: '/home/transactions', label: 'Transaksi' },
]

const filteredMenuItems = computed(() => {
  if (role.value === 'SUPER_ADMIN') {
    return menuItems
  }
  return menuItems.filter((item) => item.key !== '/home/users')
})

function navigateTo(path) {
  router.push(path)
}
</script>
