<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-[#1A1A1A]/70 border-b border-[#1A1A1A]/30"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <!-- LOGO + NAME -->
      <div class="flex items-center space-x-3">
        <img
          :src="logoSrc"
          :alt="appName"
          class="h-11 w-11 object-cover rounded-xl shadow-md"
          @error="onLogoError"
        />
        <span class="text-2xl font-extrabold tracking-tight">{{ appName }}</span>
      </div>

      <!-- NAV MENU -->
      <div class="hidden md:flex space-x-7 items-center text-[15px] font-medium">
        <a href="#top" class="nav-link">Home</a>
        <a v-if="showAbout" href="#about" class="nav-link">About</a>
        <a v-if="showServices" href="#services" class="nav-link">Services</a>
        <a v-if="showGallery" href="#gallery" class="nav-link">Gallery</a>

        <BaseButton
          variant="teal"
          :icon="buttonIcon"
          @click="goToRoute"
          noBg
          noBorder
          noHover
          rounded="full"
        />
      </div>
    </div>
  </nav>
</template>

<script setup>
import defaultLogo from '@/assets/logo.svg'

const profileStore = useCompanyProfileStore()
const contentStore = useCompanyContentStore()
const mediaStore = useCompanyMediaStore()

const { items: profiles } = storeToRefs(profileStore)
const { items: contents } = storeToRefs(contentStore)
const { items: medias } = storeToRefs(mediaStore)

const logoSrc = ref(defaultLogo)
const appName = ref('LaundryKuy')

const authStore = useAuthStore()
const { user: dataLogin } = storeToRefs(authStore)

const router = useRouter()

const about = computed(() => contents.value.find((c) => c.type === 'ABOUT') || null)
const services = computed(() => contents.value.filter((c) => c.type === 'SERVICE') || [])
// const sponsors = computed(() => medias.value.filter((m) => m.type === 'SPONSOR') || [])
// const testimonials = computed(() => contents.value.filter((c) => c.type === 'TESTIMONIAL') || [])
const galleries = computed(() => medias.value.filter((m) => m.type === 'GALLERY') || [])

const showServices = computed(() => services.value?.length > 0)
const showAbout = computed(() => !!about.value)
const showGallery = computed(() => galleries.value?.length > 0)

watch(
  profiles,
  (newItems) => {
    if (newItems?.length) {
      logoSrc.value = newItems[0].logoUrl ? `${__BASE_URL__}${newItems[0].logoUrl}` : defaultLogo
      appName.value = newItems[0].name
    }
  },
  { immediate: true },
)

function onLogoError(e) {
  e.target.src = defaultLogo
}

const buttonIcon = computed(() => (dataLogin.value ? 'fas fa-user' : 'fas fa-sign-in-alt'))

function goToRoute() {
  router.push(dataLogin.value ? '/dashboard' : '/login')
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-200 hover:text-teal-600 transition relative;
}
.nav-link::after {
  content: '';
  @apply absolute w-0 h-[2px] bg-teal-500 left-0 -bottom-1 transition-all;
}
.nav-link:hover::after {
  @apply w-full;
}
</style>
