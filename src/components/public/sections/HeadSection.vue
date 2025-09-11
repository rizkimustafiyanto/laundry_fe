<template>
  <nav class="shadow-md fixed top-0 left-0 w-full z-50" :class="themeClass.thead">
    <div class="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img
          :src="logoSrc"
          :alt="appName + ' Logo'"
          class="h-12 w-12 object-cover"
          @error="onLogoError"
        />
        <span class="text-2xl font-bold" :class="themeClass.text.teal">{{ appName }}</span>
      </div>

      <div>
        <BaseButton :variant="'teal'" :label="buttonLabel" @click="goToRoute" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import defaultLogo from '@/assets/logo.svg'

const store = useCompanyProfileStore()
const { items } = storeToRefs(store)

const logoSrc = ref(defaultLogo)
const appName = ref('LaundryKuy')
const themeClass = useThemeClass()

const authStore = useAuthStore()
const { user: dataLogin } = storeToRefs(authStore)

const router = useRouter()

watch(
  items,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      logoSrc.value = newItems[0].logoUrl ? `${__BASE_URL__}${newItems[0].logoUrl}` : defaultLogo
      appName.value = newItems[0].name || 'LaundryKuy'
    } else {
      logoSrc.value = defaultLogo
      appName.value = 'LaundryKuy'
    }
  },
  { immediate: true },
)

function onLogoError(event) {
  event.target.src = defaultLogo
}

const buttonLabel = computed(() => {
  return dataLogin.value ? 'Dashboard' : 'Login'
})

function goToRoute() {
  if (dataLogin.value) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>
