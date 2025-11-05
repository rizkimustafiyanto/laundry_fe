<template>
  <header
    class="shadow-md px-6 py-4 flex justify-between items-center transition duration-300"
    :class="themeClass.baseDiv.subtle"
  >
    <h1
      :class="['text-2xl font-semibold cursor-pointer', themeClass.text.teal]"
      @click="$router.push('/')"
    >
      {{ title }}
    </h1>

    <nav class="hidden md:flex items-center">
      <template v-for="item in menuItems" :key="item.key">
        <div v-if="item.children" class="relative">
          <div @click="toggleDropdown(item.key)" class="z-10 focus:outline-none px-1">
            <div
              :class="[
                menuClass(item.key),
                themeClass.hoverless.teal,
                'cursor-pointer flex items-center gap-2',
              ]"
            >
              <i v-if="item.icon" :class="`fas fa-${item.icon} w-4 h-4`"></i>
              {{ item.label }}
            </div>
          </div>
          <transition name="fade-scale">
            <div
              v-show="openDropdown === item.key"
              :class="[
                'absolute top-full mt-2 w-full rounded-lg shadow-md z-20',
                themeClass.borderColor,
                themeClass.dropdown,
              ]"
            >
              <div
                v-for="child in item.children"
                :key="child.key"
                @click="selectDropdown(child.key)"
                :class="[
                  menuClass(child.key),
                  'w-full text-left cursor-pointer flex items-center gap-2',
                  themeClass.hoverless.teal,
                ]"
              >
                <i v-if="child.icon" :class="`fas fa-${child.icon} w-4 h-4`"></i>
                {{ child.label }}
              </div>
            </div>
          </transition>
        </div>
        <div v-else @click="selectDesktop(item.key)" class="px-1">
          <div
            :class="[
              menuClass(item.key),
              themeClass.hoverless.teal,
              'cursor-pointer flex items-center gap-2',
            ]"
          >
            <i v-if="item.icon" :class="`fas fa-${item.icon} w-4 h-4`"></i>
            {{ item.label }}
          </div>
        </div>
      </template>

      <div
        class="flex items-center justify-center cursor-pointer px-1"
        @click="toggleTheme"
        :class="themeClass.icon.warning"
      >
        <i v-if="theme === 'light'" class="fas fa-sun w-5 h-5"></i>
        <i v-else class="fas fa-moon w-5 h-5"></i>
      </div>

      <div
        class="flex items-center justify-center cursor-pointer px-3"
        @click="logout"
        title="Logout"
      >
        <i class="fas fa-right-from-bracket w-5 h-5" :class="themeClass.icon.danger"></i>
      </div>
    </nav>

    <div class="md:hidden flex gap-6">
      <button @click="toggleTheme" title="Toggle Theme" :class="themeClass.icon.orange">
        <i v-if="theme === 'light'" class="fas fa-sun w-5 h-5"></i>
        <i v-else class="fas fa-moon w-5 h-5"></i>
      </button>
      <button @click="mobileMenuOpen = !mobileMenuOpen">
        <i class="fas fa-bars w-6 h-6"></i>
      </button>
    </div>
  </header>

  <transition name="fade-scale">
    <div
      v-show="mobileMenuOpen"
      :class="['md:hidden shadow px-4 py-4 space-y-2', themeClass.baseDiv.subtle]"
    >
      <template v-for="item in menuItems" :key="item.key">
        <div v-if="item.children" class="space-y-1">
          <div
            @click="toggleMobileDropdown(item.key)"
            :class="[
              'w-full text-left px-4 py-2 flex justify-between items-center rounded cursor-pointer',
              themeClass.text.secondary,
            ]"
          >
            {{ item.label }}
            <i class="fas fa-chevron-down w-4 h-4 ml-2"></i>
          </div>
          <transition name="fade-scale">
            <div v-show="openMobileDropdown === item.key" class="space-y-1 px-3">
              <div
                v-for="child in item.children"
                :key="child.key"
                @click="select(child.key)"
                :class="[menuClass(child.key, true), 'cursor-pointer']"
              >
                {{ child.label }}
              </div>
            </div>
          </transition>
        </div>
        <button v-else @click="select(item.key)" :class="[menuClass(item.key, true)]">
          {{ item.label }}
        </button>
      </template>

      <div
        @click="logout"
        :class="[
          'flex items-center gap-2 hover:underline w-full px-4 py-2 mt-2 cursor-pointer',
          themeClass.icon.danger,
        ]"
      >
        <i class="fas fa-right-from-bracket w-4 h-4"></i>
        Logout
      </div>
    </div>
  </transition>
</template>

<script setup>
const themeClass = useThemeClass()

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

  const isActive =
    props.active === key ||
    props.menuItems.some((item) =>
      item.children?.some((child) => child.key === props.active && item.key === key),
    )

  return `${base} ${
    isActive
      ? [themeClass.value.button.teal, 'rounded rounded-b-xl']
      : [themeClass.value.text.muted, 'rounded rounded-b-xl']
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
