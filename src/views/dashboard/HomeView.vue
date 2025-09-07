<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildMenu } from '@/utils/menu.builder'

const route = useRoute()
const router = useRouter()
const userStore = useAuthStore()

const role = computed(() => userStore.role)

const filteredMenuItems = computed(() => buildMenu(role.value))

function navigateTo(path) {
  router.push(path)
}
</script>

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
