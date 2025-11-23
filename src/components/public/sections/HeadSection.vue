<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-[#1A1A1A]/70 border-b border-[#1A1A1A]/30"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <img
          :src="logoSrc"
          :alt="appName"
          class="h-10 w-10 sm:h-11 sm:w-11 object-cover rounded-xl shadow-md"
          @error="onLogoError"
        />
        <span class="text-xl sm:text-2xl font-extrabold tracking-tight">
          {{ appName }}
        </span>
      </div>

      <div class="hidden md:flex space-x-7 items-center text-[15px] font-medium">
        <a href="#top" class="nav-link">Home</a>
        <a v-if="showAbout" href="#about" class="nav-link">About</a>
        <a v-if="showServices" href="#services" class="nav-link">Services</a>
        <a v-if="showGallery" href="#gallery" class="nav-link">Gallery</a>

        <button @click="goToRoute" class="text-teal-400 hover:text-teal-500 transition text-lg">
          <i :class="buttonIcon" />
        </button>
      </div>

      <button class="md:hidden text-white text-2xl focus:outline-none" @click="isOpen = !isOpen">
        <i class="fa" :class="isOpen ? 'fa-times' : 'fa-bars'" />
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="isOpen" class="md:hidden bg-[#141414]/10 border-t border-[#1A1A1A]/40">
        <div class="px-6 py-5 space-y-5 text-center">
          <a @click="closeMenu" href="#top" class="mobile-link">Home</a>
          <a v-if="showAbout" @click="closeMenu" href="#about" class="mobile-link"> About </a>
          <a v-if="showServices" @click="closeMenu" href="#services" class="mobile-link">
            Services
          </a>
          <a v-if="showGallery" @click="closeMenu" href="#gallery" class="mobile-link"> Gallery </a>

          <button
            @click="goToRoute"
            class="mx-auto flex items-center justify-center gap-2 text-teal-400 hover:text-teal-500 transition text-lg"
          >
            <i :class="buttonIcon" />
          </button>
        </div>
      </div>
    </transition>
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

const authStore = useAuthStore()
const { user: dataLogin } = storeToRefs(authStore)

const router = useRouter()

const logoSrc = ref(defaultLogo)
const appName = ref('LaundryKuy')
const isOpen = ref(false)

const about = computed(() => contents.value.find((c) => c.type === 'ABOUT') || null)
const services = computed(() => contents.value.filter((c) => c.type === 'SERVICE') || [])
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
  isOpen.value = false
}

function closeMenu() {
  isOpen.value = false
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-200 hover:text-teal-500 transition relative;
}

.nav-link::after {
  content: '';
  @apply absolute w-0 h-[2px] bg-teal-500 left-0 -bottom-1 transition-all;
}

.nav-link:hover::after {
  @apply w-full;
}

.mobile-link {
  @apply block text-lg text-gray-200 hover:text-teal-500 transition;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
