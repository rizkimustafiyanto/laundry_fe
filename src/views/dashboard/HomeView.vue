<script setup>
import defaultLogo from '@/assets/logo.svg'
import { buildMenu } from '@/utils/menu.builder'

const route = useRoute()
const router = useRouter()
const userStore = useAuthStore()
const profileStore = useCompanyProfileStore()
const { items: profiles } = storeToRefs(profileStore)

const role = computed(() => userStore.role)

const filteredMenuItems = computed(() => buildMenu(role.value))

const themeClass = useThemeClass()

const logoSrc = ref(defaultLogo)
const appName = ref('Dashboard Panel')

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

function navigateTo(path) {
  router.push(path)
}
</script>

<template>
  <div :class="['min-h-screen', themeClass.thead]">
    <BaseNavbar
      :title="appName"
      :logoSrc="logoSrc"
      :active="route.path"
      :menuItems="filteredMenuItems"
      @change="navigateTo"
    />

    <main class="p-6 max-w-6xl mx-auto">
      <router-view v-slot="{ Component }">
        <Transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>
