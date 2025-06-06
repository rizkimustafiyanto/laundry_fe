<template>
  <header
    class="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center transition duration-300"
  >
    <h1 class="text-2xl font-semibold text-blue-600 dark:text-blue-400" style="min-height: 2.25rem">
      {{ title }}
    </h1>

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
              class="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md z-20"
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
        class="text-gray-600 dark:text-yellow-300 hover:text-yellow-500 transition duration-150 ml-4"
        title="Toggle Theme"
      >
        <font-awesome-icon v-if="theme === 'light'" :icon="['fas', 'sun']" class="w-5 h-5" />
        <font-awesome-icon v-else :icon="['fas', 'moon']" class="w-5 h-5" />
      </button>

      <font-awesome-icon
        icon="right-from-bracket"
        class="cursor-pointer text-gray-600 dark:text-red-400 hover:text-red-500 transition duration-150"
        @click="logout"
        title="Logout"
      />
    </nav>

    <div class="md:hidden flex gap-6">
      <button
        @click="toggleTheme"
        class="text-gray-600 dark:text-yellow-300 hover:text-yellow-500 transition duration-150"
        title="Toggle Theme"
      >
        <font-awesome-icon v-if="theme === 'light'" :icon="['fas', 'sun']" class="w-5 h-5" />
        <font-awesome-icon v-else :icon="['fas', 'moon']" class="w-5 h-5" />
      </button>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-600 dark:text-gray-300">
        <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" />
      </button>
    </div>
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
            <font-awesome-icon :icon="['fas', 'chevron-down']" class="w-4 h-4 ml-2" />
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
