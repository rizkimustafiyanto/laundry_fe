<template>
  <header class="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-blue-600 dark:text-blue-400">{{ title }}</h1>

    <nav class="hidden md:flex space-x-4 items-center">
      <template v-for="item in menuItems" :key="item.key">
        <div v-if="item.children" class="relative">
          <button
            @click="toggleDropdown(item.key)"
            :class="menuClass(item.key)"
            class="relative z-10 focus:outline-none"
          >
            {{ item.label }}
          </button>
          <transition name="fade-scale">
            <div
              v-show="openDropdown === item.key"
              class="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md z-20"
            >
              <button
                v-for="child in item.children"
                :key="child.key"
                @click="selectDropdown(child.key)"
                :class="menuClass(child.key)"
              >
                {{ child.label }}
              </button>
            </div>
          </transition>
        </div>
        <button v-else @click="selectDesktop(item.key)" :class="menuClass(item.key)">
          {{ item.label }}
        </button>
      </template>

      <button
        @click="toggleTheme"
        class="text-gray-600 dark:text-yellow-300 hover:text-yellow-500 transition duration-200 ml-4"
        title="Toggle Theme"
      >
        <svg
          v-if="theme === 'light'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m8.485-8.485h1M3.515 12.515h1m15.364-6.364l-.707.707M5.636 18.364l-.707.707m0-12.728l.707.707M18.364 18.364l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      </button>

      <font-awesome-icon
        icon="right-from-bracket"
        class="cursor-pointer text-gray-600 dark:text-red-400 hover:text-red-500 transition duration-200"
        @click="logout"
        title="Logout"
      />
    </nav>

    <button
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="md:hidden text-gray-600 dark:text-gray-300"
    >
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

  <transition name="fade-scale">
    <div
      v-show="mobileMenuOpen"
      class="md:hidden bg-white dark:bg-gray-900 shadow px-4 py-4 space-y-2"
    >
      <template v-for="item in menuItems" :key="item.key">
        <div v-if="item.children" class="space-y-1">
          <button
            @click="toggleMobileDropdown(item.key)"
            class="w-full text-left font-medium text-gray-800 dark:text-gray-200 px-4 py-2 flex justify-between items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {{ item.label }}
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <transition name="fade-scale">
            <div v-show="openMobileDropdown === item.key" class="ml-4 space-y-1">
              <button
                v-for="child in item.children"
                :key="child.key"
                @click="select(child.key)"
                :class="menuClass(child.key, true)"
              >
                {{ child.label }}
              </button>
            </div>
          </transition>
        </div>
        <button v-else @click="select(item.key)" :class="menuClass(item.key, true)">
          {{ item.label }}
        </button>
      </template>

      <button
        @click="logout"
        class="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline w-full px-4 py-2 mt-2"
      >
        <font-awesome-icon icon="right-from-bracket" class="w-4 h-4" />
        Logout
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useThemeStore } from '@/stores/component/theme.js'

const props = defineProps({
  active: String,
  title: { type: String, default: 'Dashboard' },
  menuItems: {
    type: Array,
    default: () => [{ key: 'dashboard', label: 'Dashboard' }],
  },
})

const emit = defineEmits(['change'])

const mobileMenuOpen = ref(false)
const openDropdown = ref(null)
const openMobileDropdown = ref(null)

const toggleDropdown = (key) => {
  openDropdown.value = openDropdown.value === key ? null : key
}

const toggleMobileDropdown = (key) => {
  openMobileDropdown.value = openMobileDropdown.value === key ? null : key
}

const router = useRouter()
const userStore = useAuthStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const select = (menuKey) => {
  emit('change', menuKey)
  mobileMenuOpen.value = false
  openMobileDropdown.value = null
}

const selectDesktop = (key) => {
  emit('change', key)
  openDropdown.value = null
}

const selectDropdown = (key) => {
  emit('change', key)
  openDropdown.value = null
}

const menuClass = (key, mobile = false) => {
  const base = mobile ? 'block w-full text-left px-4 py-2 rounded' : 'px-3 py-2 text-sm rounded'
  const isActive = props.active === key
  return `${base} ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
  }`
}

const themeStore = useThemeStore()
themeStore.applyTheme()
const theme = computed(() => themeStore.theme)
const toggleTheme = () => themeStore.toggleTheme()
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(95%);
}
</style>
