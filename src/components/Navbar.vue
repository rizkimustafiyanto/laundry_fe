<template>
  <header class="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold text-blue-600">{{ title }}</h1>

    <!-- Desktop Menu -->
    <nav class="hidden md:flex space-x-4">
      <template v-for="item in menuItems" :key="item.key">
        <button @click="$emit('change', item.key)" :class="menuClass(item.key)">
          {{ item.label }}
        </button>
      </template>
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
      >
        Logout
      </button>
    </nav>

    <!-- Mobile Toggle -->
    <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-600">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </header>

  <!-- Mobile Dropdown -->
  <div v-if="mobileMenuOpen" class="md:hidden bg-white shadow px-4 py-2 space-y-2">
    <template v-for="item in menuItems" :key="item.key">
      <button @click="select(item.key)" :class="menuClass(item.key, true)">
        {{ item.label }}
      </button>
    </template>
    <button @click="logout" class="block w-full text-left text-red-600 hover:underline">
      Logout
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'

const props = defineProps({
  active: String,
  title: {
    type: String,
    default: 'Dashboard',
  },
  menuItems: {
    type: Array,
    default: () => [{ key: 'dashboard', label: 'Dashboard' }],
  },
})

const emit = defineEmits(['change'])

const mobileMenuOpen = ref(false)
const router = useRouter()
const userStore = useAuthStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const select = (menuKey) => {
  emit('change', menuKey)
  mobileMenuOpen.value = false
}

const menuClass = (key, mobile = false) => {
  const base = mobile ? 'block w-full text-left px-4 py-2 rounded' : 'px-3 py-2 text-sm rounded'
  const active = props.active === key ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  return `${base} ${active}`
}
</script>
