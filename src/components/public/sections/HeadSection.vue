<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <img
          :src="logoSrc"
          :alt="appName + ' Logo'"
          class="h-12 w-12 object-cover rounded-full shadow"
          @error="onLogoError"
        />
        <span class="text-2xl font-bold text-gray-800">{{ appName }}</span>
      </div>

      <div class="hidden md:flex space-x-6 items-center">
        <a href="#services" class="text-gray-600 hover:text-teal-600">Services</a>
        <a href="#about" class="text-gray-600 hover:text-teal-600">About</a>
        <a href="#gallery" class="text-gray-600 hover:text-teal-600">Gallery</a>
        <BaseButton variant="teal" :label="buttonLabel" @click="goToRoute" />
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
